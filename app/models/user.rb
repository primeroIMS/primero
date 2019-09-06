require 'digest/sha2'
class User < CouchRest::Model::Base
  use_database :user

  include PrimeroModel
  include Importable
  include Memoizable
  include Disableable

  include Primero::CouchRestRailsBackward

  property :full_name
  property :user_name
  property :verified, TrueClass, :default => true
  property :crypted_password
  property :salt
  property :code
  property :phone
  property :email
  property :organization
  property :position
  property :location
  property :role_ids, [String]
  property :time_zone, :default => "UTC"
  property :locale
  property :module_ids, :type => [String]
  property :user_group_ids, :type => [String], :default => []
  property :is_manager, TrueClass, :default => false
  property :send_mail, TrueClass, :default => true
  property :services, :type => [String], :default => []
  property :agency_office

  alias_method :agency, :organization
  alias_method :agency=, :organization=
  alias_method :name, :user_name

  attr_accessor :password_confirmation, :password
  ADMIN_ASSIGNABLE_ATTRIBUTES = [:role_ids]

  timestamps!

  design :by_organization do
    view :by_organization
  end

  design :by_role_ids do
    view :by_role_ids,
         :map => "function(doc) {
                if (doc['couchrest-type'] == 'User' && doc['role_ids'])
                {
                  for (var i in doc['role_ids']){
                    emit(doc['role_ids'][i], null);
                  }
                }
            }"
  end

  design do
    view :by_user_name,
            :map => "function(doc) {
                if ((doc['couchrest-type'] == 'User') && doc['user_name']) {
                  emit(doc['user_name'], null);
                }
              }"

    view :by_user_name_enabled,
         :map => "function(doc) {
                if (doc.hasOwnProperty('user_name') && (!doc.hasOwnProperty('disabled') || !doc['disabled'])) {
                  emit(doc['user_name'], null);
                }
              }"

    view :by_user_name_disabled,
         :map => "function(doc) {
                if (doc.hasOwnProperty('user_name') && (doc.hasOwnProperty('disabled') && doc['disabled'])) {
                  emit(doc['user_name'], null);
                }
              }"

    view :by_unverified,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'User' && (doc['verified'] == false || doc['verified'] == 'false'))
                 {
                    emit(doc);
                 }
             }"

    view :by_user_group,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'User' && doc['user_group_ids'])
                {
                  for (var i in doc['user_group_ids']){
                    emit(doc['user_group_ids'][i], null);
                  }
                }
            }"

    view :by_module,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'User' && doc['module_ids'])
                {
                  for (var i in doc['module_ids']){
                    emit(doc['module_ids'][i], null);
                  }
                }
            }"

  end


  before_create :set_agency_services
  before_save :make_user_name_lowercase, :encrypt_password, :update_user_cases_groups_and_location
  after_save :save_devices

  before_update :if => :disabled? do |user|
    Session.delete_for user
  end

  validates_presence_of :full_name, :message => I18n.t("errors.models.user.full_name")
  validates_presence_of :password_confirmation, :message => I18n.t("errors.models.user.password_confirmation"), :if => :password_required?
  validates_presence_of :role_ids, :message => I18n.t("errors.models.user.role_ids"), :if => Proc.new {|user| user.verified}
  validates_presence_of :module_ids, :message => I18n.t("errors.models.user.module_ids")

  validates_presence_of :organization, :message => I18n.t("errors.models.user.organization")

  validates_format_of :user_name, :with => /\A[^ ]+\z/, :message => I18n.t("errors.models.user.user_name")

  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-zA-Z0-9]+\.)+[a-zA-Z]{2,})$\z/, :if => :email_entered?,
                      :message => I18n.t("errors.models.user.email")
  validates_format_of :password, :with => /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\z/, :if => :password_required?,
                      :message => I18n.t("errors.models.user.password_text")

  validates_confirmation_of :password, :if => :password_required? && :password_confirmation_entered?,
                            :message => I18n.t("errors.models.user.password_mismatch")

  #FIXME 409s randomly...destroying user records before test as a temp
  validate :is_user_name_unique
  validate :validate_locale

  before_save :generate_id

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
    boolean :can_receive_referrals do
       self.has_permission_by_permission_type?(Permission::CASE, Permission::RECEIVE_REFERRAL)
    end
    boolean :can_receive_transfers do
       self.has_permission_by_permission_type?(Permission::CASE, Permission::RECEIVE_TRANSFER)
    end
    string :user_group_ids, :multiple => true
  end

  #In order to track changes on attributes declared as attr_accessor and
  #trigger the callbacks we need to use attribute_will_change! method.
  #check lib/couchrest/model/extended_attachments.rb in source code.
  #So, override the method for password in order to track changes.
  def password= value
    attribute_will_change!("password") if use_dirty? && @password != value
    @password = value
  end

  def password
    @password
  end

  class << self
    alias :old_all :all
    alias :by_all :all
    alias :list_by_all :all
    alias :by_user_name_all :by_user_name
    alias :by_organization_all :by_organization
    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all
    memoize_in_prod :list_by_all

    def all_unverified
      User.by_unverified
    end
    memoize_in_prod :all_unverified

    alias :old_by_user_name :by_user_name
    def by_user_name(*args)
      old_by_user_name(*args)
    end
    memoize_in_prod :by_user_name

    def find_by_user_name(user_name)
      User.by_user_name(:key => user_name.downcase).first if user_name.present?
    end
    memoize_in_prod :find_by_user_name

    def get_unique_instance(attributes)
      find_by_user_name(attributes['user_name'])
    end
    memoize_in_prod :get_unique_instance

    def user_id_from_name(name)
      "user-#{name}".parameterize.dasherize
    end
    memoize_in_prod :user_id_from_name

    def find_by_modules(module_ids)
      User.by_module(keys: module_ids).all.uniq{|u| u.user_name}
    end
    memoize_in_prod :find_by_modules

    def find_by_user_names(user_names)
      User.by_user_name(keys: user_names).all
    end

    def find_by_role_ids(role_ids)
      User.by_role_ids(keys: role_ids).all.uniq{|u| u.user_name}
    end

    def agencies_by_user_list(user_names)
      Agency.all(keys: self.find_by_user_names(user_names).map{|u| u.organization}.uniq).all
    end

    def last_login_timestamp(user_name)
      activity = LoginActivity.by_user_name_and_login_timestamp(descending: true, endkey: [user_name], startkey: [user_name, {}], limit: 1).first
      activity.login_timestamp if activity.present?
    end

    def default_sort_field
      'full_name'
    end

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for User fields
    def all_names
      self.by_disabled(key: false).map{|r| {id: r.name, display_text: r.name}.with_indifferent_access}
    end
    memoize_in_prod :all_names

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
    return true if user.nil? or self.id == user.id
    errors.add(:user_name, I18n.t("errors.models.user.user_name_uniqueness"))
  end

  def validate_locale
    return true if self.locale.blank? || Primero::Application::locales.include?(self.locale)
    errors.add(:locale, I18n.t("errors.models.user.invalid_locale", user_locale: self.locale))
  end

  def authenticate(check)
    if new?
      raise Exception.new, I18n.t("errors.models.user.authenticate")
    end
    !disabled? && crypted_password == self.class.encrypt(check, self.salt)
  end

  def roles
    @roles ||= Role.all(keys: self.role_ids).all
  end

  def modules
    @modules ||= PrimeroModule.all(keys: self.module_ids).all
  end

  def user_groups
    @user_groups ||= UserGroup.all(keys: self.user_group_ids_sanitized)
  end

  def user_group_ids_sanitized
    self.user_group_ids.select{|g| g.present?}
  end

  def user_location
    @location_obj ||= Location.get_by_location_code(self.location)
  end
  # Hack to allow backward-compatibility. The Location method must not be used.
  alias_method :Location, :user_location

  def reporting_location
    @reporting_location ||= Location.get_reporting_location(self.user_location) if self.user_location.present?
  end

  def agency
    @agency_obj ||= Agency.get(self.organization)
  end

  def agency_name
    self.agency.try(:name)
  end

  # NOTE: Expensive not called often
  def last_login
    timestamp = User.last_login_timestamp(self.user_name)
    @last_login = self.localize_date(timestamp, "%Y-%m-%d %H:%M:%S %Z") if timestamp.present?
  end

  def has_module?(module_id)
    self.module_ids.include?(module_id)
  end

  def has_permission?(permission)
    permissions && permissions.map{|p| p.actions}.flatten.include?(permission)
  end

  def has_permission_by_permission_type?(permission_type, permission)
    permissions_for_type = permissions.select {|perm| perm['resource'] == permission_type}
    permissions_for_type.present? && permissions_for_type[0]['actions'].include?(permission)
  end

  def has_group_permission?(permission)
    group_permissions && group_permissions.include?(permission)
  end

  def has_permitted_form_id?(form_id)
    permitted_form_ids && permitted_form_ids.include?(form_id)
  end

  def has_any_permission?(*any_of_permissions)
    (any_of_permissions.flatten - permissions).count < any_of_permissions.flatten.count
  end

  def permissions
    roles.compact.collect(&:permissions_list).flatten
  end

  #This method will return true when the user has no permission assigned
  #or the user has no write/manage access to the record.
  #Don't rely on this method for authorization.
  def readonly?(record_type)
    resource = if record_type == "violation"
      "incident"
    elsif record_type == "child"
      "case"
    else
      record_type
    end
    record_type_permissions = permissions.find{|p| p.resource == resource}
    record_type_permissions.blank? ||
    record_type_permissions.actions.blank? ||
    !(record_type_permissions.actions.include?(Permission::WRITE) ||
       record_type_permissions.actions.include?(Permission::MANAGE))
  end

  def group_permissions
    roles.map{|r| r.group_permission}.uniq
  end

  def permitted_form_ids
    permitted = []
    from_roles = role_permitted_form_ids
    if from_roles.present?
      permitted = from_roles
    elsif self.module_ids.present?
      permitted = module_permitted_form_ids
    end
    return permitted
  end

  def role_permitted_form_ids
    roles.compact.collect(&:permitted_form_ids).flatten.select(&:present?)
  end

  def module_permitted_form_ids
    modules.compact.collect(&:associated_form_ids).flatten.select(&:present?)
  end

  def managed_users
    user_group_ids = self.user_group_ids_sanitized
    if self.has_group_permission? Permission::ALL
      @managed_users ||= User.all.all
      @record_scope = [Searchable::ALL_FILTER]
    elsif self.has_group_permission?(Permission::GROUP) && user_group_ids.present?
      @managed_users ||= User.by_user_group(keys: user_group_ids).all.uniq{|u| u.user_name}
    else
      @managed_users ||= [self]
    end
    @managed_user_names ||= @managed_users.map(&:user_name)
    @record_scope ||= @managed_user_names
    return @managed_users
  end

  def managed_user_names
    managed_users
    return @managed_user_names
  end

  def user_managers
    user_group_ids = self.user_group_ids_sanitized
    @managers = User.all.select{ |u| (u.user_group_ids & user_group_ids).any? &&  u.is_manager }
  end

  def managers
    user_managers
    return @managers
  end

  def record_scope
    managed_users
    return @record_scope
  end

  def mobile_login_history
    LoginActivity.by_user_name_and_login_timestamp(
      descending: true,
      endkey: [user_name],
      startkey: [user_name, {}]
    ).all.select(&:mobile?)
  end

  def devices
    Device.all.select { |device| device.user_name == self.user_name }
  end

  def devices= device_hashes
    all_devices = Device.all
    #attr_accessor devices field change.
    attribute_will_change!("devices")
    @devices = device_hashes.map do |device_hash|
      device = all_devices.detect { |device| device.imei == device_hash["imei"] }
      device.blacklisted = device_hash["blacklisted"] == "true"
      device
    end
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

  def has_role_ids?(attributes)
    ADMIN_ASSIGNABLE_ATTRIBUTES.any? { |e| attributes.keys.include? e }
  end

  def self.memoized_dependencies
    [FormSection, PrimeroModule, Role]
  end

  def is_admin?
    self.group_permissions.include?(Permission::ALL)
  end

  def is_super_user?
    (self.roles.any?{|r| r.is_super_user_role?} && self.is_admin?)
  end

  def is_user_admin?
    (self.roles.any?{|r| r.is_user_admin_role?} && self.group_permissions.include?(Permission::ADMIN_ONLY))
  end

  def send_welcome_email(host_url)
    @system_settings ||= SystemSettings.current
    MailJob.perform_later(self.id, host_url) if self.email.present? && @system_settings.try(:welcome_email_enabled) == true
  end

  def can_edit_user_by_agency?(agency=nil)
    self.has_permission?(Permission::ALL_AGENCY_USERS) || (agency.present? && self.agency == agency)
  end

  #Used by the User import to populate the password with a random string when the input file has no password
  #This assumes an admin will have to reset the new user's password after import
  def populate_missing_attributes
    if crypted_password.blank? && password.blank?
      self.password = SecureRandom.hex(20)
      self.password_confirmation = password
    end
  end

  def has_user_group_id?(id)
    self.user_group_ids.include?(id)
  end

  def agency_office_name
    @agency_office_name ||= Lookup.values('lookup-agency-office').find { |i| self['agency_office'].eql?(i['id']) }.try(:[], 'display_text')
  end

  def has_reporting_location_filter?
    self.modules.any? {|m| m.reporting_location_filter }
  end

  def has_user_group_filter?
    self.modules.any? {|m| m.user_group_filter }
  end

  def group_permission_filters
    filters = {
      user_group_ids: [],
      user_names: []
    }

    if self.has_group_permission?(Permission::ALL)
      filters[:user_group_ids] = [Searchable::ALL_FILTER]
      filters[:user_names] = [Searchable::ALL_FILTER]
    elsif self.has_group_permission?(Permission::GROUP)
      filters[:user_group_ids] = self.user_group_ids
      # In the absence of user groups, a user should at least see his own records.
      filters[:user_names] = [self.user_name]
    else
      filters[:user_names] = [self.user_name]
    end

    filters
  end

  private

  def save_devices
    @devices.map(&:save!) if @devices
    true
  end

  def update_user_cases_groups_and_location
    # TODO: The following gets all the cases by user and updates the location/district.
    # Performance degrades on save if the user changes their location.
    if location_changed? || user_group_ids_changed?
      Child.by_owned_by.key(self.user_name).all.each do |child|
        child.owned_by_location = self.location if location_changed?
        child.owned_by_groups = self.user_group_ids if user_group_ids_changed?
        child.save!
      end
    end
  end

  def location_changed?
    self.changes['location'].present? && !self.changes['location'].eql?([nil,""])
  end

  def user_group_ids_changed?
    self.changes['user_group_ids'].present? && !self.changes['user_group_ids'].eql?([nil,""])
  end

  def encrypt_password
    return if password.blank?
    self.salt = Digest::SHA1.hexdigest("--#{Clock.now.to_s}--#{self.user_name}--") if new_record?
    self.crypted_password = self.class.encrypt(password, salt)
  end

  def self.encrypt(password, salt)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  def password_required?
    crypted_password.blank? || !password.blank? || !password_confirmation.blank?
  end

  def password_confirmation_entered?
    !password_confirmation.blank?
  end

  def make_user_name_lowercase
    user_name.downcase!
  end

  def generate_id
    self["_id"] ||= User.user_id_from_name self.user_name
  end

  def set_agency_services
    if self.agency.present? && self.services.blank?
      self.services = self.agency.services
    end
  end

end
