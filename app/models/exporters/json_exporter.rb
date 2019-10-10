module Exporters
  class JSONExporter < BaseExporter
    class << self
      def id
        'json'
      end

      def excluded_properties
        ['crypted_password', 'salt']
      end
    end

    def export(models, properties, current_user, *args)
        props = JSONExporter.properties_to_export(properties)
        hashes = models.map {|m| convert_model_to_hash(m, props)}
        self.buffer.write(JSON.pretty_generate(hashes))
    end

    def convert_model_to_hash(model, properties)
      #TODO ... RON ... Handle hide_on_view_page scenario... pass in something indicating whether or not user has permission
      properties.reject! {|p| p.options[:hidden_text_field]} if model.try(:hidden_name)
      prop_names = properties.map {|p| p.name}
      JSON.parse(model.to_json).select do |k,v|
        prop_names.include? k
      end.tap do |h|
        h['model_type'] = model.class.name
        h['_id'] = model.id
        h
      end
    end

  end
end
