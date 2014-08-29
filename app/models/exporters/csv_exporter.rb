require 'csv'

module Exporters
  class CSVExporter
    class << self
      def id
        'csv'
      end

      # @returns: a String with the CSV data and header
      def export(models, properties)
        CSV.generate do |rows|
          Exporters.to_2D_array(models, properties) do |row|
            rows << row
          end
        end
      end

    end
  end
end
