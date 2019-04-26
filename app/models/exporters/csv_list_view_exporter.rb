require 'csv'

module Exporters
  class CSVListViewExporter < BaseExporter
    class << self
      def id
        'list_view_csv'
      end

      def mime_type
        'csv'
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def build_field_map(model_name, current_user)
      field_map = {}
      properties = ApplicationController.helpers.build_list_field_by_model(model_name, current_user)

      properties[:fields].each do |key, value|
        if properties[:type] == "incident" && value == "violations"
          field_map.merge!({ key => ->(c) { c.violations_list(true).join(", ") } })
        elsif properties[:type] == "incident" && value == "incident_date_derived"
          field_map.merge!({ key => ->(c) { c.incident_date_to_export } })
        elsif properties[:type] == "tracing_request" && value == "tracing_names"
          field_map.merge!({ key => ->(c) { c.tracing_names.join(", ") } })
        else
          field_map.merge!({ key => value })
        end
      end
      field_map
    end

    def export(models, properties, current_user, params)
      field_map = build_field_map(models.first.class.name, current_user)
      @fields = properties

      csv_list = CSV.generate do |rows|
        # @called_first_time is a trick for batching purposes,
        # so that headers are saved only once 
        rows << field_map.keys if @called_first_time.nil?
        @called_first_time ||= true

        models.each do |model|
          rows << field_map.map do |_, generator|
            case generator
            when Array
              self.class.translate_value(generator.first, model.value_for_attr_keys(generator))
            when Proc
              generator.call(model)
            else
              field_value = model.try(generator.to_sym)
              field_value = field_value["id"] if generator.eql?("owned_by_agency")
              self.class.translate_value(generator, CSVListViewExporter.to_exported_value(field_value))
            end
          end
        end
      end
      self.buffer.write(csv_list)
    end

  end
end
