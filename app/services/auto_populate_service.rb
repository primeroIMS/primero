# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Derive field values on records, as configured in SystemSettings.
class AutoPopulateService
  class << self
    def fetch_auto_populate_info(record, auto_populate_info)
      id_code_parts = []
      auto_populate_info.format.each { |pf| id_code_parts << PropertyEvaluator.evaluate(record, pf) }
      id_code_parts.reject(&:blank?).join(auto_populate_info.separator)
    end

    def auto_populate(record, field_key, system_settings = nil)
      current_settings = system_settings || SystemSettings.current
      auto_populate_info = current_settings.auto_populate_info(field_key) if current_settings.present?
      return unless auto_populate_info&.auto_populated == true && auto_populate_info.format.present?

      fetch_auto_populate_info(record, auto_populate_info)
    end

    def auto_populate_separator(field_key, system_settings = nil)
      current_settings = system_settings || SystemSettings.current
      auto_populate_info = current_settings.auto_populate_info(field_key) if current_settings.present?
      auto_populate_info.present? ? auto_populate_info.separator : ''
    end
  end
end
