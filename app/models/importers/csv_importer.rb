
module Importers
  class CSVImporter
    def self.id
      'csv'
    end

    def self.display_name
      'CSV'
    end

    def self.import(file_obj)
      rows = CSV.parse(file_obj)

      return Importers.flat_to_nested(rows)
    end
  end
end
