
module Importers
  class ExcelImporter
    def self.id
      'xls'
    end
    
    def self.import(file_obj)
      book = Spreadsheet.open(file_obj)
      rows = book.worksheets[0].to_a

      return Importers.flat_to_nested(rows)
    end
  end
end
