# frozen_string_literal: true

# This model represents the Primero end user and the associated application permissions.
# Primero can be configured to perform its own password-based authentication, in which case the
# User model is responsible for storing the encrypted password and associated whitelisted JWT
# token identifiers. If external identity providers are used (over OpenID Connect), the
# model is not responsible for storing authentication information, and must mirror a user
# in external IDP (such as Azure Active Directory).
class User < ApplicationRecord
  include Importable
  include Devise::JWT::RevocationStrategies::Whitelist

  USER_NAME_REGEX = /\A[^ ]+\z/.freeze
  PASSWORD_REGEX = /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\z/.freeze
  ADMIN_ASSIGNABLE_ATTRIBUTES = [:role_id].freeze

  attr_reader :refresh_associated_user_groups, :refresh_associated_user_agencies

  delegate :can?, :cannot?, to: :ability

  devise :database_authenticatable, :timeoutable, :recoverable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  belongs_to :role
  belongs_to :agency
  belongs_to :identity_provider, optional: true

  has_many :saved_searches
  has_and_belongs_to_many :user_groups
  has_many :audit_logs

  scope :list_by_enabled, -> { where(disabled: false) }
  scope :list_by_disabled, -> { where(disabled: true) }
  scope :by_user_group, (lambda do |ids|
    joins(:user_groups).where(user_groups: { id: ids })
  end)
  scope :by_agency, (lambda do |id|
    joins(:agency).where(agencies: { id: id })
  end)

  alias_attribute :organization, :agency
  alias_attribute :name, :user_name

  before_create :set_agency_services
  before_save :make_user_name_lowercase, :update_owned_by_fields, :update_reporting_location_code, :set_locale
  after_save :reassociate_groups_or_agencies

  validates :full_name, presence: { message: 'errors.models.user.full_name' }
  validates :user_name, presence: true, uniqueness: { message: 'errors.models.user.user_name_uniqueness' }
  validates :user_name, format: { with: USER_NAME_REGEX, message: 'errors.models.user.user_name' }, unless: :using_idp?
  validates :user_name, format: { with: URI::MailTo::EMAIL_REGEXP, message: 'errors.models.user.user_name' },
                        if: :using_idp?
  validates :email, presence: true, if: :using_idp?
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP, message: 'errors.models.user.email' }, allow_nil: true
  validates :password,
            presence: true,
            length: { minimum: 8, message: 'errors.models.user.password_mismatch' },
            format: { with: PASSWORD_REGEX, message: 'errors.models.user.password_mismatch' },
            confirmation: { message: 'errors.models.user.password_mismatch' },
            if: :password_required?
  validates :password_confirmation,
            presence: { message: 'errors.models.user.password_confirmation' },
            if: :password_required?
  validates :role, presence: { message: 'errors.models.user.role_ids' }
  validates :agency, presence: { message: 'errors.models.user.organization' }
  validates :identity_provider, presence: { message: 'errors.models.user.identity_provider' }, if: :using_idp?
  validates :locale,
            inclusion: { in: I18n.available_locales.map(&:to_s), message: 'errors.models.user.invalid_locale' },
            allow_nil: true

  class << self
    def hidden_attributes
      %w[encrypted_password reset_password_token reset_password_sent_at]
    end

    def password_parameters
      %w[password password_confirmation]
    end

    def unique_id_parameters
      %w[user_group_unique_ids role_unique_id]
    end

    def permitted_api_params
      (
        User.attribute_names + User.password_parameters +
        [{ user_group_ids: [] }, { user_group_unique_ids: [] }, :role_unique_id]
      ) - User.hidden_attributes
    end

    def get_unique_instance(attributes)
      User.find_by(user_name: attributes['user_name'])
    end

    def last_login_timestamp(user_name)
      AuditLog.where(action_name: 'login', user_name: user_name).try(:last).try(:timestamp)
    end

    def agencies_for_user_names(user_names)
      Agency.joins(:users).where('users.user_name in (?)', user_names)
    end

    def default_sort_field
      'full_name'
    end

    # TODO: Review after figuring out front end lookups. We might not need this method.
    # This method returns a list of id / display_text value pairs
    # It is used to create the select options list for User fields
    def all_names
      list_by_enabled.map { |r| { id: r.name, display_text: r.name }.with_indifferent_access }
    end

    def find_permitted_users(filters = nil, pagination = nil, sort = nil, user = nil)
      users = User.all
      if filters.present?
        filters = filters.compact
        filters['disabled'] = (filters['disabled'] == 'true')
        users = users.where(filters)
        if user.present? && user.has_permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ)
          users = users.where(organization: user.organization)
        end
        users
      end
      results = { total: users.size }
      pagination = { per_page: 20, page: 1 } if pagination.blank?
      pagination[:page] = pagination[:page] > 1 ? pagination[:per_page] * pagination[:page] : 0
      users = users.limit(pagination[:per_page]).offset(pagination[:page])
      users = users.order(sort) if sort.present?
      results.merge(users: users)
    end

    def users_for_assign(user, model)
      return User.none unless model.present?

      users = where(disabled: false).where.not(id: user.id)
      if user.can? :assign, model
        users
      elsif user.can? :assign_within_agency, model
        users.where(agency_id: user.agency_id)
      elsif user.can? :assign_within_user_group, model
        users.joins('join user_groups_users on users.id = user_groups_users.user_id')
             .where('user_groups_users.user_group_id in (?)', user.user_groups.pluck(:id))
      else
        []
      end
    end

    def users_for_referral(user, model, filters)
      users_for_transition(user, model, filters, Permission::RECEIVE_REFERRAL)
    end

    def users_for_transfer(user, model, filters)
      users_for_transition(user, model, filters, Permission::RECEIVE_TRANSFER)
    end

    def users_for_transition(user, model, filters, permission)
      return User.none unless model.present?

      users = users_with_permission(model, permission)
              .where(disabled: false)
              .where.not(id: user.id)
      if filters.present?
        services_filter = filters.delete('services')
        agencies_filter = filters.delete('agency')
        users = users.where(filters) if filters.present?
        if services_filter.present?
          users = users.where(':service = ANY (services)', service: services_filter)
        end
        if agencies_filter.present?
          users = users.joins(:agency).where(agencies: { unique_id: agencies_filter })
        end
      end
      users
    end

    def users_with_permission(model, permission)
      joins(:role)
        .where(
          'roles.permissions -> :resource ? :permission',
          resource: model&.parent_form,
          permission: permission
        )
    end
  end

  def initialize(attributes = nil, &block)
    super(attributes&.except(*User.unique_id_parameters), &block)
    associate_unique_id_properties(attributes.slice(*User.unique_id_parameters)) if attributes.present?
  end

  def update_with_properties(properties)
    assign_attributes(properties.except(*User.unique_id_parameters))
    associate_unique_id_properties(properties)
  end

  def associate_unique_id_properties(properties)
    associate_role_unique_id(properties[:role_unique_id])
    associate_groups_unique_id(properties[:user_group_unique_ids])
  end

  def associate_role_unique_id(role_unique_id)
    return unless role_unique_id.present?

    self.role = Role.find_by(unique_id: role_unique_id)
  end

  def associate_groups_unique_id(unique_ids)
    return unless unique_ids.present?

    self.user_groups = UserGroup.where(unique_id: unique_ids)
  end

  def user_group_unique_ids
    user_groups.pluck(:unique_id)
  end

  def using_idp?
    Rails.configuration.x.idp.use_identity_provider
  end

  def password_required?
    !using_idp? && (!persisted? || !password.nil? || !password_confirmation.nil?)
  end

  def user_location
    @user_location ||= Location.get_by_location_code(location)
  end

  def reporting_location
    return unless user_location.present?

    @reporting_location ||= Location.get_reporting_location(user_location)
  end

  def last_login
    login = audit_logs.where(action: AuditLog::LOGIN).first
    login&.timestamp
  end

  def modules
    @modules ||= role.modules
  end

  def module_unique_ids
    @module_unique_ids ||= modules.pluck(:unique_id)
  end

  def has_module?(module_unique_id)
    module_unique_ids.include?(module_unique_id)
  end

  def has_permission?(permission)
    role.permissions && role.permissions
                            .map(&:actions).flatten.include?(permission)
  end

  def has_permission_by_permission_type?(permission_type, permission)
    permissions_for_type = role.permissions
                               .select { |perm| perm.resource == permission_type }
    permissions_for_type.present? &&
      permissions_for_type.first.actions.include?(permission)
  end

  def group_permission?(permission)
    role&.group_permission == permission
  end

  # TODO: Refactor when addressing Roles Exporter
  def has_permitted_form_id?(form_id)
    permitted_form_ids = permitted_forms.map(&:unique_id)
    permitted_form_ids&.include?(form_id)
  end

  def has_any_permission?(*any_of_permissions)
    (any_of_permissions.flatten - role.permissions).count <
      any_of_permissions.flatten.count
  end

  def can_preview?(record_type)
    has_permission_by_permission_type?(record_type.parent_form, Permission::DISPLAY_VIEW_PAGE)
  end

  def managed_users
    if group_permission? Permission::ALL
      User.all
    elsif group_permission?(Permission::AGENCY)
      User.by_agency(agency_id)
    elsif group_permission?(Permission::GROUP) && user_group_ids.present?
      User.by_user_group(user_group_ids).uniq(&:user_name)
    else
      [self]
    end
  end

  def managed_user_names
    @managed_user_names ||= managed_users.pluck(:user_name)
  end

  def user_managers
    @managers = User.all.select do |u|
      (u.user_group_ids & user_group_ids).any? && u.is_manager?
    end
  end

  def managers
    user_managers
    @managers
  end

  # This method indicates what records this user can search for.
  # Returns self, if can only search records associated with this user
  # Returns list of UserGroups if can only query from those user groups that this user has access to
  # Returns the Agency if can only query from the agency this user has access to
  # Returns empty list if can query for all records in the system
  def record_query_scope(record_model, id_search = false)
    searching_owned_by_others = can?(:search_owned_by_others, record_model) && id_search
    user_scope =
      if group_permission?(Permission::ALL) || searching_owned_by_others
        {}
      elsif group_permission?(Permission::AGENCY)
        { Permission::AGENCY => agency.unique_id }
      elsif group_permission?(Permission::GROUP) && user_group_ids.present?
        { Permission::GROUP => user_groups.pluck(:unique_id).compact }
      else
        self
      end
    { user: user_scope, module: module_unique_ids }
  end

  def mobile_login_history
    audit_logs
      .where(action: AuditLog::LOGIN)
      .where.not('audit_logs.metadata @> ?', { mobile_id: nil }.to_json)
  end

  def admin?
    group_permission?(Permission::ALL)
  end

  def super_user?
    role&.is_super_user_role? && admin?
  end

  def user_admin?
    role&.is_user_admin_role? && group_permission?(Permission::ADMIN_ONLY)
  end

  def send_welcome_email(admin_user)
    return unless email && SystemSettings.current&.welcome_email_enabled
    return if identity_provider&.sync_identity?

    UserMailJob.perform_later(id, admin_user.id)
  end

  def identity_sync(admin_user)
    return unless identity_provider&.sync_identity?

    IdentitySyncJob.perform_later(id, admin_user.id)
  end

  # Used by the User import to populate the password with a random string when the input file has no password
  # This assumes an admin will have to reset the new user's password after import
  def populate_missing_attributes
    return if using_idp?
    return unless password_digest.blank? && password.blank?

    self.password = SecureRandom.hex(20)
    self.password_confirmation = password
  end

  def agency_office_name
    return @agency_office_name if @agency_office_name

    @agency_office_name = Lookup.values('lookup-agency-office').find do |i|
      self['agency_office'].eql?(i['id'])
    end&.dig('display_text')
  end

  def has_reporting_location_filter?
    modules.any?(&:reporting_location_filter)
  end

  def has_user_group_filter?
    modules.any?(&:user_group_filter)
  end

  def active_for_authentication?
    super && !disabled
  end

  def modules_for_record_type(record_type)
    modules.select { |m| m.associated_record_types.include?(record_type) }
  end

  def permitted_forms(record_type = nil, visible_only = false)
    permitted_forms = FormSection.joins(:roles).where(
      form_sections: { roles: { id: role_id } }
    )
    if record_type.present?
      permitted_forms = permitted_forms.where(
        parent_form: record_type
      )
    end
    if visible_only
      permitted_forms = permitted_forms.where(
        visible: true
      )
    end
    permitted_forms
  end

  def permitted_fields(record_type = nil, visible_forms_only = false)
    permitted_fields = Field.joins(form_section: :roles).where(
      fields: { form_sections: { roles: { id: role_id } } }
    )
    if record_type.present?
      permitted_fields = permitted_fields.where(
        fields: { form_sections: { parent_form: record_type } }
      )
    end
    if visible_forms_only
      permitted_fields = permitted_fields.where(
        fields: { form_sections: { visible: true } }
      )
    end
    permitted_fields
  end

  def permitted_field_names_from_forms(record_type = nil, visible_forms_only = false)
    permitted_fields(record_type, visible_forms_only).distinct.pluck(:name)
  end

  def permitted_field_names(model_class, action_name = nil)
    return @permitted_field_names if @permitted_field_names.present?

    return permitted_fields_from_action_name(model_class, action_name) if action_name.present?

    @permitted_field_names = []
    @permitted_field_names += %w[id record_in_scope]
    @permitted_field_names += permitted_field_names_from_forms(model_class.parent_form)
    @permitted_field_names << 'or'
    @permitted_field_names << 'cases_by_date'
    @permitted_field_names << 'alert_count'
    if model_class == Child
      @permitted_field_names += %w[workflow status case_status_reopened]
    end
    @permitted_field_names << 'record_state' if can?(:enable_disable_record, model_class)
    @permitted_field_names << 'hidden_name' if can?(:update, model_class)
    @permitted_field_names << 'flag_count' if can?(:flag, model_class)
    @permitted_field_names << 'flagged' if can?(:flag, model_class)
    @permitted_field_names += permitted_approval_field_names(model_class)
    @permitted_field_names
  end

  def permitted_approval_field_names(model_class)
    approval_field_names = []
    [Approval::BIA, Approval::CASE_PLAN, Approval::CLOSURE].each do |approval_id|
      if can?(:"request_approval_#{approval_id}", model_class) ||
         can?(:"approve_#{approval_id}", model_class)
        approval_field_names << 'approval_subforms'
        approval_field_names << "#{approval_id}_approved"
        approval_field_names << "approval_status_#{approval_id}"
        approval_field_names << "#{approval_id}_approved_date"
        approval_field_names << "#{approval_id}_approved_comments"
        approval_field_names << "#{approval_id}_approval_type" if approval_id == Approval::CASE_PLAN
      else
        next
      end
    end
    approval_field_names
  end

  def permitted_fields_from_action_name(model_class, action_name)
    case action_name
    when Permission::ADD_NOTE then %w[notes_section] if can?(:add_note, model_class)
    when Permission::INCIDENT_DETAILS_FROM_CASE then %w[incident_details] if can?(:incident_details_from_case, model_class)
    when Permission::SERVICES_SECTION_FROM_CASE then %w[services_section] if can?(:services_section_from_case, model_class)
    when Permission::CLOSE then %w[status]  if can?(:close, model_class)
    when Permission::REOPEN then %w[status] if can?(:reopen, model_class)
    when Permission::ENABLE_DISABLE_RECORD then %w[record_state] if can?(:enable_disable_record, model_class)
    else raise Errors::InvalidPrimeroEntityType, 'case.invalid_action_name'
    end
  end

  def permitted_roles
    role.role_unique_ids.present? ? role.roles : Role.all
  end

  def ability
    @ability ||= Ability.new(self)
  end

  def is_manager?
    role.is_manager
  end

  def gbv?
    has_module?(PrimeroModule::GBV)
  end

  def tasks(pagination = { per_page: 100, page: 1 })
    cases = Child.owned_by(self.user_name)
                 .where('data @> ?', { record_state: true, status: Child::STATUS_OPEN }.to_json)
    tasks = Task.from_case(cases.to_a)
    { total: tasks.size, tasks: tasks.paginate(pagination) }
  end

  def can_approve_bia?
    can?(:approve_bia, Child) || can?(:request_approval_bia, Child)
  end

  def can_approve_case_plan?
    can?(:approve_case_plan, Child) || can?(:request_approval_case_plan, Child)
  end

  def can_approve_closure?
    can?(:approve_closure, Child) || can?(:request_approval_closure, Child)
  end

  # If we set something we gonna assume we need to update the user_groups
  def user_groups=(user_groups)
    @refresh_associated_user_groups = true
    super
  end

  def user_groups_ids=(user_group_ids)
    @refresh_associated_user_groups = true
    super
  end

  private

  def update_owned_by_fields
    # TODO: The following gets all the cases by user and updates the
    # location/district. Performance degrades on save if the user
    # changes their location.
    return unless location_changed? || @refresh_associated_user_groups || agency_id_changed?

    Child.owned_by(user_name).each do |child|
      child.owned_by_location = location if location_changed?
      child.owned_by_groups = user_group_ids if @refresh_associated_user_groups
      child.owned_by_agency_id = agency_id if agency_id_changed?
      child.save!
    end
    @refresh_associated_user_agencies = agency_id_changed?
  end

  def set_locale
    self.locale ||= I18n.default_locale.to_s
  end

  def update_reporting_location_code
    self.reporting_location_code = reporting_location&.location_code
  end

  # TODO: Not sure what location_changed? && user_group_ids_changed? should be
  def location_changed?
    changes_to_save['location'].present? && !changes_to_save['location'].eql?([nil, ''])
  end

  def agency_id_changed?
    changes_to_save['agency_id'].present?
  end

  def make_user_name_lowercase
    user_name.downcase!
  end

  def set_agency_services
    self.services = agency.services if agency.present? && services.blank?
  end

  def reassociate_groups_or_agencies
    return unless @refresh_associated_user_groups || @refresh_associated_user_agencies

    pagination = { page: 1, per_page: 500 }
    begin
      results = Child.search do
        with(:associated_user_names, user_name)
        paginate pagination
      end.results
      Child.transaction do
        results.each do |child|
          child.update_associated_user_groups if @refresh_associated_user_groups
          child.update_associated_user_agencies if @refresh_associated_user_agencies
          child.save!
        end
      end
      pagination[:page] = results.next_page
    end until results.next_page.nil?
    @refresh_associated_user_groups = false
    @refresh_associated_user_agencies = false
  end
end