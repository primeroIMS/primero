# frozen_string_literal: true

# This model encapsulates system-wide configuration settings.
# These are selected at system bootstrap time,
# and will not be configured by the system administrator.
# SystemSetting should be invoked using the singleton SystemSettings#current method.
# Any update to the data will only take effect after the system is rebooted
# and the singleton is reloaded.
class SystemSettings < ApplicationRecord
  include LocalizableJsonProperty
  include Configuration

  store_accessor(
    :system_options,
    :due_date_from_appointment_date, :notification_email_enabled,
    :welcome_email_enabled, :show_alerts, :use_identity_provider,
    :identity_syncs
  )

  localize_properties [:welcome_email_text]

  validate :validate_locales
  validate :validate_reporting_location_admin_level,
           if: ->(system_setting) { system_setting.reporting_location_config.present? }

  after_initialize :set_version
  before_save :set_version
  before_save :add_english_locale
  before_save :default_reporting_location_label_key,
              if: ->(system_setting) { system_setting.reporting_location_config.present? }

  # For now allow empty locales for backwards compatibility with older configurations
  # The wrapper method will handle blank locales
  def validate_locales
    return true if locales.blank? || (locales.include? Primero::Application::LOCALE_ENGLISH)

    errors.add(:locales, 'errors.models.system_settings.locales')
  end

  def name
    I18n.t('system_settings.label')
  end

  def update_default_locale
    logger.info "Setting the Primero locale to #{default_locale}"
    I18n.default_locale = default_locale
    I18n.locale = I18n.default_locale
  end

  def set_version
    self.primero_version = Primero::Application::VERSION
  end

  def add_english_locale
    locales.present? &&
      (locales.exclude? Primero::Application::LOCALE_ENGLISH) &&
      locales.unshift(Primero::Application::LOCALE_ENGLISH)
  end

  def auto_populate_info(field_key = '')
    auto_populate_list.select { |ap| ap.field_key == field_key }.first if auto_populate_list.present?
  end

  def auto_populate_list
    super&.map { |a| AutoPopulateInformation.new(a) }
  end

  def auto_populate_list=(auto_populate_list)
    auto_populate_list.is_a?(Array) &&
      super(auto_populate_list.map(&:to_h))
  end

  def unhcr_needs_codes_mapping
    Mapping.new(super) if super.present?
  end

  def unhcr_needs_codes_mapping=(mapping)
    super(mapping.to_h)
  end

  def reporting_location_config
    ReportingLocation.new(super) if super.present?
  end

  def reporting_location_config=(config)
    super(config.to_h)
  end

  def age_ranges
    return unless super.present?

    result = {}
    # We stores JSON Objects in a jsonb column and Range is not a proper JSON Object
    # so upon fetching ranges from jsonb column, they need to be recreated
    super.each do |name, range_array|
      result[name] = range_array.map { |r| AgeRange.from_string(r) }
    end
    result
  end

  def age_ranges=(age_ranges)
    result = {}
    age_ranges.each do |name, range_array|
      result[name] = range_array.map(&:to_s)
    end
    super(result)
  end

  def default_reporting_location_label_key
    reporting_location_config.default_label_key
  end

  def validate_reporting_location_admin_level
    unless reporting_location_config.is_valid_admin_level?
      errors.add(:admin_level, 'errors.models.reporting_location.admin_level')
    end
    reporting_location_config.is_valid_admin_level?
  end

  class << self
    def current(rebuild = false)
      return @current unless @current.nil? || rebuild

      @current = SystemSettings.first
    end
  end
end