# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'csv'

# Export as CSV the record list that the user sees.
class Exporters::CsvListViewExporter < Exporters::BaseExporter
  class << self
    def id
      'list_view_csv'
    end

    def mime_type
      'csv'
    end

    def supported_models
      [Child, Incident, TracingRequest, Family]
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    super(output_file_path, config, options)
    @record_data_service = RecordDataService.new
    self.locale = user.locale
  end

  def setup_export_constraints?
    false
  end

  def export(records)
    super(records)
    csv_export = build_csv_export(records, list_headers)
    buffer.write(csv_export)
  end

  def build_csv_export(records, list_headers)
    CSVSafe.generate do |rows|
      next unless list_headers

      rows << headers(list_headers) if @called_first_time.nil?
      @called_first_time ||= true

      records.each { |record| rows << row(record) }
    end
  end

  def filtered_list_headers
    module_headers = user_module_headers
    Header.get_headers(user, record_type).filter { |header| module_headers.include?(header.name) }
  end

  def user_module_headers
    user.modules.map do |primero_module|
      primero_module.record_list_headers[Child.parent_form.pluralize.to_sym]
    end.flatten.compact.uniq
  end

  def list_headers
    return @list_headers if @list_headers

    @list_headers = if record_type == Child.parent_form
                      filtered_list_headers
                    else
                      record_type && Header.get_headers(user, record_type)
                    end
  end

  def headers(list_headers)
    list_headers.map do |header|
      I18n.t("#{record_type.pluralize}.#{header.name}", default: '', locale:)
    end
  end

  def row(record)
    data = @record_data_service.data(record, user, field_names)
    list_headers.map do |header|
      field = header_fields.find { |f| f.name == header.field_name }
      export_value(data[header.field_name], field)
    end
  end

  def header_fields
    return @header_fields if @header_fields

    @header_fields = Field.where(name: field_names).uniq(&:name)
  end

  def field_names
    @field_names ||= list_headers.map(&:field_name)
  end
end
