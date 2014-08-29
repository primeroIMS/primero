
module Importers
  class CSVImporter
    def self.import(file_obj)
      rows = CSV.parse(file_obj)
      flat_to_nested(rows)
    end
  end
end
