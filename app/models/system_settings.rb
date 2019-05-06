class SystemSettings < ApplicationRecord

  # include Memoizable
  include LocalizableJsonProperty
  include Configuration

  store_accessor :system_options,
    :due_date_from_appointment_date, :notification_email_enabled,
    :welcome_email_enabled, :show_alerts

  localize_properties [:welcome_email_text]

  validate :validate_locales

  #TODO: Think about what needs to take place to the current config. Update?
  before_save :set_version
  before_save :add_english_locale
  after_initialize :set_version

  before_save :default_reporting_location_label_key, if: ->(system_setting) { system_setting.reporting_location_config.present? }
  validate :validate_reporting_location_admin_level, if: ->(system_setting) { system_setting.reporting_location_config.present? }

  #For now... allow empty locales for backwards compatibility with older configurations
  #The wrapper method will handle blank locales
  def validate_locales
    return true if locales.blank? || (locales.include? Primero::Application::LOCALE_ENGLISH)
    errors.add(:locales, "errors.models.system_settings.locales")
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

  def auto_populate_list
    super.map { |a| AutoPopulateInformation.new(a) } if !super.nil?
  end

  def auto_populate_list=(auto_populate_list)
    if auto_populate_list.is_a?(Array)
      super(auto_populate_list.map(&:to_h))
    end
  end

  def unhcr_needs_codes_mapping
    Mapping.new(super) if super.present?
  end

  def unhcr_needs_codes_mapping=(unhcr_needs_codes_mapping)
    super(unhcr_needs_codes_mapping.to_h)
  end

  def reporting_location_config
    ReportingLocation.new(super) if super.present?
  end

  def reporting_location_config=(reporting_location_config)
    super(reporting_location_config.to_h)
  end

  def age_ranges
    if super.present?
      result = {}
      # We stores JSON Objects in a jsonb column and Range is not a proper JSON Object
      # so upon fetching ranges from jsonb column, they need to be recreated
      super.each do |name, range_array|
        result[name] = range_array.map{ |r| AgeRange.from_string(r) }
      end
      result
    end
  end

  def age_ranges=(age_ranges)
    result = {}
    age_ranges.each do |name, range_array|
      result[name] = range_array.map(&:to_s)
    end
    super(result)
  end

  # def self.handle_changes
  #   system_settings = SystemSettings.first
  #   system_settings.update_default_locale if system_settings.present?
  #   flush_dependencies
  # end

  # TODO: I guess this won't be needed.
  # def self.memoized_dependencies
  #   CouchChanges::Processors::Notifier.supported_models
  # end

  def default_reporting_location_label_key
    self.reporting_location_config.default_label_key
  end

  def validate_reporting_location_admin_level
    if !self.reporting_location_config.is_valid_admin_level?
      errors.add(:admin_level, "errors.models.reporting_location.admin_level")
    end
    self.reporting_location_config.is_valid_admin_level?
  end

  class << self
    def current
      SystemSettings.first
    end
    # memoize_in_prod :current
  end

  # extend Observable
  # add_observer(self, :handle_changes)

end
