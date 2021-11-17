# frozen_string_literal: true

require 'write_xlsx'

# Export records to Excel. Every form is represented by a new tab.
# Subforms get a dedicated tab.
# Uses the write_xlsx gem
class Exporters::ExcelExporter < Exporters::BaseExporter
  attr_accessor :workbook, :worksheets, :constrained_subforms

  class << self
    def id
      'xlsx'
    end

    def supported_models
      [Child, TracingRequest]
    end
  end

  def initialize(output_file_path = nil)
    super(output_file_path)
    self.workbook = WriteXLSX.new(buffer)
    self.worksheets = {}
  end

  def export(records, user, options = {})
    establish_export_constraints(records, user, options)
    constraint_subforms
    build_worksheets_with_headers

    records.each do |record|
      write_record(record)
      worksheets_reset_written
    end
  end

  def build_worksheets_with_headers
    return if worksheets.present?

    forms.each { |form| build_worksheet_with_headers(form) }
  end

  def build_worksheet_with_headers(form)
    # Do not build the worksheet if the form is already there because
    # the same form can be referenced by different fields
    return if worksheets[form.unique_id].present?

    worksheet = build_worksheet(form)
    worksheet&.write(0, 0, 'ID')
    form.fields.each_with_index do |field, i|
      if field.type == Field::SUBFORM
        build_worksheet_with_headers(constrained_subforms[field.subform.unique_id])
      else
        worksheet&.write(0, i + 1, field.display_name(locale))
      end
    end
    worksheets[form.unique_id] = { worksheet: worksheet, row: 1 }
  end

  def build_worksheet(form)
    # Don't build a separate worksheet for a form that only contains subform fields
    return if only_subform_fields?(form)

    name = worksheet_name(form)
    begin
      workbook.add_worksheet(name)
    rescue RuntimeError
      workbook.add_worksheet("#{name[0..-3]}-1")
    end
  end

  def only_subform_fields?(form)
    !form.fields.find { |field| field.type != Field::SUBFORM }
  end

  def worksheet_name(form)
    name = form.name(locale.to_s)
    name.sub(%r{[\[\]:*?\/\\]}, ' ')
        .encode('iso-8859-1', undef: :replace, replace: '')
        .strip.truncate(31)
  end

  def write_record(record)
    forms.each do |form|
      write_record_form(record.short_id, record.data, form, form&.subform_field&.name)
    end
  end

  def write_record_form(id, data, form, form_name = '')
    # Do not write data if already written for this form
    return if worksheets[form.unique_id][:written] == true

    rows_written = write_record_row(id, data, form, form_name)
    worksheets[form.unique_id][:written] = true
    worksheets[form.unique_id][:row] += rows_written
  end

  def write_record_row(id, data, form, form_name)
    worksheet = worksheets[form.unique_id][:worksheet]
    values, rows_to_write = field_values(data, form, form_name)
    ([id] + values).each_with_index { |value, column| write_value(worksheet, form, value, column, rows_to_write) }
    form.subform_fields.each do |field|
      subform = constrained_subforms[field.subform.unique_id]
      data = apply_subform_display_conditions(data, field)
      write_record_form(id, data, subform, field.name)
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
    return export_value(field_data_value(data, field), field) unless field.nested?

    data_form_name = form_field_name.presence || field&.form_section&.subform_field&.name
    values = []
    data[data_form_name]&.each do |section|
      values << export_value(field_data_value(section, field), field)
    end
    values
  end

  def write_value(worksheet, form, value, column, rows_to_write)
    value_array = value.is_a?(Array) ? value : Array.new(rows_to_write, value)
    value_array.each_with_index { |val, i| worksheet&.write((worksheets[form.unique_id][:row] + i), column, val) }
  end

  def worksheets_reset_written
    worksheets.each { |_, value| value[:written] = false }
  end

  def export_value(value, field)
    value = super(value, field)
    # TODO: This will cause N+1 issue
    if field.name == 'created_organization' && value.present?
      return Agency.get_field_using_unique_id(value, :name_i18n).dig(locale.to_s)
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
      acc.merge(subform_field.subform.unique_id => constraint_subform_fields(subform_field))
    end
  end

  def constraint_subform_fields(field)
    field_names = subform_configured_field_names(field)

    return field.subform unless field_names.present?

    subform = field.subform.dup
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
