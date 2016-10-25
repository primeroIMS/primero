module Exporters
  class FormExporter

    def initialize
      @temp_filename = CleansingTmpDir.temp_file_name
      @io = File.new(@temp_filename, "w")
      @workbook = WriteExcel.new(@io)
    end

    def complete
      @workbook.close
      @io.close if !@io.closed?
      return @io
    end

    def temp_file
      return  @temp_filename
    end

    # Exports forms to an Excel spreadsheet
    def export_forms_to_spreadsheet(type = 'case', module_id = 'primeromodule-cp', show_hidden = false)
      header = ['Form Group', 'Form Name', 'Field ID', 'Field Type', 'Field Name', 'Visible?', 'Options', 'Help Text', 'Guiding Questions']

      primero_module = PrimeroModule.get(module_id)
      forms = primero_module.associated_forms_grouped_by_record_type(false)
      forms = forms[type]
      form_hash = FormSection.group_forms(forms)
      form_hash.each do |group, form_sections|
        form_sections.sort_by{|f| [f.order, (f.is_nested? ? 1 : -1)]}.each do |form|
          write_out_form(form, header, show_hidden)
        end
      end

      complete
    end

    def write_out_form(form, header, show_hidden)
      if show_hidden || form.visible? || form.is_nested?
        # TODO: This should be probably some logging rather than puts?
        puts "Exporting form #{form.name}"
        worksheet = @workbook.add_worksheet("#{(form.name)[0..25].gsub(/[^0-9a-z ]/i, '')}_#{form.parent_form}")
        worksheet.write(0, 0, form.name)
        worksheet.write(1, 0, header)
        form.fields.each_with_index do |field, i|
          if show_hidden || field.visible?
            visible = field.visible? ? 'Yes' : 'No'
            options = ''
            if ['radio_button', 'select_box', 'check_boxes'].include?(field.type)
              options = field.options_list.join(', ')
            elsif field.type == 'subform'
              subform = field.subform_section
              puts "Identifying subform #{subform.name}"
              options = "Subform: #{subform.name}"
              write_out_form(subform, header, show_hidden)
            end
            field_type = field.type
            field_type += " (multi)" if field.type == 'select_box' && field.multi_select
            worksheet.write((i+2),0,[form.form_group_name, form.name, field.name, field_type, field.display_name, visible, options, field.help_text, field.guiding_questions])
          end
        end
      end
    end

  end
end