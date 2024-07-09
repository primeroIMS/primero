# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all Record exporters
class Exporters::BaseExporter
  EXPORTABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::NUMERIC_FIELD,
    Field::DATE_FIELD, Field::DATE_RANGE, Field::TICK_BOX, Field::TALLY_FIELD, Field::SUBFORM
  ].freeze

  FIRST_ROW_INDEX = 1

  attr_accessor :locale, :lookups, :field_value_service,
                :location_service, :record_type, :user, :options, :record_data_service,
                :export_constraints, :record_constraints, :single_record_export

  class << self
    def supported_models
      ApplicationRecord.descendants
    end

    def mime_type
      id
    end

    def excluded_field_names
      Field.binary.pluck(:name)
    end

    def authorize_fields_to_user?
      true
    end

    # This is a class method that does a one-shot export to a String buffer.
    # Don't use this for large data sets.
    def export(records, *)
      exporter_obj = new(*)
      exporter_obj.export(records)
      exporter_obj.complete
      exporter_obj.buffer.string
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    @io = output_file_path.present? ? File.new(output_file_path, 'w') : StringIO.new
    self.locale = config[:locale] || I18n.locale
    self.record_type = config[:record_type]
    self.user = config[:user]
    self.single_record_export = config[:single_record_export]
    self.options = options
    intialize_services
    establish_export_constraints
  end

  def export(records)
    records.each { |record| embed_associated_data(record) }
  end

  def embed_associated_data(record)
    #  If we need to embed other associated data we can add methods from the RecordDataService in this class.
    record.data = record_data_service.embed_family_info(record.data, record, field_names || [])
  end

  def intialize_services
    self.location_service = LocationService.instance
    self.field_value_service = FieldValueService.new(location_service:)
    self.record_data_service = RecordDataService.new
  end

  def establish_export_constraints
    return unless setup_export_constraints? && user.present?

    self.export_constraints = Exporters::Constraints::ExporterConstraints.new(
      record_type:, user:, excluded_field_names: self.class.excluded_field_names, options:
    )
    export_constraints.generate!
  end

  def establish_record_constraints(record)
    if user.referred_to_record?(record)
      self.record_constraints = Exporters::Constraints::ExporterConstraints.new(
        record:, record_type:, user:, excluded_field_names: self.class.excluded_field_names, options:
      )
      record_constraints.generate!
    else
      self.record_constraints = export_constraints
    end
  end

  def setup_export_constraints?
    true
  end

  def export_value(value, field)
    if value.is_a?(Date) then I18n.l(value)
    elsif value.is_a?(Time) then I18n.l(value, format: :with_time)
    elsif value.is_a?(Array)
      value.map { |v| export_value(v, field) }
    elsif field
      field_value_service.value(field, value, locale:)
    else
      value
    end
  end

  def complete
    buffer.instance_of?(File) && !buffer.closed? && @io.close
  end

  def buffer
    @io
  end

  def locale_hash
    { locale: }
  end

  def name_first_cell_by_column(column_index)
    "#{ColName.instance.col_str(column_index)}#{FIRST_ROW_INDEX}"
  end

  def non_permitted_field?(field)
    !field.nested? && !single_record_export && !record_constraints.field_names.include?(field.name)
  end

  def forms
    return [] unless setup_export_constraints?

    record_constraints&.forms || export_constraints.forms
  end

  def fields
    return [] unless setup_export_constraints?

    record_constraints&.fields || export_constraints.fields
  end

  def field_names
    return [] unless setup_export_constraints?

    record_constraints&.field_names || export_constraints.field_names
  end
end
