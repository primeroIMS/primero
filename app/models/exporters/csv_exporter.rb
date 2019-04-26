require 'csv'

module Exporters
  class CSVExporter < BaseExporter
    class << self
      def id
        'csv'
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def export(models, properties, *args)
      props = CSVExporter.properties_to_export(properties.flatten.uniq {|u| u.name })
      csv_export = CSV.generate do |rows|
        CSVExporter.to_2D_array(models, props) do |row|
          rows << row
        end
      end
      self.buffer.write(csv_export)
    end
  end
end
