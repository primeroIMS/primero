# frozen_string_literal: true

require 'csv'

module Exporters
  # Exports the top level fields of a record to a flat CSV
  class CSVExporter < BaseExporter
    class << self
      def id
        'csv'
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def export(records, fields, *_args)
      fields = fields_to_export(fields)
      csv_export = CSV.generate do |rows|
        rows << headers(fields)
        records.each do |record|
          rows << row(record, fields)
        end
      end
      buffer.write(csv_export)
    end

    private

    def headers(fields)
      ['id'] + fields.map(&:name)
    end

    def row(record, fields)
      [record.id] + fields.map do |field|
        record.data[field.name]
      end
    end
  end
end