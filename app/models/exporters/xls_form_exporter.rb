module Exporters
  class XlsFormExporter

    MAPPING = {
      "text_field" => "text",
      "textarea" => "text",
      "radio_button" => "select",
      "select_box" => "select",
      "check_boxes" => "select",
      "numeric_field" => "integer",
      "photo_upload_box" => nil, #TODO
      "audio_upload_box" => nil, #TODO
      "document_upload_box" => nil, #TODO
      "date_field" => 'dateTime',
      "date_range" => nil,
      "subform" => 'subform',
      "separator" => 'note',
      "tick_box" => 'acknowledge',
      "tally_field" => nil, #TODO
      "custom" => nil #TODO
    }

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
      @settings_sheet.write(1, 0, settings)
    end

    def write_field(field)
      #TODO: Read only
      type = type_mapping(field)
      case type
      when nil
      when 'select_one', 'select_multiple'
        write_select(field, type)
      when 'subform'
        write_subform(field)
      else
        write_field_row(field, type)
      end
    end

    def write_select(field, type)
      #TODO: Locations
      binding.pry
      if field.option_strings_source.present? && field.option_strings_source.start_with?('lookup')
        option_source = field.option_strings_source.split
        option_name = option_source.last.titleize
        lookup = Lookup.find_by_name(option_name)
        option_name = option_name.underscore
        write_options(option_name, get_localized_property(lookup, 'lookup_values'))
      elsif field.option_strings_text.present?
        option_name = "#{field.name}_opts"
        write_options(option_name, get_localized_property(field, 'option_strings_text'))
      end
      type = "#{type} #{option_name}"
      write_field_row(field, type)
    end


    def write_subform(subform_field)
      #TODO: implement
    end



    def write_field_row(field, type)
      #TODO: handle help text and guiding questions
      field_row = [type, field.name] + get_localized_property(field, 'display_name')
      @form_sheet.write(@form_pointer, 0, field_row)
      @form_pointer += 1
    end

    def write_options(name, options)
      binding.pry
      option_rows = options.first.map{|option| [name, option['id']]}
      options.each do |localized_options|
        localized_options.each_with_index do |option, i|
          option_rows[i] << option['display_text']
        end
      end
      option_rows.each do |row|
        @choices_sheet.write(@choices_pointer, 0, row)
        @choices_pointer += @choices_pointer
      end
    end

    def type_mapping(field)
      type = MAPPING[field.type]
      if type == 'select'
        if field.multi_select?
          type = 'select_multiple'
        else
          type = 'select_one'
        end
      end
      return type
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