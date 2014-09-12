require 'writeexcel'

module Exporters
  class ExcelExporter < BaseExporter
    class << self
      def id
        'xls'
      end

      # @returns: a String with the Excel file data
      def export(models, properties)
        io = StringIO.new
        workbook = WriteExcel.new(io)
        worksheet = workbook.add_worksheet

        i = 0
        column_widths = []
        to_2D_array(models, properties) do |row|
          worksheet.write_row(i,0,row)

          row.each_with_index do |r, i|
            row_len = r.to_s.length
            if column_widths[i].nil? || (row_len > column_widths[i])
              column_widths[i] = row_len
            end
          end
          i += 1
        end

        column_widths.each_with_index {|w, i| worksheet.set_column(i, i, w)}

        workbook.close
        io.string
      end

      private

      # For some reason, bold doesn't seem to work
      def make_headers_bold(workbook)
        header_format = workbook.add_format(:bold => 1)
        workbook.worksheets.each {|ws| ws.set_row(0, 0, header_format) }
      end
    end
  end
end
