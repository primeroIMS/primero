
module Importers
  class JSONImporter
    def self.id
      'json'
    end

    def self.import(file_obj)
      JSON.parse(file_obj.read())
    end
  end
end
