
module Importers
  class ExcelImporter < BaseImporter
    def self.id
      'xls'
    end

    def self.display_name
      'Excel'
    end

    def self.import(file_obj)
      book = Spreadsheet.open(file_obj)
      rows = book.worksheets[0].to_a

      return flat_to_nested(rows)
    end
  end
end
