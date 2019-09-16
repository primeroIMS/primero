
module Importers
  class JSONImporter < BaseImporter
    def self.id
      'json'
    end

    def self.display_name
      'JSON'
    end

    def self.import(file_obj)
      JSON.parse(file_obj.read())
    end
  end
end
