module Exporters
  class XlsFormExporter

    def initialize(record_type='case', module_id='primeromodule-cp', opts={})
      @record_type = record_type
      @primero_module = PrimeroModule.find_by(unique_id: module_id)
      #TODO: Implement user defined export path: opts[:export_path]
      @export_dir_path = dir(@record_type, @primero_module)
      locales = opts[:locales] || []
      @show_hidden_forms = opts[:show_hidden_forms].present?
      @show_hidden_fields = opts[:show_hidden_fields].present?
      @locales = compute_locales(locales)
    end

    MAPPING = {
      "text_field" => 'text',
      "textarea" => 'text',
      "radio_button" => 'select',
      "select_box" => 'select',
      "check_boxes" => 'select',
      "numeric_field" => 'integer',
      "photo_upload_box" => 'photo_upload_box', #TODO: Not mapped to canonical xls forms type
      "audio_upload_box" => 'audio_upload_box', #TODO: Not mapped to canonical xls forms type
      "document_upload_box" => 'document_upload_box', #TODO: Not mapped to canonical xls forms type
      "date_field" => 'dateTime',
      "date_range" => 'date_range', #TODO: Not mapped to canonical xls forms type
      "subform" => 'subform', #TODO: Not mapped to canonical xls forms type
      "separator" => 'note',
      "tick_box" => 'acknowledge',
      "tally_field" => 'tally_field', #TODO: Not mapped to canonical xls forms type
      "custom" => 'custom' #TODO: Not mapped to canonical xls forms type
    }

    def dir_name(record_type, primero_module)
      File.join(Rails.root.join('tmp', 'exports'), "forms_export_#{record_type}_#{primero_module.name.downcase}_#{DateTime.now.strftime("%Y%m%d.%I%M%S")}")
    end

    def dir(record_type, primero_module)
      FileUtils.mkdir_p dir_name(record_type, primero_module)
      dir_name(record_type, primero_module)
    end

    def excel_file_name(file_name='default')
      filename = File.join(@export_dir_path, "#{file_name}.xls")
    end

    def create_file_for_form(export_file=nil)
      @export_file_name = excel_file_name(export_file.to_s)
      @io = File.new(@export_file_name, "w")
      @workbook = WriteExcel.new(@io)
      @form_sheet = @workbook.add_worksheet('survey')
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

    def export_forms_to_spreadsheet
      forms = @primero_module.associated_forms_grouped_by_record_type(true)
      forms_record_type = forms[@record_type]
      unless @show_hidden_forms
        visible_top_forms = forms_record_type.select{|f| f.visible? && !f.is_nested?}
        visible_subform_ids = visible_top_forms
          .map{|form| form.fields.map{|f| f.subform_section_id}}
          .flatten.compact
        visible_subforms = forms_record_type.select{|f| f.is_nested? && visible_subform_ids.include?(f.unique_id)}
        forms_record_type = visible_top_forms + visible_subforms
      end
      forms_record_type.each do |form|
        create_file_for_form(form.unique_id)
        write_form(form)
        complete
      end
      Rails.logger.info {"Building exporter for: "}
      Rails.logger.info {"Record type: '#{@record_type}'"}
      Rails.logger.info {"Module ID: '#{@primero_module.unique_id}'"}
      Rails.logger.info {"Languages: '#{@locales}'"}
      Rails.logger.info {"File written to directory location: '#{@export_dir_path}"}
    end

    def write_form(form_section)
      #fill out the settings tab
      write_form_settings(form_section)
      form_headers = ['type', 'name'] + localize_header('label') + localize_header('hint') + localize_header('guidance') + localize_header('tick_box_label')
      @form_sheet.write(0, 0, form_headers)
      choices_header = ['list name', 'name'] + localize_header('label')
      @choices_sheet.write(0, 0, choices_header)
      fields = form_section.fields
      fields = fields.select{|f| f.visible?} unless @show_hidden_fields
      fields.each do |field|
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
      type = type_mapping(field)
      case type
      when nil
      when 'select_one', 'select_multiple'
        write_select(field, type)
      else
        write_field_row(field, type)
      end
    end

    def write_select(field, type)
      if field.option_strings_source.present? && field.option_strings_source.start_with?('lookup')
        option_source = field.option_strings_source.split
        option_name = "#{field.name}_opts"
        options = @locales.map { |locale| field.options_list(record=nil, lookups=nil, locations=nil, add_lookups=true, locale: locale) }
        if field.option_strings_source.present?
          write_options(option_name, options, lookup_id: field.option_strings_source.split.last)
        else
          write_options(option_name, options)
        end
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      elsif field.option_strings_text.present?
        option_name = "#{field.name}_opts"
        options = get_localized_property(field, 'option_strings_text')
        write_options(option_name, options)
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      elsif field.option_strings_source.present? && field.option_strings_source.start_with?('Location')
        #NOTE: The Location options are not added to the Choices spreadsheet, because I do not think locations have a localization option
        option_name = "#{field.name}_opts"
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      elsif field.option_strings_source.present? && field.option_strings_source.start_with?('User')
        #NOTE: The User options are not added to the Choices spreadsheet, because I do not think locations have a localization option
        option_name = "#{field.name}_opts"
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      elsif field.option_strings_source.present? && field.option_strings_source.start_with?('Agency')
        #NOTE: The Agency options are not added to the Choices spreadsheet, because I do not think locations have a localization option
        option_name = "#{field.name}_opts"
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      else
        option_name = "#{field.name}_opts"
        type = "#{type} #{option_name}"
        write_field_row(field, type)
      end
    end

    def write_field_row(field, type)
      #TODO: handle help text and guiding questions
      field_row = [type, field.name] + get_localized_property(field, 'display_name')
      field_row = field_row + get_localized_property(field, 'help_text')
      field_row = field_row + get_localized_property(field, 'guiding_questions')
      field_row = field_row + get_localized_property(field, 'tick_box_label')
      @form_sheet.write(@form_pointer, 0, field_row)
      @form_pointer += 1
    end

    def write_options(name, options, opts={})
      option_rows = if opts[:lookup_id].present?
        options.first.map{|option| [name, "#{opts[:lookup_id]} #{option['id']}"]}
      else
        options.first.map{|option| [name, option['id']]}
      end
      options.each do |localized_options|
        localized_options.each_with_index do |option, i|
          option_rows[i] << option['display_text']
        end
      end
      option_rows.each do |row|
        @choices_sheet.write(@choices_pointer, 0, row)
        @choices_pointer += 1
      end
    end

    def type_mapping(field)
      type = MAPPING[field.type]
      if type == 'select'
        type = (field.multi_select? ? 'select_multiple' : 'select_one')
      end
      return type
    end

    private

    def compute_locales(input_locales=nil)
      all_locales = Primero::Application::locales
      correct_locales = all_locales & input_locales
      if input_locales.empty? or correct_locales.empty?
        @locales = all_locales
      else
        @locales = ['en'] | correct_locales
      end
      return @locales
    end

    def localize_header(header)
      @locales.map{|loc| "#{header}::#{loc}"}
    end

    def get_localized_property(object, field_name)
      @locales.map do |loc|
        object.try("#{field_name}_#{loc}")
      end
    end

  end
end
