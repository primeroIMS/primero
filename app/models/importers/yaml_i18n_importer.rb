module Importers
  class YamlI18nImporter
    def self.import(file_name, translated_model)
      new(file_name, translated_model).import
    end

    def initialize(file_name, translated_model)
      @values = YAML.load_file(file_name)
      @locale = nil
      if @values.present? && @values.is_a?(Hash)
        @locale = @values.keys.first
      end
      @translated_model = translated_model
    end

    def import
      if (@values.present? &&
          @values.is_a?(Hash) &&
          @locale.present? &&
          @translated_model.respond_to?(:import_translations))
        @values.values.each do |translation|
          @translated_model.import_translations(strip_hash_values!(translation), @locale)
        end
      end
    end

    def strip_hash_values!(hash)
      hash.each_value do |value|
        case value
        when String
          value.strip!
        when Hash
          strip_hash_values!(value)
         end
      end
    end
  end
end