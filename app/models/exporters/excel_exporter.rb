# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'write_xlsx'

# Export records to Excel. Every form is represented by a new tab.
# Subforms get a dedicated tab.
# Uses the write_xlsx gem
# rubocop:disable Metrics/ClassLength
class Exporters::ExcelExporter < Exporters::BaseExporter
  attr_accessor :workbook, :worksheets, :constrained_subforms

  class << self
    def id
      'xlsx'
    end

    def supported_models
      [Child, TracingRequest, Family]
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    super(output_file_path, config, options)
    self.workbook = WriteXLSX.new(buffer)
    self.worksheets = {}
    self.locale = user&.locale || I18n.locale
  end

  def export(records)
    super(records)
    if single_record_export
      export_single_record(records)
    else
      export_records(records)
    end
  end

  def export_records(records)
    constraint_subforms
    build_worksheets_with_headers
    records.each do |record|
      establish_record_constraints(record)
      write_record(record)
    end
  end

  def export_single_record(records)
    establish_record_constraints(records.first)
    constraint_subforms
    build_worksheets_with_headers
    write_record(records.first)
  end

  def worksheet_id(form, subform_field = nil)
    subform_field.present? ? subform_path(subform_field) : form.unique_id
  end

  def build_worksheets_with_headers
    return if worksheets.present?

    forms.each { |form| build_worksheet_with_headers(form) }
  end

  def build_worksheet_with_headers(form, subform_field = nil)
    worksheet = build_worksheet(form, subform_field)
    worksheet&.write(0, 0, 'ID')
    build_worksheet_fields(form, worksheet)
    worksheets[worksheet_id(form, subform_field)] = { worksheet:, row: 1 }
  end

  def build_worksheet_fields(form, worksheet)
    index = 0
    form.fields.each do |field|
      if field.type == Field::SUBFORM
        build_worksheet_with_headers(constrained_subforms[subform_path(field)], field)
      else
        index += 1
        worksheet&.write(0, index, field.display_name(locale))
      end
    end
  end

  def build_worksheet(form, subform_field = nil)
    # Don't build a separate worksheet for a form that only contains subform fields
    return if only_subform_fields?(form)

    name = worksheet_name(form, subform_field)
    begin
      workbook.add_worksheet(name)
    rescue RuntimeError
      increase_name_counter(name)
      workbook.add_worksheet("#{name[name_counter_range(name)]}-#{worksheets[:names][name]}")
    end
  end

  def increase_name_counter(name)
    worksheets[:names] = {} unless worksheets[:names].present?
    worksheets[:names][name] = (worksheets[:names][name] || 0) + 1
  end

  def name_counter_range(name)
    0..(-2 - worksheets[:names][name].digits.count)
  end

  def form_worksheet(form, subform_field = nil)
    worksheets[worksheet_id(form, subform_field)][:worksheet]
  end

  def only_subform_fields?(form)
    !form.fields.find { |field| field.type != Field::SUBFORM }
  end

  def worksheet_name(form, subform_field = nil)
    name = form_name(form)
    return format_form_name(name) if subform_field.blank?

    subform_name = form_name(subform_field.form).strip.slice(0, 15).concat("-#{name}")
    format_form_name(subform_name)
  end

  def form_name(form)
    form.name(locale.to_s).gsub(%r{[\[\]:*?/\\]}, ' ')
  end

  def format_form_name(name)
    name.strip.truncate(31)
  end

  def write_record(record)
    data = record.data

    forms.each do |form|
      write_record_form(record.short_id, data, form, form&.subform_field&.name)
    end
  end

  def write_record_form(id, data, form, form_name = '', subform_field = nil)
    return unless worksheets[worksheet_id(form, subform_field)].present?

    rows_written = write_record_row(id, data, form, form_name, subform_field)
    worksheets[worksheet_id(form, subform_field)][:row] += rows_written
  end

  def write_record_row(id, data, form, form_name, subform_field = nil)
    values, rows_to_write = field_values(data, form, form_name)
    ([id] + values).each_with_index do |value, column|
      write_value(form_worksheet(form, subform_field), value, column, rows_to_write, worksheet_id(form, subform_field))
    end
    form.subform_fields.each do |field|
      subform = constrained_subforms[subform_path(field)]
      data = apply_subform_display_conditions(data, field)
      write_record_form(id, data, subform, field.name, field)
    end
    rows_to_write
  end

  def field_values(data, form, form_name)
    field_values = []
    rows_to_write = 1
    form.non_subform_fields.each do |field|
      value = export_field_value(data, field, form_name)
      field_values << value
      rows_to_write = value.size if value.is_a?(Array) && value.size > rows_to_write
    end
    [field_values, rows_to_write]
  end

  def export_field_value(data, field, form_field_name)
    return if non_permitted_field?(field)
    return export_value(field_data_value(data, field), field) unless field.nested?

    data_form_name = form_field_name.presence || field&.form_section&.subform_field&.name
    data_values(data, data_form_name, field)
  end

  def data_values(data, data_form_name, field)
    values = []
    data[data_form_name]&.each do |section|
      values << export_value(field_data_value(section, field), field)
    end
    values
  end

  def write_value(worksheet, value, column, rows_to_write, current_worksheet_id)
    value_array = value.is_a?(Array) ? value : Array.new(rows_to_write, value)
    value_array.each_with_index do |val, i|
      if column.zero?
        worksheet&.write_string(worksheets[current_worksheet_id][:row] + i, column, val)
      else
        worksheet&.write(worksheets[current_worksheet_id][:row] + i, column, val)
      end
    end
  end

  def export_value(value, field)
    value = super(value, field)
    # TODO: This will cause N+1 issue
    if field.name == 'created_organization' && value.present?
      return Agency.get_field_using_unique_id(value, :name_i18n)[locale.to_s]
    end

    return value unless value.is_a?(Array)

    value.join(' ||| ')
  end

  def complete
    @workbook.close
    buffer
  end

  def field_data_value(data, field)
    return RecordDataService::CENSORED_VALUE if data['hidden_name'] == true && field.name == 'name'

    data[field.name]
  end

  def constraint_subforms
    subform_fields = forms.map(&:fields).flatten.select { |field| field.type == Field::SUBFORM }

    self.constrained_subforms = subform_fields.reduce({}) do |acc, subform_field|
      acc.merge(subform_path(subform_field) => constraint_subform_fields(subform_field))
    end
  end

  def subform_path(field)
    "#{field.form.unique_id}.#{field.name}"
  end

  def constraint_subform_fields(field)
    field_names = subform_configured_field_names(field)

    return field.subform unless field_names.present?

    subform = field.subform
    subform.fields = field.subform.fields.to_a.select do |sf_field|
      field_names[sf_field.name] == true
    end

    subform
  end

  def apply_subform_display_conditions(data, field)
    display_conditions = subform_display_conditions(field)

    return data unless display_conditions.present? && data[field.name].present?

    data[field.name] = data[field.name].select do |subform_values|
      display_conditions.all? { |key, value| subform_values[key] == value }
    end

    data
  end

  def subform_configured_field_names(field)
    (field.subform_section_configuration&.dig('fields') || []).reduce({}) { |acc, elem| acc.merge(elem => true) }
  end

  def subform_display_conditions(field)
    (field.subform_section_configuration&.dig('display_conditions') || []).reduce({}) { |acc, elem| acc.merge(elem) }
  end
end
# rubocop:enable Metrics/ClassLength
