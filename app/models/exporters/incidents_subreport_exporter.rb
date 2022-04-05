# frozen_string_literal: true

# Class to export the Incidents Subreport
class Exporters::IncidentsSubreportExporter < Exporters::SubreportExporter
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
    %w[total gbv_sexual_violence gbv_previous_incidents].map do |indicator|
      [I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"), data[indicator]]
    end
  end
end
