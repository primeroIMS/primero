require 'csv'

module Exporters
  class CSVExporter
    class << self
      def id
        'csv'
      end

      # @returns: a String with the CSV data and header
      def export(models, properties)
        matrix = Exporters.to_2D_array(models, properties)
        CSV.generate do |rows|
        end
      end

    end
  end
end
