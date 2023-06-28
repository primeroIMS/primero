# frozen_string_literal: true

# Class to export the violations indicator
class Exporters::ViolationsIndicatorExporter < Exporters::IndicatorExporter
  def load_indicator_options
    self.indicator_options = []
  end

  def write
    write_table_header
    write_violations_data
    self.current_row += 1
  end

  def write_total_row
    worksheet.set_row(current_row, 40)
    worksheet.write(
      current_row,
      1,
      I18n.t('managed_reports.ghn_report.sub_reports.associated_violations', locale: locale),
      formats[:bold_blue]
    )
    self.current_row += 1
  end

  def write_violations_data
    values.each do |elem|
      write_child_information(elem)
      write_violations(elem)

      self.current_row += 1
    end
  end

  def write_child_information(elem)
    child_information = [
      elem[:data][:unique_id].last(7),
      display_text_from_lookup(elem[:data][:individual_sex], 'lookup-gender-unknown-total'),
      elem[:data][:individual_age]
    ].compact.join(' - ')
    worksheet.write(current_row, 0, child_information)
  end

  def write_violations(elem)
    violations = elem[:data][:violations].map do |v|
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{v}", locale: locale)
    end.join(",\n")
    worksheet.write(current_row, 1, violations)
  end
end
