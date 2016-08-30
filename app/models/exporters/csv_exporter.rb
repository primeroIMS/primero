require 'csv'
require_relative 'base.rb'

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
      props = CSVExporter.properties_to_export(properties)
      csv_export = CSV.generate { |rows|
        CSVExporter.to_2D_array(models, props) { |row|
          rows << row
        }
      }
      self.buffer.write(csv_export)
    end

  end
end
