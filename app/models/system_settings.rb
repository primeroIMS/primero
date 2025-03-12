# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This model encapsulates system-wide configuration settings.
# These are selected at system bootstrap time,
# and will not be configured by the system administrator.
# SystemSetting should be invoked using the singleton SystemSettings#current method.
# Any update to the data will only take effect after the system is rebooted
# and the singleton is reloaded.
# rubocop:disable Metrics/ClassLength
class SystemSettings < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  TIMEFRAME_HOURS_TO_ASSIGN = 3
  TIMEFRAME_HOURS_TO_ASSIGN_HIGH = 1

  store_accessor(:system_options, :due_date_from_appointment_date,
                 :show_alerts, :code_of_conduct_enabled, :timeframe_hours_to_assign,
                 :timeframe_hours_to_assign_high, :duplicate_field_to_form,
                 :maximum_users, :maximum_users_warning, :maximum_attachments_per_record,
                 :primero_promote_config)

  localize_properties %i[welcome_email_text approvals_labels]

  validate :validate_reporting_location,
           if: ->(system_setting) { system_setting.reporting_location_config.present? }

  after_initialize :set_version
  before_save :set_version
  validate :validate_maximum_users
  validate :validate_maximum_users_warning
  validate :validate_maximum_users_values, if: :maximum_users_fields_present?

  def name
    I18n.t('system_settings.label')
  end

  def system_name
    system_name = system_options['system_name']
    system_name = system_name[I18n.locale] if system_name.is_a?(Hash)
    system_name || Rails.application.routes.default_url_options[:host]
  end

  def registry_types
    system_options&.[]('registry_types')
  end

  def set_version
    self.primero_version = Primero::Application::VERSION
  end

  def rtl_locales
    Primero::Application::RTL_LOCALES & I18n.available_locales
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
    super((reporting_location_config || {}).to_h.merge(config&.to_h))
  end

  def incident_reporting_location_config
    ReportingLocation.new(super) if super.present?
  end

  def age_ranges
    return unless super.present?

    result = {}
    # We store JSON Objects in a jsonb column and Range is not a proper JSON Object
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

  def validate_reporting_location
    unless reporting_location_config.valid_admin_level?
      errors.add(:admin_level, 'errors.models.reporting_location.admin_level')
    end
    reporting_location_config.valid_admin_level?
  end

  def timeframe_hours_to_assign
    super || TIMEFRAME_HOURS_TO_ASSIGN
  end

  def timeframe_hours_to_assign_high
    super || TIMEFRAME_HOURS_TO_ASSIGN_HIGH
  end

  def validate_maximum_users
    return if maximum_users.blank? || (maximum_users.is_a?(Integer) && maximum_users.positive?)

    errors.add(:maximum_users, 'errors.models.maximum_users.only_integer')
  end

  def validate_maximum_users_warning
    return if maximum_users_warning.blank? || (maximum_users_warning.is_a?(Integer) && maximum_users_warning.positive?)

    errors.add(:maximum_users_warning, 'errors.models.maximum_users_warning.only_integer')
  end

  def validate_maximum_users_values
    return if maximum_users >= maximum_users_warning

    errors.add(:base, 'errors.models.maximum_users.greater_than_warning')
  end

  def maximum_users_fields_present?
    maximum_users.present? && maximum_users_warning.present? &&
      maximum_users.is_a?(Integer) && maximum_users_warning.is_a?(Integer)
  end

  def maximum_attachments_per_record
    super || Attachment::DEFAULT_MAX_ATTACHMENTS
  end

  def primero_promote_config
    super || []
  end

  class << self
    def current(rebuild = false)
      return @current unless @current.nil? || rebuild

      @current = SystemSettings.first
    end

    def reset
      @current = nil
    end

    def locked_for_configuration_update?
      SystemSettings.pluck(:config_update_lock).first
    end

    def lock_for_configuration_update
      SystemSettings.first.update(config_update_lock: true)
    end

    def unlock_after_configuration_update
      SystemSettings.first.update(config_update_lock: false)
    end

    def primary_age_ranges(primary_range = nil)
      sys = SystemSettings.current
      selected_primary_range = primary_range || sys&.primary_age_range
      sys&.age_ranges&.[](selected_primary_range) || AgeRange::DEFAULT_AGE_RANGES
    end
  end
end
# rubocop:enable Metrics/ClassLength
