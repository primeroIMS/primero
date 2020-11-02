# frozen_string_literal: true

# Export forms to an Excel file (.xlsx)
class Exporters::FormExporter
  VISIBLE_COLUMN_INDEX = 5 # So that we always know where to put the "Visible?" column if show_hidden is selected.

  def initialize(export_file = nil)
    @export_file_name = export_file || CleansingTmpDir.temp_file_name
    @io = File.new(@export_file_name, 'w')
    @workbook = WriteXLSX.new(@io)
  end

  def complete
    @workbook.close
    @io.close unless @io.closed?
    @io
  end

  def export_file
    @export_file_name
  end

  # Exports forms to an Excel spreadsheet
  def export_forms_to_spreadsheet(type = 'case', module_id = 'primeromodule-cp', show_hidden = false)
    header = ['Form Group', 'Form Name', 'Field ID', 'Field Type', 'Field Name', 'Required', 'On Mobile?',
              'On Short Form?', 'Options', 'Help Text', 'Guiding Questions']
    header = header.insert(VISIBLE_COLUMN_INDEX, 'Visible?') if show_hidden

    primero_module = PrimeroModule.find_by(unique_id: module_id)
    forms = primero_module.associated_forms_grouped_by_record_type(false)
    forms = forms[type]
    form_hash = forms.sort_by { |f| [f.order_form_group, f.order] }.group_by(&:form_group_id)
    form_hash.each do |_group, form_sections|
      form_sections.sort_by { |f| [f.order, (f.is_nested? ? 1 : -1)] }.each do |form|
        write_out_form(form, header, show_hidden)
      end
    end

    complete
  end

  def make_workbook_name_unique(workbook_name, idx = 0)
    return workbook_name if @workbook.worksheets.find { |w| w.name.gsub(/\u0000/, '') == workbook_name }.nil?

    idx += 1
    modify_workbook_name(workbook_name, idx)
  end

  def modify_workbook_name(workbook_name, idx = 0)
    letters_to_replace = Math.log10(idx).to_i + 1
    workbook_name.slice!((31 - letters_to_replace)..30)
    workbook_name += idx.to_s
    make_workbook_name_unique(workbook_name, idx)
  end

  def get_workbook_name(form)
    workbook_name = form.name.gsub(/[^0-9a-z ]/i, '')[0..30].to_s
    make_workbook_name_unique(workbook_name)
  end

  def write_out_form(form, header, show_hidden)
    return unless show_hidden || form.visible? || form.is_nested?

    # TODO: This should be probably some logging rather than puts?

    workbook_name = get_workbook_name(form)
    worksheet = @workbook.add_worksheet(workbook_name)
    worksheet.write(0, 0, form.unique_id)
    worksheet.write(1, 0, header)
    i = 0
    form.fields.each do |field|
      next unless show_hidden || field.visible?

      required = field.required ? '✔' : ''
      options = ''
      if %w[radio_button select_box].include?(field.type)
        if field.option_strings_source.present? && field.option_strings_source.start_with?('Location')
          options = 'Locations'
        else
          # TODO: i18n
          options_list = field.options_list(locale: :en, lookups: nil)
          # If a list of strings, just display the strings. If specified as an object, display the display_text.
          options = options_list.map { |o| o.is_a?(String) ? o : o['display_text'] }
          options = options.join(', ')
        end
      elsif field.type == 'subform'
        subform = field.subform_section
        options = "Subform: #{subform.name}"
        options += "\nCollapsed Fields: #{subform.collapsed_fields.map(&:name).join(', ')}" if subform.collapsed_fields.present?
        write_out_form(subform, header, show_hidden) rescue nil
      end
      field_type = field.type
      field_type += ' (multi)' if field.type == 'select_box' && field.multi_select
      mobile_visible = ((form.visible || form.is_nested) && form.mobile_form && field.mobile_visible) ? '✔' : ''
      minify_visible = field.show_on_minify_form ? '✔' : ''
      row_array = [form.form_group_id, form.name, field.name, field_type, field.display_name, required,
                   mobile_visible, minify_visible, options, field.help_text, field.guiding_questions]
      if show_hidden
        visible = field.visible? ? '✔' : ''
        row_array = row_array.insert(VISIBLE_COLUMN_INDEX, visible)
      end
      worksheet.write((i + 2), 0, row_array)
      i += 1 # Using the each_with_index method leaves empty rows for hidden fields. increment the index manually.
    end
  end
end
