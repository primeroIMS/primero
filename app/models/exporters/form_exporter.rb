module Exporters
  module FormExporter
    extend self #Expose these for rspec testing

    # Exports forms to an Excel spreadsheet
    def export_forms_to_spreadsheet(type = 'case', module = 'primeromodule-cp', show_hidden = false)
      hostname = "localhost" # where to get the hostname from??
      datetimenow = DateTime.now.strftime('%Y%m%d.%I%M')
      file_name = "forms-#{hostname}-{datetimenow}.xls"
      puts "Writing forms to #{file_name}"

      workbook = WriteExcel.new(File.open(file_name, 'w'))
      header = ['Form Group', 'Form Name', 'Field ID', 'Field Type', 'Field Name', 'Visible?', 'Options', 'Help Text', 'Guiding Questions']

      primero_module = PrimeroModule.get(module_id)
      forms = primero_module.associated_forms_grouped_by_record_type(false)
      forms = forms[type]
      form_hash = FormSection.group_forms(forms)
      form_hash.each do |group, form_sections|
        form_sections.sort_by{|f| [f.order, (f.is_nested? ? 1 : -1)]}.each do |form|
          write_out_form(form, workbook, header, show_hidden)
        end
      end

      workbook.close
    end

  end
end