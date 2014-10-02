require 'csv'
require_relative 'base.rb'

module Exporters
  class CSVExporter < BaseExporter
    class << self
      def id
        'csv'
      end

      # @returns: a String with the CSV data and header
      def export(models, properties, *args)
        CSV.generate do |rows|
          to_2D_array(models, properties_to_export(properties)) do |row|
            rows << row
          end
        end
      end

    end
  end
end
