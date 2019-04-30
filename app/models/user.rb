class User < ApplicationRecord
  include Importable
  # include Memoizable

  devise :database_authenticatable, :timeoutable,
    :recoverable, :validatable

  belongs_to :role
  belongs_to :agency

  has_and_belongs_to_many :user_groups
  has_and_belongs_to_many :primero_modules

  scope :list_by_enabled, -> { where(disabled: false) }
  scope :list_by_disabled, -> { where(disabled: true) }
  scope :by_user_group, (lambda do |ids|
    joins(:user_groups).where(user_groups: { id: ids })
  end)
  scope :by_modules, (lambda do |ids|
    joins(:primero_modules).where(primero_modules: { id: ids })
  end)

  alias_attribute :organization, :agency
  alias_attribute :name, :user_name
  alias_attribute :modules, :primero_modules
  alias_attribute :module_ids, :primero_module_ids

  ADMIN_ASSIGNABLE_ATTRIBUTES = [:role_id]

  before_create :set_agency_services
  before_save :make_user_name_lowercase, :update_user_cases_groups_and_location


  validates_presence_of :full_name, :message => I18n.t("errors.models.user.full_name")

  validates_presence_of :password_confirmation, :message => I18n.t("errors.models.user.password_confirmation"), if: -> { password.present? }
  validates_presence_of :role_id, :message => I18n.t("errors.models.user.role_ids")
  validates_presence_of :module_ids, :message => I18n.t("errors.models.user.module_ids")

  validates_presence_of :organization, :message => I18n.t("errors.models.user.organization")

  validates_format_of :user_name, :with => /\A[^ ]+\z/, :message => I18n.t("errors.models.user.user_name")
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-zA-Z0-9]+\.)+[a-zA-Z]{2,})$\z/, :if => :email_entered?,
                      :message => I18n.t("errors.models.user.email")
  validates_format_of :password, :with => /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\z/,
                      :message => I18n.t("errors.models.user.password_text"), if: -> { password.present? }

  validates_confirmation_of :password, :message => I18n.t("errors.models.user.password_mismatch")

  validate :is_user_name_unique
  validate :validate_locale

  include Indexable

  searchable auto_index: self.auto_index? do
    string :user_name
    string :organization
    string :location
    boolean :disabled
    string :reporting_location do
      self.reporting_location.try(:location_code)
    end
    string :services, :multiple => true
  end

  class << self
    def get_unique_instance(attributes)
      find_by_user_name(attributes['user_name'])
    end
    # memoize_in_prod :get_unique_instance

    def user_id_from_name(name)
      "user-#{name}".parameterize.dasherize
    end
    # memoize_in_prod :user_id_from_name

    def agencies_by_user_list(user_names)
      where(user_name: user_names).map{ |u| u.organization }.uniq
    end

    def last_login_timestamp(user_name)
      AuditLog.where(action_name: 'login', user_name: user_name).try(:last).try(:timestamp)
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

    def find_by_criteria(criteria={}, pagination=nil, sort=nil)
      User.search do
        if criteria.present?
          criteria.each do |key, value|
            with key.to_sym, value
          end
        end
        sort.each { |sort_field, order| order_by(sort_field, order) } if sort.present?
        paginate pagination if pagination.present?
      end
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
    @reporting_location ||= Location.get_reporting_location(self.user_location) if self.user_location.present?
  end

  # NOTE: Expensive not called often
  def last_login
    timestamp = User.last_login_timestamp(self.user_name)
    @last_login = self.localize_date(timestamp, "%Y-%m-%d %H:%M:%S %Z") if timestamp.present?
  end

  def has_module?(module_id)
    module_ids.include?(module_id)
  end

  def has_permission?(permission)
    role.permissions && role.permissions
                            .map{ |p| p.actions }.flatten.include?(permission)
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

  def managed_users
    if group_permission? Permission::ALL
      @managed_users ||= User.all
      @record_scope = [Searchable::ALL_FILTER]
    elsif group_permission?(Permission::GROUP) && user_group_ids.present?
      @managed_users ||= User.by_user_group(user_group_ids)
                             .uniq(&:user_name)
    else
      @managed_users ||= [self]
    end

    @managed_user_names ||= @managed_users.map(&:user_name)
    @record_scope ||= @managed_user_names
    @managed_users
  end

  def managed_user_names
    managed_users
    @managed_user_names
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

  def record_scope
    managed_users
    @record_scope
  end

  def mobile_login_history
    AuditLog.where(action_name: 'login', user_name: user_name)
            .where.not('mobile_data @> ?', { mobile_id: nil }.to_json)
            .order(timestamp: :desc)
  end

  def localize_date(date_time, format = "%d %B %Y at %H:%M (%Z)")
    #TODO - This is merely a patch for the deploy
    # This needs to be refactored as a helper
    # Further work needs to be done to clean up how dates are handled
    if date_time.is_a?(Date)
      date_time.in_time_zone(self[:time_zone]).strftime(format)
    elsif date_time.is_a?(String)
      DateTime.parse(date_time).in_time_zone(self[:time_zone]).strftime(format)
    else
      DateTime.parse(date_time.to_s).in_time_zone(self[:time_zone]).strftime(format)
    end
  end

  # def self.memoized_dependencies
  #   [FormSection, PrimeroModule, Role]
  # end

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
    MailJob.perform_later(self.id, host_url) if self.email.present? && @system_settings.try(:welcome_email_enabled) == true
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

  def permitted_forms(record_modules = nil, record_type = nil, visible_forms_only = false)
    # A user explicitly needs to have the forms as part of his roles.
    role_forms = self.role.try(:form_sections) || []

    # When modules are specified, we return only those forms from the user that belong to the specified modules.
    modules_forms = record_modules.try(:map, &:form_sections).try(:flatten) || record_modules.try(:form_sections)
    forms = modules_forms.present? ? Set.new(role_forms) & Set.new(modules_forms) : role_forms

    forms = forms.select{ |form| form.parent_form == record_type } if record_type.present?

    forms = forms.select {|form| form.visible? } if visible_forms_only
    # TODO: This is an optimization we probably don't need.
    # FormSection.link_subforms(forms)
    # TODO: Is this needed?
    # forms.each{|f| f.module_name = record_module.name}

    # Make sure we always return an Array
    forms.to_a
  end

  def permitted_fields(record_modules, record_type, visible_forms_only = false)
    permitted_forms = self.permitted_forms(record_modules, record_type, visible_forms_only)
    permitted_forms.map(&:fields).flatten.uniq(&:name)
  end

  def can_edit?(record)
    Ability.new(self).can?(:write, record)
  end

  private

  def update_user_cases_groups_and_location
    # TODO: The following gets all the cases by user and updates the
    # location/district. Performance degrades on save if the user
    # changes their location.
    if location_changed? || user_group_ids_changed?
      Child.owned_by(user_name).each do |child|
        child.owned_by_location = location if location_changed?
        child.owned_by_groups = user_group_ids if user_group_ids_changed?
        child.save!
      end
    end
  end

  # TODO: Not sure what location_changed? && user_group_ids_changed? should be
  def location_changed?
    self.changes_to_save['location'].present? && !self.changes_to_save['location'].eql?([nil, ''])
  end

  def user_group_ids_changed?
    self.changes_to_save['user_group_ids'].present? && !self.changes_to_save['user_group_ids'].eql?([nil, ''])
  end

  def make_user_name_lowercase
    user_name.downcase!
  end

  def set_agency_services
    self.services = agency.services if agency.present? && services.blank?
  end
end
