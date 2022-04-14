# frozen_string_literal: true

# Class to export the Incidents Subreport
class Exporters::IncidentsSubreportExporter < Exporters::SubreportExporter
  COMBINED_INDICATORS = %w[total gbv_sexual_violence gbv_previous_incidents].freeze

  def write_export
    write_header
    write_params
    write_generated_on
    write_combined_table
    write_indicators
  end

  def write_combined_table
    write_table_header('combined')
    build_combined_data.each do |elem|
      worksheet.write(current_row, 0, elem.first, formats[:bold_black])
      worksheet.write(current_row, 1, elem.last)
      self.current_row += 1
    end
    self.current_row += 1
  end

  def build_combined_data
    COMBINED_INDICATORS.map do |indicator|
      [I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"), data[indicator]&.first&.dig('total')]
    end
  end

  def write_indicators
    transform_entries(data.entries).each do |(indicator_key, indicator_values)|
      next if COMBINED_INDICATORS.include?(indicator_key)

      write_indicator(indicator_key, indicator_values)
    end
  end
end
