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
      all_fields = self.class.load_fields(models.first, user: args.first) if models.present?
      props = CSVExporter.properties_to_export(all_fields)
      csv_export = CSV.generate do |rows|
        CSVExporter.to_2D_array(models, props) do |row|
          rows << row
        end
      end
      self.buffer.write(csv_export)
    end

  end
end
