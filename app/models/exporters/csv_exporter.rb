# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'csv'

# Exports the top level fields of a record to a flat CSV
class Exporters::CsvExporter < Exporters::BaseExporter
  EXCLUDED_TYPES = [
    Field::PHOTO_UPLOAD_BOX, Field::AUDIO_UPLOAD_BOX,
    Field::DOCUMENT_UPLOAD_BOX, Field::SUBFORM, Field::SEPARATOR
  ].freeze

  class << self
    def id
      'csv'
    end

    def supported_models
      [Child, Incident, TracingRequest, RegistryRecord, Family]
    end

    def excluded_field_names
      Field.where(type: EXCLUDED_TYPES).pluck(:name)
    end
  end

  def export(records)
    super(records)
    csv_export = CSVSafe.generate do |rows|
      if single_record_export
        export_single_record(records, rows)
      else
        export_records(records, rows)
      end
    end
    buffer.write(csv_export)
  end

  def export_records(records, rows)
    rows << headers if @called_first_time.nil?
    @called_first_time ||= true

    records.each do |record|
      establish_record_constraints(record)
      rows << row(record, export_constraints.fields)
    end
  end

  def export_single_record(records, rows)
    establish_record_constraints(records.first)
    rows << headers if @called_first_time.nil?
    @called_first_time ||= true

    rows << row(records.first, fields)
  end

  private

  def headers
    ['id'] + field_names
  end

  def row(record, fields)
    [record.id] + fields.map do |field|
      next if non_permitted_field?(field)

      record.data[field.name]
    end
  end
end
