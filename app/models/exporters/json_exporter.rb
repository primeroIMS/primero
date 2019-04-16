module Exporters
  class JSONExporter < BaseExporter
    class << self
      def id
        'json'
      end

      def excluded_properties
        ['crypted_password', 'salt']
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def export(models, properties, *args)
      props = JSONExporter.properties_to_export(properties)
      hashes = models.map {|m| convert_model_to_hash(m, props)}
      self.buffer.write(JSON.pretty_generate(hashes))
    end

    def convert_model_to_hash(model, properties)
      json_parse = JSON.parse(model.to_json)
      data_fields = json_parse["data"].select { |k, v| properties.include?(k) }
      json_parse["data"] = data_fields
      json_parse
    end

  end
end
