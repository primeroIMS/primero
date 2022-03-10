class Exporters::IncidentsSubreportExporter < Exporters::SubreportExporter
  def export
    self.current_row ||= 0
    self.data = managed_report.data[id]
    # TODO: The worksheet name has to be translated
    self.worksheet = workbook.add_worksheet(id)
    write_header
    write_combined_table
    write_indicators
  end

  def write_combined_table
    combined_data = build_combined_data
    write_table_header('combined')
    combined_data.each do |elem|
      self.current_row += 1
      worksheet.write(
        self.current_row,
        0,
        elem.first,
        formats[:bold_black]
      )
      worksheet.write(current_row, 1, elem.last)
    end

    self.current_row += 1
  end

  def build_combined_data
    [
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.total"),
        data['total']
      ],
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.gbv_sexual_violence"),
        data['gbv_sexual_violence']
      ],
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.gbv_previous_incidents"),
        data['gbv_previous_incidents']
      ]
    ]
  end
end
