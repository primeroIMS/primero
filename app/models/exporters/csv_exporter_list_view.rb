require 'csv'
require_relative 'base.rb'

module Exporters
  class CSVExporterListView < BaseExporter
    class << self
      def id
        'list_view_csv'
      end

      def mime_type
        'csv'
      end

      def build_field_map(properties)
        field_map = {}
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

      def export(models, properties, *args)
        field_map = build_field_map(properties)
        CSV.generate do |rows|
          rows << field_map.keys
          models.each do |c|
            rows << field_map.map do |_, generator|
              case generator
              when Array
                c.value_for_attr_keys(generator)
              when Proc
                generator.call(c)
              else
                to_exported_value(c.try(generator.to_sym))
              end
            end
          end
        end
      end
    end
  end
end
