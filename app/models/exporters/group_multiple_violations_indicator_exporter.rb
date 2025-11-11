# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Class to export the group multiple violations indicators
class Exporters::GroupMultipleViolationsIndicatorExporter < Exporters::MultipleViolationsIndicatorExporter
  attr_accessor :option_strings_text

  def load_indicator_options
    self.option_strings_text = {
      'group_age_band' => Field.find_by(name: 'group_age_band')&.options_list(locale:)
    }
  end

  def write_victim_information(elem)
    group_age_band = elem.dig('data', 'group_age_band') || []
    victim_information = [
      elem.dig('data', 'unique_id').last(7),
      display_text_from_lookup(elem.dig('data', 'group_gender'), 'lookup-gender-mixed'),
      group_age_band.map { |age_band| display_text_from_option_strings(age_band, 'group_age_band') }
    ].compact.join(' - ')
    worksheet.write_string(current_row, 0, victim_information)
  end

  def display_text_from_option_strings(value, field_name)
    option_strings_text[field_name].find { |elem| elem['id'] == value }&.dig('display_text')
  end
end
