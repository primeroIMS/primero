# frozen_string_literal: true

# Export forms to an Excel file (.xlsx)
class Exporters::FormExporter < ValueObject
  attr_accessor :export_file_name, :form_params, :locale, :visible, :workbook, :header, :visible_column_index

  def initialize(opts = {})
    opts[:export_file_name] ||= "form_export_#{DateTime.now.strftime('%Y%m%d.%I%M%S')}.xlsx"
    opts[:locale] ||= Primero::Application::LOCALE_ENGLISH
    opts[:record_type] ||= 'case'
    opts[:module_id] ||= 'primeromodule-cp'
    opts[:visible] = true if opts[:visible].nil?
    opts[:form_params] = opts.slice(:record_type, :module_id, :visible)&.compact
    opts[:header] = initialize_header(opts)
    super(opts)
  end

  def initialize_header(opts = {})
    self.visible_column_index = 5
    keys = %w[form_group form_name field_id field_type field_name required on_mobile on_short_form options
              help_text guiding_questions]
    keys = keys.insert(visible_column_index, 'visible') unless opts[:form_params][:visible]
    keys.map { |key| I18n.t("exports.forms.header.#{key}", locale: locale) }
  end

  def export
    self.workbook = WriteXLSX.new(export_file_name)
    sorted_forms.each { |form| export_to_worksheet(form) }
    self.workbook.close
  end

  private

  def sorted_forms
    FormSection.list(form_params).sort_by { |f| [f.order_form_group, f.order] }
  end

  def export_to_worksheet(form)
    # If we only want visible forms, skip forms that aren't visible... unless it is a subform
    return if visible && !form.visible? && !form.is_nested?

    worksheet = workbook.add_worksheet(worksheet_name(form))
    worksheet.write(0, 0, form.unique_id)
    worksheet.write(1, 0, header)

    row_number = 2
    form.fields.each do |field|
      next if visible && !field.visible?

      worksheet.write(row_number, 0, field_row(form, field))
      row_number += 1
    end
  end

  def worksheet_name(form)
    name = form.name(locale.to_s)
    name.sub(%r{[\[\]:*?\/\\]}, ' ')
      .encode('iso-8859-1', undef: :replace, replace: '')
      .strip.truncate(31)
  end

  # def worksheet_name(form)
  #   worksheet_name = form.name.gsub(/[^0-9a-z ]/i, '')[0..30].to_s
  #   make_worksheet_name_unique(worksheet_name)
  # end
  #
  # def make_worksheet_name_unique(worksheet_name, idx = 0)
  #   return worksheet_name if workbook.worksheets.find { |w| w.name.gsub(/\u0000/, '') == worksheet_name }.nil?
  #
  #   idx += 1
  #   modify_worksheet_name(worksheet_name, idx)
  # end
  #
  # def modify_worksheet_name(worksheet_name, idx = 0)
  #   letters_to_replace = Math.log10(idx).to_i + 1
  #   worksheet_name.slice!((31 - letters_to_replace)..30)
  #   worksheet_name += idx.to_s
  #   make_worksheet_name_unique(worksheet_name, idx)
  # end

  def field_row(form, field)
    required = field.required ? '✔' : ''
    mobile_visible = ((form.visible || form.is_nested) && form.mobile_form && field.mobile_visible) ? '✔' : ''
    minify_visible = field.show_on_minify_form ? '✔' : ''

    field_row = [form.form_group_id, form.name, field.name, field_type(field), field.display_name, required,
                 mobile_visible, minify_visible, field_options(field), field.help_text, field.guiding_questions]
    field_row = insert_visible_column(field_row, field) unless visible
    field_row
  end

  def field_options(field)
    return field_options_select(field) if %w[radio_button select_box].include?(field.type)

    return field_options_subform(field) if field.type == 'subform'

    ''
  end

  def field_options_select(field)
    %w[Location Agency User ReportingLocation].each do |option|
      return I18n.t("exports.forms.options.#{option.downcase}", locale: locale) if field.option_strings_source&.start_with?(option)
    end

    field.options_list.map { |o| o.is_a?(String) ? o : o['display_text'] }.join(', ')
  end

  def field_options_subform(field)
    # TODO: i18n
    subform = field.subform_section
    export_to_worksheet(subform)
    options = "Subform: #{subform.name}"
    options += "\nCollapsed Fields: #{subform.collapsed_fields.map(&:name).join(', ')}" if subform.collapsed_fields.present?
    options
  end

  def field_type(field)
    field_type = field.type
    field_type += ' (multi)' if field.type == 'select_box' && field.multi_select
    field_type
  end

  def insert_visible_column(field_row, field)
    visible_field = field.visible? ? '✔' : ''
    field_row.insert(visible_column_index, visible_field)
  end
end
