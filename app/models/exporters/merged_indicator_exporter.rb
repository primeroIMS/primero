# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export a merged Indicator
class Exporters::MergedIndicatorExporter < Exporters::IndicatorExporter
  include Exporters::MergeableIndicatorExporter

  def load_indicator_options; end

  def load_subcolumn_options; end

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

  def total_subcolumn?
    false
  end
end
