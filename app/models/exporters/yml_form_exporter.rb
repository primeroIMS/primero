# frozen_string_literal: true

module Exporters
  class YmlFormExporter
    class << self
      def id
        'ymlform'
      end

      def mime_type
        'yml'
      end

      def supported_models
        [Child]
      end
    end

    def initialize(stored_file_name)
      @stored_file_name = stored_file_name || CleansingTmpDir.temp_file_name
    end

    def dir_name
      custom_export_dir = ENV['EXPORT_DIR']
      return custom_export_dir if custom_export_dir.present? && File.directory?(custom_export_dir)

      name_ext = @form_id.present? ? @form_id : "#{@record_type}_#{@primero_module.name.downcase}"
      File.join(
        Rails.root.join('tmp', 'exports'), "forms_yml_export_#{name_ext}_#{DateTime.now.strftime('%Y%m%d.%I%M%S')}"
      )
    end

    def dir
      FileUtils.mkdir_p dir_name
      dir_name
    end

    def yml_file_name(file_name = 'default')
      File.join(@export_dir_path, "#{file_name}.yml")
    end

    def create_file_for_form(_)
      @io = File.new(@stored_file_name, 'w')
    end

    def complete
      @io.close unless @io.closed?
      @io
    end

    def export(_, _, opts = {})
      if opts['form_id'].present?
        @form_id = opts['form_id']
      else
        @record_type = opts['record_type'] || 'case'
        @primero_module = PrimeroModule.find_by(unique_id: (opts['module_id'] || 'primeromodule-cp'))
      end
      @show_hidden_forms = opts['show_hidden_forms'].present?
      @show_hidden_fields = opts['show_hidden_fields'].present?
      @locale = opts['locale'].present? ? opts['locale'].to_sym : Primero::Application::BASE_LANGUAGE
      @export_dir_path = dir
      @form_id.present? ? export_one_form : export_multiple_forms
    end

    def export_one_form
      fs = FormSection.find_by(unique_id: @form_id)
      if fs.present?
        Rails.logger.info(
          "Form ID: #{@form_id}, Show Hidden Forms: #{@show_hidden_forms},
          Show Hidden Fields: #{@show_hidden_fields}, Locale: #{@locale}"
        )
        export_form(fs)
      else
        Rails.logger.warn { "No FormSection found for #{@form_id}" }
      end
    end

    def export_multiple_forms
      forms = @primero_module.associated_forms_grouped_by_record_type(true)
      if forms.present?
        Rails.logger.info(
          "Record Type: #{@record_type}, Module: #{@primero_module.unique_id}, Show Hidden Forms: #{@show_hidden_forms},
          Show Hidden Fields: #{@show_hidden_fields}, Locale: #{@locale}"
        )
        forms_record_type = forms[@record_type]
        subforms = FormSection.get_subforms(forms_record_type)
        if @show_hidden_forms
          forms_record_type += subforms
        else
          visible_top_forms = forms_record_type.select { |f| f.visible? && !f.is_nested? }
          visible_subforms = subforms.select { |subform| subform.visible? && subform.is_nested? }
          forms_record_type = visible_top_forms + visible_subforms
        end
        forms_record_type.each { |fs| export_form(fs) }
      else
        Rails.logger.warn { "No FormSections found for #{@primero_module.unique_id}" }
      end
      export_lookups
    end

    def export_form(form_section)
      create_file_for_form(form_section.unique_id)
      form_hash = {}
      form_hash[form_section.unique_id] = form_section.localized_property_hash(@locale, @show_hidden_fields)
      file_hash = {}
      form_hash.compact
      file_hash[@locale] = form_hash.present? ? form_hash : nil
      @io << file_hash.to_yaml
      complete
    end

    def export_lookups
      Rails.logger.info('Exporting Lookups...')
      lookups = Lookup.all
      if lookups.present?
        Rails.logger.info("Locale: #{@locale}")
        create_file_for_form('lookups')
        lookup_hash = {}
        lookups.each { |lkp| lookup_hash[lkp.unique_id] = lkp.localized_property_hash(@locale) }
        file_hash = {}
        file_hash[@locale] = lookup_hash
        @io << file_hash.to_yaml
        complete
      else
        Rails.logger.warn { 'No Lookups found' }
      end
    end
  end
end
