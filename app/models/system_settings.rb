class SystemSettings < CouchRest::Model::Base
  use_database :system_settings

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  DEFAULT_BASE_LANGUAGE = Primero::Application::LOCALE_ENGLISH
  #TODO We now use locales.yml to set default locale, but leaving this now for backwards compatibility
  property :default_locale, String, :default => Primero::Application::LOCALE_ENGLISH
  property :locales, [String], :default => [Primero::Application::LOCALE_ENGLISH]
  property :case_code_format, [String], :default => []
  property :case_code_separator, String
  property :auto_populate_list, :type => [AutoPopulateInformation], :default => []
  property :unhcr_needs_codes_mapping, Mapping
  property :export_config_id

  # reporting_location_config is retained for backwards compatibility
  # going forward, use reporting_locations
  #TODO remove reporting_location_config after all existing configs have been remediated to use reporting_locations
  property :reporting_location_config, ReportingLocation
  property :reporting_locations, [ReportingLocation], :default => []

  property :primero_version
  property :age_ranges, { String => [AgeRange] }
  property :primary_age_range, String
  property :location_limit_for_api
  property :approval_forms_to_alert
  property :changes_field_to_form
  property :due_date_from_appointment_date, TrueClass, :default => false
  property :notification_email_enabled, TrueClass, :default => false
  property :welcome_email_enabled, TrueClass, :default => false
  property :duplicate_export_field

  localize_properties [:welcome_email_text]
  property :base_language, :default=>Primero::Application::LOCALE_ENGLISH

  # TODO this validation has been commented out because default_locale can now be blank if the locales.yml is used
  # validates_presence_of :default_locale, :message => I18n.t("errors.models.system_settings.default_locale")
  validate :validate_locales
  validate :validate_reporting_locations

  #TODO: Think about what needs to take place to the current config. Update?
  before_save :set_version
  before_save :add_english_locale
  after_initialize :set_version

  design do
    view :all
  end

  def initialize(*args)
    super(*args)
    # CouchDB stores JSON Objects, and Range is not a proper JSON Object
    # so upon fetching ranges from CouchDB, they need to be recreated
    age_ranges = args.first.try(:[], 'age_ranges')
    if age_ranges.present?
      age_ranges.each do |name, range_array|
        self.age_ranges[name] = range_array.map{ |r| AgeRange.from_string(r) }
      end
    end
  end

  #For now... allow empty locales for backwards compatibility with older configurations
  #The wrapper method will handle blank locales
  def validate_locales
    return true if locales.blank? || (locales.include? Primero::Application::LOCALE_ENGLISH)
    errors.add(:locales, I18n.t("errors.models.system_settings.locales"))
  end

  #If there are reporting locations, one (and only 1) of them should be PRIMARY
  def validate_reporting_locations
    if reporting_locations.present?
      primary_count = reporting_locations.select{|rl| rl.is_primary?}.count
      return true if primary_count == 1
      errors.add(:locales, I18n.t("errors.models.system_settings.reporting_locations.no_primary")) if primary_count == 0
      errors.add(:locales, I18n.t("errors.models.system_settings.reporting_locations.too_many_primary")) if primary_count > 1
      return false
    end
    true
  end

  #SyetsmSettings should be a singleton. It can have a hard-coded name.
  def name
    I18n.t('system_settings.label')
  end

  def update_default_locale
    logger.info "Setting the Primero locale to #{self.default_locale}"
    I18n.default_locale = self.default_locale
    I18n.locale = I18n.default_locale
  end

  def set_version
    self.primero_version = Primero::Application::VERSION
  end

  def add_english_locale
    locales.unshift(Primero::Application::LOCALE_ENGLISH) if locales.present? && (locales.exclude? Primero::Application::LOCALE_ENGLISH)
  end

  def auto_populate_info(field_key = "")
    self.auto_populate_list.select{|ap| ap.field_key == field_key}.first if self.auto_populate_list.present?
  end

  def get_reporting_location(reporting_location_admin_level)
    if reporting_locations.present?
      #TODO what if there is no match on admin_level?
      return reporting_locations.select{|l| l.admin_level == reporting_location_admin_level}.first if reporting_location_admin_level.present?

      #If no admin_level passed in, return the Primary Reporting Location
      return reporting_locations.select{|l| l.is_primary?}.first
    elsif reporting_location_config.present?
      warn "[DEPRECATION] 'reporting_location_config' is deprecated.  Please use 'reporting_locations' instead."
      reporting_location_config
    else
      {}
    end
  end

  def self.handle_changes
    system_settings = SystemSettings.first
    system_settings.update_default_locale if system_settings.present?
    flush_dependencies
  end

  def self.memoized_dependencies
    CouchChanges::Processors::Notifier.supported_models
  end

  class << self
    def current
      SystemSettings.first
    end
    memoize_in_prod :current
  end

  extend Observable
  add_observer(self, :handle_changes)

end
