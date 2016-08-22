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

      # @returns: a String with the CSV data and header
      def export(models, properties, *args)
        props = properties_to_export(properties)
        CSV.generate do |rows|
          to_2D_array(models, props) do |row|
            rows << row
          end
        end
      end

    end
  end
end
