# frozen_string_literal: true

# Class to export a merged Indicator
class Exporters::MergedIndicatorExporter < Exporters::IndicatorExporter
  include Exporters::MergeableIndicatorExporter

  def write
    write_table_header
    write_combined_data
    self.current_row += 1
  end

  def write_combined_data
    build_combined_data.each do |elem|
      worksheet.write(current_row, 0, elem.first, formats[:bold_black])
      worksheet.write(current_row, 1, elem.last)
      self.current_row += 1
    end
  end
end
