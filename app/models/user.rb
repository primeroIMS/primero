# frozen_string_literal: true

# This model represents the Primero end user and the associated application permissions.
# Primero can be configured to perform its own password-based authentication, in which case the
# User model is responsible for storing the encrypted password and associated whitelisted JWT
# token identifiers. If external identity providers are used (over OpenID Connect), the
# model is not responsible for storing authentication information, and must mirror a user
# in external IDP (such as Azure Active Directory).
# rubocop:disable Metrics/ClassLength
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Allowlist
  include ConfigurationRecord

  USER_NAME_REGEX = /\A[^ ]+\z/.freeze
  ADMIN_ASSIGNABLE_ATTRIBUTES = [:role_id].freeze
  USER_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'user_name' => { 'type' => 'string' },
    'full_name' => { 'type' => 'string' }, 'code' => { 'type' => 'string' },
    'phone' => { 'type' => 'string' }, 'email' => { 'type' => 'string' },
    'password_setting' => { 'type' => 'string' }, 'locale' => { 'type' => 'string' },
    'agency_id' => { 'type' => 'integer' }, 'position' => { 'type' => 'string' },
    'location' => { 'type' => 'string' }, 'disabled' => { 'type' => 'boolean' },
    'password' => { 'type' => 'string' }, 'password_confirmation' => { 'type' => 'string' },
    'role_unique_id' => { 'type' => 'string' }, 'identity_provider_unique_id' => { 'type' => 'string' },
    'user_group_ids' => { 'type' => 'array' }, 'user_group_unique_ids' => { 'type' => 'array' },
    'services' => { 'type' => 'array' }, 'module_unique_ids' => { 'type' => 'array' },
    'password_reset' => { 'type' => 'boolean' }, 'role_id' => { 'type' => 'string' },
    'agency_office' => { 'type' => 'string' }, 'code_of_conduct_id' => { 'type' => 'integer' }
  }.freeze

  attr_accessor :exists_reporting_location, :should_send_password_reset_instructions,
                :user_groups_changed
  attr_writer :user_location, :reporting_location

  delegate :can?, :cannot?, to: :ability

  devise :database_authenticatable, :timeoutable, :recoverable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  self.unique_id_attribute = 'user_name'

  belongs_to :role
  belongs_to :agency, optional: true
  belongs_to :identity_provider, optional: true
  belongs_to :code_of_conduct, optional: true

  has_many :saved_searches
  has_and_belongs_to_many :user_groups,
                          after_add: :mark_user_groups_changed,
                          after_remove: :mark_user_groups_changed
  has_many :audit_logs

  scope :enabled, -> { where(disabled: false) }
  scope :disabled, -> { where(disabled: true) }
  scope :by_user_group, (lambda do |ids|
    joins(:user_groups).where(user_groups: { id: ids })
  end)
  scope :by_agency, (lambda do |id|
    joins(:agency).where(agencies: { id: id })
  end)

  alias_attribute :organization, :agency
  alias_attribute :name, :user_name

  before_validation :generate_random_password
  before_create :set_agency_services
  before_save :make_user_name_lowercase, :update_reporting_location_code, :set_locale, :set_code_of_conduct_accepted_on
  after_commit :update_associated_records, on: :update
  after_create :send_reset_password_instructions, if: :should_send_password_reset_instructions

  validates :full_name, presence: { message: 'errors.models.user.full_name' }
  validates :user_name, presence: true, uniqueness: { message: 'errors.models.user.user_name_uniqueness' }
  validates :user_name, format: { with: USER_NAME_REGEX, message: 'errors.models.user.user_name' }, unless: :using_idp?
  validates :user_name, format: { with: URI::MailTo::EMAIL_REGEXP, message: 'errors.models.user.user_name' },
                        if: :using_idp?
  validates :email, presence: true, if: :using_idp?
  validates :email,
            format: { with: URI::MailTo::EMAIL_REGEXP, message: 'errors.models.user.email' },
            allow_nil: true,
            uniqueness: { message: 'errors.models.user.email_uniqueness' }
  validates :password,
            presence: true,
            length: { minimum: 8, message: 'errors.models.user.password_mismatch' },
            confirmation: { message: 'errors.models.user.password_mismatch' },
            if: :password_required?
  validates :password_confirmation,
            presence: { message: 'errors.models.user.password_confirmation' },
            if: :password_required?
  validates :role, presence: { message: 'errors.models.user.role_ids' }
  validates :agency, presence: { message: 'errors.models.user.organization' }, unless: :service_account
  validates :identity_provider, presence: { message: 'errors.models.user.identity_provider' }, if: :using_idp?
  validates :locale,
            inclusion: { in: I18n.available_locales.map(&:to_s), message: 'errors.models.user.invalid_locale' },
            allow_nil: true

  class << self
    def hidden_attributes
      %w[
        encrypted_password reset_password_token reset_password_sent_at service_account
        identity_provider_id unlock_token locked_at failed_attempts role_id
      ]
    end

    def self_hidden_attributes
      %w[role_unique_id identity_provider_unique_id user_name]
    end

    def password_parameters
      %w[password password_confirmation]
    end

    def unique_id_parameters
      %w[user_group_unique_ids role_unique_id identity_provider_unique_id]
    end

    def permitted_attribute_names
      User.attribute_names.reject { |name| name == 'services' } + [{ 'services' => [] }]
    end

    def order_insensitive_attribute_names
      %w[full_name user_name position]
    end

    def permitted_api_params(current_user = nil, target_user = nil)
      permitted_params = (
        User.permitted_attribute_names + User.password_parameters +
        [
          { 'user_group_ids' => [] }, { 'user_group_unique_ids' => [] },
          { 'module_unique_ids' => [] }, 'role_unique_id', 'identity_provider_unique_id'
        ]
      ) - User.hidden_attributes

      return permitted_params if current_user.nil? || target_user.nil?

      return permitted_params unless current_user.user_name == target_user.user_name

      permitted_params - User.self_hidden_attributes
    end

    def last_login_timestamp(user_name)
      AuditLog.where(action_name: 'login', user_name: user_name).try(:last).try(:timestamp)
    end

    def agencies_for_user_names(user_names)
      Agency.joins(:users).where('users.user_name in (?)', user_names).distinct
    end

    def filter_with_groups(users, filters)
      return users unless filters['user_group_ids'].present?

      users.joins(:user_groups).where(user_groups: { unique_id: filters['user_group_ids'] })
    end

    def default_sort_field
      'full_name'
    end

    # Override the devise method to eager load the user's dependencies
    def find_for_jwt_authentication(sub)
      eager_load(role: :primero_modules).find_by(primary_key => sub)
    end

    # Override the devise method to eager load the user's dependencies
    def find_for_authentication(tainted_conditions)
      eager_load(role: :primero_modules).find_by(tainted_conditions)
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
    associate_identity_provider_unique_id(properties[:identity_provider_unique_id])
  end

  def configuration_hash
    super.except('encrypted_password', 'reset_password_token', 'reset_password_sent_at', 'unlock_token', 'locked_at')
  end

  def associate_role_unique_id(role_unique_id)
    return unless role_unique_id.present?

    self.role = Role.find_by(unique_id: role_unique_id)
  end

  def associate_groups_unique_id(unique_ids)
    return unless unique_ids.present?

    self.user_groups = UserGroup.where(unique_id: unique_ids)
  end

  def associate_identity_provider_unique_id(identity_provider_unique_id)
    return unless identity_provider_unique_id.present?

    self.identity_provider_id = IdentityProvider.where(unique_id: identity_provider_unique_id).pluck(:id).first
  end

  def user_group_unique_ids
    user_groups.pluck(:unique_id)
  end

  def using_idp?
    Rails.configuration.x.idp.use_identity_provider && !service_account
  end

  def password_required?
    !using_idp? && (!persisted? || !password.nil? || !password_confirmation.nil?)
  end

  def user_location
    @user_location ||= Location.find_by(location_code: location)
  end

  def reporting_location
    return @reporting_location if @reporting_location
    return nil if user_location.blank?
    return user_location if user_location.admin_level == reporting_location_admin_level

    @reporting_location || user_location.ancestor(reporting_location_admin_level)
  end

  def reporting_location_admin_level
    return @reporting_location_admin_level if @reporting_location_admin_level

    @reporting_location_admin_level = reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
  end

  def reporting_location_config
    @reporting_location_config ||= role&.reporting_location_config
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

  def module?(module_unique_id)
    module_unique_ids.include?(module_unique_id)
  end

  def permission?(permission)
    role.permissions && role.permissions
                            .map(&:actions).flatten.include?(permission)
  end

  def permission_by_permission_type?(permission_type, permission)
    permissions_for_type = role.permissions
                               .select { |perm| perm.resource == permission_type }
    permissions_for_type.present? &&
      permissions_for_type.first.actions.include?(permission)
  end

  def group_permission?(permission)
    role&.group_permission == permission
  end

  def can_preview?(record_type)
    permission_by_permission_type?(record_type.parent_form, Permission::DISPLAY_VIEW_PAGE)
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
      (u.user_group_ids & user_group_ids).any? && u.manager?
    end
  end

  def managers
    user_managers
    @managers
  end

  # This method indicates what records or flags this user can search for.
  # Returns self, if can only search records associated with this user
  # Returns list of UserGroups if can only query from those user groups that this user has access to
  # Returns the Agency if can only query from the agency this user has access to
  # Returns empty list if can query for all records in the system
  def record_query_scope(record_model, id_search = false)
    user_scope = case user_query_scope(record_model, id_search)
                 when Permission::AGENCY
                   { 'agency' => agency.unique_id, 'agency_id' => agency_id }
                 when Permission::GROUP
                   { 'group' => user_groups.map(&:unique_id).compact }
                 when Permission::ALL then {}
                 else
                   { 'user' => user_name }
                 end
    { user: user_scope }
  end

  def user_query_scope(record_model = nil, id_search = false)
    if can_search_for_all?(record_model, id_search)
      Permission::ALL
    elsif group_permission?(Permission::AGENCY)
      Permission::AGENCY
    elsif group_permission?(Permission::GROUP) && user_group_ids.present?
      Permission::GROUP
    else
      Permission::USER
    end
  end

  def user_assign_scope(record_model)
    return unless record_model.present?

    if can?(:assign, record_model)
      Permission::ASSIGN
    elsif can?(:assign_within_agency, record_model)
      Permission::ASSIGN_WITHIN_AGENCY
    elsif can?(:assign_within_user_group, record_model)
      Permission::ASSIGN_WITHIN_USER_GROUP
    end
  end

  def can_search_for_all?(record_model, id_search = false)
    group_permission?(Permission::ALL) || (can?(:search_owned_by_others, record_model) && id_search && record_model)
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
    role&.super_user_role? && admin?
  end

  def user_admin?
    role&.user_admin_role? && group_permission?(Permission::ADMIN_ONLY)
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

  def agency_office_name
    return @agency_office_name if @agency_office_name

    @agency_office_name = Lookup.values('lookup-agency-office').find do |i|
      self['agency_office'].eql?(i['id'])
    end&.dig('display_text')
  end

  def reporting_location_filter?
    modules.any?(&:reporting_location_filter)
  end

  def user_group_filter?
    modules.any?(&:user_group_filter)
  end

  def active_for_authentication?
    super && !disabled
  end

  def modules_for_record_type(record_type)
    modules.select { |m| m.associated_record_types.include?(record_type) }
  end

  def permitted_roles_to_manage
    role.permitted_role_unique_ids.present? ? role.permitted_roles : Role.all
  end

  def permitted_user_groups
    return UserGroup.all if group_permission?(Permission::ALL) || group_permission?(Permission::ADMIN_ONLY)

    user_groups
  end

  def permitted_agencies
    return Agency.all if group_permission?(Permission::ALL)
    return Agency.none unless agency_id.present?

    Agency.where(id: agency_id)
  end

  def ability
    @ability ||= Ability.new(self)
  end

  def manager?
    role.is_manager
  end

  def gbv?
    module?(PrimeroModule::GBV)
  end

  def tasks(pagination = { per_page: 100, page: 1 }, sort_order = {})
    cases = Child.owned_by(user_name)
                 .where('data @> ?', { record_state: true, status: Child::STATUS_OPEN }.to_json)
    tasks = Task.from_case(cases.to_a, sort_order)
    { total: tasks.size, tasks: tasks.paginate(pagination) }
  end

  def can_approve_assessment?
    can?(:approve_assessment, Child) || can?(:request_approval_assessment, Child)
  end

  def can_approve_case_plan?
    can?(:approve_case_plan, Child) || can?(:request_approval_case_plan, Child)
  end

  def can_approve_closure?
    can?(:approve_closure, Child) || can?(:request_approval_closure, Child)
  end

  def can_approve_action_plan?
    can?(:approve_action_plan, Child) || can?(:request_approval_action_plan, Child)
  end

  def can_approve_gbv_closure?
    can?(:approve_gbv_closure, Child) || can?(:request_approval_gbv_closure, Child)
  end

  def agency_read?
    permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ)
  end

  private

  def set_locale
    self.locale ||= I18n.default_locale.to_s
  end

  def update_reporting_location_code
    return unless will_save_change_to_attribute?(:location)

    self.reporting_location_code = reporting_location&.location_code
  end

  def make_user_name_lowercase
    user_name.downcase!
  end

  def generate_random_password
    return unless password_required? && password.blank? && password_confirmation.blank?

    password = "#{SecureRandom.base64(40)}1a"
    self.password = password
    self.password_confirmation = password
    self.should_send_password_reset_instructions = true
  end

  def set_agency_services
    self.services = agency.services if agency.present? && services.blank?
  end

  def set_code_of_conduct_accepted_on
    self.code_of_conduct_accepted_on ||= DateTime.now if code_of_conduct_id.present?
  end

  def mark_user_groups_changed(_user_group)
    self.user_groups_changed = true
  end

  def update_associated_records
    return if ENV['PRIMERO_BOOTSTRAP']
    return unless associated_attributes_changed?

    records = []
    associated_records_for_update.find_each(batch_size: 500) do |record|
      update_record_ownership_fields(record)

      record.update_associated_user_groups if user_groups_changed
      record.update_associated_user_agencies if saved_change_to_attribute?('agency_id')

      records << record if record.changed?
    end

    ActiveRecord::Base.transaction { records.each(&:save!) }
  end

  def associated_records_for_update
    if user_groups_changed || saved_change_to_attribute?('agency_id')
      Child.associated_with(user_name)
    else
      Child.owned_by(user_name)
    end
  end

  def update_record_ownership_fields(record)
    return unless record.owned_by == user_name

    record.owned_by_location = location if saved_change_to_attribute?('location')
    record.owned_by_groups = user_group_unique_ids if user_groups_changed
    record.owned_by_agency_id = agency&.unique_id if saved_change_to_attribute?('agency_id')
    record.owned_by_agency_office = agency_office if saved_change_to_attribute('agency_office')&.last&.present?
  end

  def associated_attributes_changed?
    user_groups_changed || saved_change_to_attribute?('agency_id') || saved_change_to_attribute?('location') ||
      saved_change_to_attribute('agency_office')&.last&.present?
  end
end
# rubocop:enable Metrics/ClassLength
