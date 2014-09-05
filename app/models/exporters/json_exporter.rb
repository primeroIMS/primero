module Exporters
  class JSONExporter
    class << self
      def id
        'json'
      end

      def export(models, properties)
        hashes = models.map {|m| Exporters.convert_model_to_hash(m, properties) }

        JSON.pretty_generate(hashes)
      end
    end
  end
end
