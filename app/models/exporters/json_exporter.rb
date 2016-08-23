module Exporters
  class JSONExporter < BaseExporter
    class << self
      def id
        'json'
      end

      def export(models, properties, *args)
        props = properties_to_export(properties)
        hashes = models.map {|m| convert_model_to_hash(m, props)}
        JSON.pretty_generate(hashes)
      end
    end
  end
end
