# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for reportable location on records
module ReportableLocation
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :reporting_location_hierarchy

    before_save :calculate_reporting_location
  end

  def calculate_reporting_location
    location_property = system_settings_reporting_location_field
    return unless location_property.present? && changes_to_save_for_record.try(:[], location_property)

    hierarchy_data = hierarchy_path_for_location(location_property)
    return if hierarchy_data.blank?

    self.reporting_location_hierarchy = hierarchy_data
  end

  def system_settings_reporting_location_field
    @system_settings = SystemSettings.current

    return if @system_settings.blank?
    return if reporting_location_property.blank?

    @system_settings[reporting_location_property]&.dig('field_key')
  end

  def hierarchy_path_for_location(location_property)
    location_service.find_by_code(data[location_property])&.hierarchy_path
  end

  def reporting_location_property
    'reporting_location_config'
  end
end
