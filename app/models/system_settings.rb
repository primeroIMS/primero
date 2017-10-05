class SystemSettings < CouchRest::Model::Base
  use_database :system_settings

  include PrimeroModel
  include Memoizable

  property :default_locale, String, :default => 'en'
  property :case_code_format, [String], :default => []
  property :case_code_separator, String
  property :auto_populate_list, :type => [AutoPopulateInformation], :default => []
  property :unhcr_needs_codes_mapping, Mapping
  property :reporting_location_config, ReportingLocation
  property :primero_version
  property :age_ranges, { String => [AgeRange] }
  property :primary_age_range, String
  property :location_limit_for_api
  property :approval_forms_to_alert
  property :changes_field_to_form
  property :welcome_email_enabled, TrueClass, :default => false
  property :welcome_email_text, String

  validates_presence_of :default_locale, :message => I18n.t("errors.models.system_settings.default_locale")

  #TODO: Think about what needs to take place to the current config. Update?
  before_save :set_version
  after_initialize :set_version

  design do
    view :all
  end

  def initialize(*args)
    super(*args)
    # CouchDB stores JSON Objects, and Range is not a proper JSON Object
    # so upon fetching ranges from CouchDB, they need to be recreated
    age_ranges = args.first["age_ranges"]
    if age_ranges.present?
      age_ranges.each do |name, range_array|
        self.age_ranges[name] = range_array.map{ |r| AgeRange.from_string(r) }
      end
    end
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

  def auto_populate_info(field_key = "")
    self.auto_populate_list.select{|ap| ap.field_key == field_key}.first if self.auto_populate_list.present?
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
