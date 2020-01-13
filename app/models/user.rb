class User < ApplicationRecord
  include Importable
  include Devise::JWT::RevocationStrategies::Whitelist
  # include Memoizable

  attr_reader :refresh_associated_user_groups, :refresh_associated_user_agencies

  delegate :can?, :cannot?, to: :ability

  devise :database_authenticatable, :timeoutable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  belongs_to :role
  belongs_to :agency

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

  ADMIN_ASSIGNABLE_ATTRIBUTES = [:role_id]

  before_create :set_agency_services
  before_save :make_user_name_lowercase, :update_owned_by_fields, :update_reporting_location_code
  after_save :update_associated_groups_or_agencies


  validates_presence_of :full_name, :message => "errors.models.user.full_name"

  validates_presence_of :password_confirmation, :message => "errors.models.user.password_confirmation", if: -> { password.present? }
  validates_presence_of :role_id, :message => "errors.models.user.role_ids"

  validates_presence_of :organization, :message => "errors.models.user.organization"

  validates_format_of :user_name, :with => /\A[^ ]+\z/, :message => "errors.models.user.user_name"
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-zA-Z0-9]+\.)+[a-zA-Z]{2,})$\z/, :if => :email_entered?,
                      :message => "errors.models.user.email"
  validates_format_of :password, :with => /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\z/,
                      :message => "errors.models.user.password_text", if: -> { password.present? }

  validates_confirmation_of :password, :message => "errors.models.user.password_mismatch"

  validate :is_user_name_unique
  validate :validate_locale

  class << self
    def hidden_attributes
      %w(encrypted_password reset_password_token reset_password_sent_at)
    end

    def password_parameters
      %w(password password_confirmation)
    end

    def association_parameters
      %w(user_group_ids role_id)
    end

    def get_unique_instance(attributes)
      find_by_user_name(attributes['user_name'])
    end
    # memoize_in_prod :get_unique_instance

    def user_id_from_name(name)
      "user-#{name}".parameterize.dasherize
    end
    # memoize_in_prod :user_id_from_name

    def agencies_for_user_names(user_names)
      Agency.joins(:users).where('users.user_name in (?)', user_names)
    end

    def default_sort_field
      'full_name'
    end

    # This method returns a list of id / display_text value pairs
    # It is used to create the select options list for User fields
    def all_names
      list_by_enabled.map{ |r| {id: r.name, display_text: r.name}.with_indifferent_access }
    end
    # memoize_in_prod :all_names

    # Hack: is required in the template record_shared/actions.html.erb
    def is_syncable_with_mobile?
      false
    end

    def find_permitted_users(filters = nil, pagination = nil, sort = nil, user = nil)
      users = User.all
      if filters.present?
        filters = filters.compact
        filters['disabled'] = filters['disabled'] == 'true' ? true : false
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
      results.merge({ users: users })
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

    def new_with_properties(properties)
      user = User.new(properties.except(*self.association_parameters))
      user.associations_with_properties(properties)
      user
    end
  end

  def update_with_properties(properties)
    self.assign_attributes(properties.except(*User.association_parameters))
    self.associations_with_properties(properties)
  end

  def associations_with_properties(properties)
    self.role = Role.find_by(unique_id: properties[:role_id]) if properties[:role_id].present?
    if properties[:user_group_ids].present?
      self.user_groups = UserGroup.where(unique_id: properties[:user_group_ids]) || []
    end
  end

  def email_entered?
    !email.blank?
  end

  def is_user_name_unique
    user = User.find_by_user_name(user_name)
    return true if user.nil? || id == user.id
    errors.add(:user_name, I18n.t("errors.models.user.user_name_uniqueness"))
  end

  def validate_locale
    return true if self.locale.blank? || Primero::Application::locales.include?(self.locale)
    errors.add(:locale, I18n.t("errors.models.user.invalid_locale", user_locale: self.locale))
  end

  def user_location
    @location_obj ||= Location.get_by_location_code(location)
  end
  # Hack to allow backward-compatibility. The Location method must not be used.
  alias_method :Location, :user_location

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
                               .select{ |perm| perm.resource == permission_type }
    permissions_for_type.present? &&
      permissions_for_type.first.actions.include?(permission)
  end

  def group_permission?(permission)
    role.try(:group_permission) == permission
  end

  # TODO: Refactor when addressing Roles Exporter
  def has_permitted_form_id?(form_id)
    permitted_form_ids = permitted_forms.map(&:unique_id)
    permitted_form_ids && permitted_form_ids.include?(form_id)
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
      (u.user_group_ids & user_group_ids).any? && u.is_manager
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
    role.try(:is_super_user_role?) && admin?
  end

  def user_admin?
    role.try(:is_user_admin_role?) && group_permission?(Permission::ADMIN_ONLY)
  end

  def send_welcome_email(host_url)
    @system_settings ||= SystemSettings.current
    MailJob.perform_later(id, host_url) if email && @system_settings&.welcome_email_enabled
  end

  # Used by the User import to populate the password with a random string when the input file has no password
  # This assumes an admin will have to reset the new user's password after import
  def populate_missing_attributes
    if password_digest.blank? && password.blank?
      self.password = SecureRandom.hex(20)
      self.password_confirmation = password
    end
  end

  def agency_office_name
    @agency_office_name ||= Lookup.values('lookup-agency-office').find { |i| self['agency_office'].eql?(i['id']) }.try(:[], 'display_text')
  end

  def has_reporting_location_filter?
    self.modules.any? {|m| m.reporting_location_filter }
  end

  def has_user_group_filter?
    modules.any? { |m| m.user_group_filter }
  end

  def active_for_authentication?
    super && !disabled
  end

  def modules_for_record_type(record_type)
    self.modules.select{ |m| m.associated_record_types.include?(record_type) }
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

    if action_name == 'unscoped_update'
      return permitted_subform_update_fields(model_class)
    end

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
    @permitted_field_names
  end

  def permitted_subform_update_fields(model_class)
    permitted_field_names = []
    if model_class == Child
      permitted_field_names << 'incident_details' if self.can?(:incident_details_from_case, model_class)
      permitted_field_names << 'services_section' if self.can?(:services_section_from_case, model_class)
      permitted_field_names << 'notes_section' if self.can?(:add_note, model_class)
   end
   permitted_field_names
 end

  def ability
    @ability ||= Ability.new(self)
  end

  def is_manager?
    role.is_manager
  end

  def tasks(pagination = { per_page: 100, page: 1 })
    cases = Child.owned_by(self.user_name)
                 .where('data @> ?', { record_state: true, status: Child::STATUS_OPEN }.to_json)
    tasks = Task.from_case(cases.to_a)
    { total: tasks.size, tasks: tasks.paginate(pagination) }
  end

  def can_approve_bia?
    self.can?(:approve_bia, Child) || self.can?(:request_approval_bia, Child)
  end

  def can_approve_case_plan?
    self.can?(:approve_case_plan, Child) || self.can?(:request_approval_case_plan, Child)
  end

  def can_approve_closure?
    self.can?(:approve_closure, Child) || self.can?(:request_approval_closure, Child)
  end

  def can_update_subform_fields?(model_class)
    self.can?(:incident_details_from_case, model_class) ||
    self.can?(:services_section_from_case, model_class) ||
    self.can?(:add_note, model_class)
  end

  # If we set something we gonna assume we need to update the user_groups
  def user_groups=(user_groups)
    @refresh_associated_user_groups =  true
    super
  end

  def user_groups_ids=(user_group_ids)
    @refresh_associated_user_groups =  true
    super
  end

  private

  def update_owned_by_fields
    # TODO: The following gets all the cases by user and updates the
    # location/district. Performance degrades on save if the user
    # changes their location.
    if location_changed? || @refresh_associated_user_groups || agency_id_changed?
      Child.owned_by(self.user_name).each do |child|
        child.owned_by_location = self.location if location_changed?
        child.owned_by_groups = self.user_group_ids if @refresh_associated_user_groups
        child.owned_by_agency_id = self.agency_id if agency_id_changed?
        child.save!
      end
      @refresh_associated_user_agencies = agency_id_changed?
    end
  end

  def update_reporting_location_code
    self.reporting_location_code = self.reporting_location.try(:location_code)
  end

  # TODO: Not sure what location_changed? && user_group_ids_changed? should be
  def location_changed?
    self.changes_to_save['location'].present? && !self.changes_to_save['location'].eql?([nil, ''])
  end

  def agency_id_changed?
    self.changes_to_save['agency_id'].present?
  end

  def make_user_name_lowercase
    user_name.downcase!
  end

  def set_agency_services
    self.services = agency.services if agency.present? && services.blank?
  end

  def update_associated_groups_or_agencies
    if @refresh_associated_user_groups || @refresh_associated_user_agencies
      pagination = { page: 1, per_page: 500}
      begin
        results = Child.search do
          with(:associated_user_names, self.user_name)
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
end
