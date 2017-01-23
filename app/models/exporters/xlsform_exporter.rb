module Exporters
  class FormExporter

    XLSFORMS = 'xlsforms'
    PRIMERO = 'primero'

    def initialize(export_file=nil)
      @export_file_name = export_file || CleansingTmpDir.temp_file_name
      @io = File.new(@export_file_name, "w")
      @workbook = WriteExcel.new(@io)
      @form_sheet = @workbook.add_worksheet('form')
      @form_pointer = 1
      @choices_sheet = @workbook.add_worksheet('choices')
      @choices_pointer = 1
      @settings_sheet = @workbook.add_worksheet('settings')
    end

    def complete
      @workbook.close
      @io.close if !@io.closed?
      return @io
    end

    def write_form(form_section)
      #fill out the settings tab
      write_form_settings(form_section)

      form_headers = ['type', 'name'] + localize_header('label')
      @form_sheet.write(0, 0, form_headers)
      choices_header = ['list_name', 'name'] + localize_header('label')
      @choices_sheet.write(0, 0, choices_header)
      form_section.fields.each do |field|
        write_field(field)
      end
    end

    def write_form_settings(form_section)
      settings_headers = ['form_id'] + localize_header('form_title')
      @settings_sheet.write(0, 0, settings_headers)
      settings = [form_section.unique_id] + get_localized_property(form_section, 'name')
      end
      @settings_sheet.write(1, 0, settings)
    end

    def write_field(field)
      if field.type == Field.SUBFORM
        write_subform(field)
      else
        type = type_mapping(PRIMERO, field.type)
        if type.start_with? 'select'
          #TODO: handle options
        end
        #TODO: handle help text and guiding questions
        field_row = [type, field.name] + get_localized_property(field, 'display_name')
        @form_sheet.write(@form_pointer, 0, field_row)
        @form_pointer += 1
      end
    end

    def write_subform(subform_field)
      #TODO: implement
    end

    def write_options(options)
      #TODO: implement
    end

    def type_mapping(from_system, type)
      #return eiter a primero or xlsforms mapping
    end

    private

    def locales
      Primero::Application::locales
    end

    def localize_header(header)
      locales.map{|loc| "#{header}::#{loc}"}
    end

    def get_localized_property(object, field_name)
      locales.map do |loc|
        object.try("#{field_name}_#{loc}")
      end
    end

  end
end