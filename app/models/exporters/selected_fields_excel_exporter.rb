# frozen_string_literal: true

require 'write_xlsx'

# Exports selected forms and fields to a multi-tabbed Excel file.
# See the Exporters::ExcelExporter for concerns about the underlying library.
class Exporters::SelectedFieldsExcelExporter < Exporters::ExcelExporter
  METADATA_FIELD_NAMES = %w[
    created_organization created_by_full_name last_updated_at
    last_updated_by last_updated_by_full_name posted_at
    unique_identifier record_state hidden_name
    owned_by_full_name previously_owned_by_full_name
    duplicate duplicate_of
  ].freeze

  class << self
    def id
      'custom'
    end

    def supported_models
      [Child, TracingRequest]
    end

    def mime_type
      'xlsx'
    end
  end

  def establish_export_constraints(records, user, options)
    if constraining_fields?(options)
      constrain_fields(records, user, options)
    elsif constraining_forms_and_fields?(options)
      constrain_forms_and_fields(records, user, options)
    else
      super(records, user, options)
    end
    self.forms = forms.to_a + [metadata_form]
  end

  def constraining_fields?(options)
    options[:form_unique_ids].blank? && options[:field_names]
  end

  def constraining_forms_and_fields?(options)
    options[:form_unique_ids] && options[:field_names]
  end

  def constrain_fields(records, user, options)
    forms = forms_to_export(records, user)
    fields = fields_to_export(forms, options)
    self.forms = [selected_fields_form(fields)]
  end

  def constrain_forms_and_fields(records, user, options)
    forms = forms_to_export(records, user)
    field_names = fields_to_export(forms, options).map(&:name)
    self.forms = forms.map do |form|
      form_dup = form.dup
      form_dup.fields = form.fields.select { |f| field_names.include?(f.name) }.map(&:dup)
      form_dup
    end
    self.forms = self.forms.select { |f| f.fields.size.positive? }
  end

  private

  def selected_fields_form(fields)
    form = FormSection.new(
      unique_id: 'selected_fields',
      fields: fields
    )
    form.send(:name=, I18n.t('exports.selected_xls.selected_fields', locale: locale), locale)
    form
  end

  def metadata_form
    fields = METADATA_FIELD_NAMES.map do |name|
      field = Field.new(name: name, type: Field::TEXT_FIELD)
      field.send(:display_name=, name, locale)
      field
    end
    form = FormSection.new(unique_id: '__record__', fields: fields)
    form.send(:name=, '__record__', locale)
    form
  end

  def write_record_row(id, data, form)
    worksheet = worksheets[form.unique_id][:worksheet]
    rows_to_write = 1
    field_values = []
    form.fields.each do |field|
      if field.type == Field::SUBFORM
        data[field.name]&.each do |subform_data|
          write_record_form(id, subform_data, field.subform)
        end
      else
        value = export_field_value(data, form, field)
        field_values << value
        rows_to_write = value.size if value.is_a?(Array) && value.size > rows_to_write
      end
    end
    ([id] + field_values).each_with_index do |value, column|
      value_array = value.is_a?(Array) ? value : Array.new(rows_to_write, value)
      value_array.each_with_index do |val, i|
        worksheet&.write((worksheets[form.unique_id][:row] + i), column, val)
      end
    end
    rows_to_write
  end

  def export_field_value(data, form, field)
    return export_value(data[field.name], field) unless field.nested? && !form.is_nested

    values = []
    data[field&.form_section&.unique_id]&.each do |section|
      values << export_value(section[field.name], field)
    end
    values
  end
end
