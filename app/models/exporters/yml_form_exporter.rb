module Exporters
  class YmlFormExporter

    def initialize(form_name, record_type='case', module_id='primeromodule-cp', opts={})
      if form_name.present?
        @form_name = form_name
      else
        @record_type = record_type
        @primero_module = PrimeroModule.get(module_id)
      end
      #TODO: Implement user defined export path: opts[:export_path]
      @export_dir_path = dir
      locales = opts[:locales] || []
      @show_hidden_forms = opts[:show_hidden_forms].present?
      @show_hidden_fields = opts[:show_hidden_fields].present?
      # @locales = compute_locales(locales)
      @locales = 'en'
    end

    def dir_name
      name_ext = ''
      if @form_name.present?
        name_ext = @form_name
      else
        name_ext = "#{@record_type}_#{@primero_module.name.downcase}"
      end
      File.join(Rails.root.join('tmp', 'exports'), "forms_yml_export_#{name_ext}_#{DateTime.now.strftime("%Y%m%d.%I%M%S")}")
    end

    def dir
      FileUtils.mkdir_p dir_name
      dir_name
    end

    def yml_file_name(file_name='default')
      filename = File.join(@export_dir_path, "#{file_name}.yml")
    end

    def create_file_for_form(export_file=nil)
      @export_file_name = yml_file_name(export_file.to_s)
      @io = File.new(@export_file_name, "w")
    end

    def complete
      @io.close if !@io.closed?
      return @io
    end

    def export_forms_to_yaml
      # Rails.logger.info {"Building exporter for: "}
      # Rails.logger.info {"Record type: '#{@record_type}'"}
      # Rails.logger.info {"Module ID: '#{@primero_module.id}'"}
      # Rails.logger.info {"Languages: '#{@locales}'"}
      # Rails.logger.info {"File written to directory location: '#{@export_dir_path}"}

      @form_name.present? ? export_one_form : export_multiple_forms
    end

    def export_one_form
      fs = FormSection.by_unique_id(key: @form_name).first
      if fs.present?
        export_form(fs)
      else
        Rails.logger.warn {"No FormSection found for #{form_name}"}
      end
    end

    def export_multiple_forms
      #TODO add hidden form handling
      #TODO add record type & module filtering

      forms = @primero_module.associated_forms_grouped_by_record_type(true)
      if forms.present?
        forms_record_type = forms[@record_type]
        unless @show_hidden_forms
          visible_top_forms = forms_record_type.select{|f| f.visible? && !f.is_nested?}
          visible_subform_ids = visible_top_forms
                                    .map{|form| form.fields.map{|f| f.subform_section_id}}
                                    .flatten.compact
          visible_subforms = forms_record_type.select{|f| f.is_nested? && visible_subform_ids.include?(f.unique_id)}
          forms_record_type = visible_top_forms + visible_subforms
        end
        forms_record_type.each{|fs| export_form(fs)}
      end


      # FormSection.all.each{|fs| export_form(fs)}
    end

    def export_form(form_section)
      Rails.logger.info {"Creating file #{form_section.unique_id}.yml"}
      #TODO better handle file location
      create_file_for_form(form_section.unique_id)
      # file = File.new("#{form_section.unique_id}.yml", 'w')
      form_hash = {}
      form_hash[form_section.unique_id] = form_section.localized_property_hash
      file_hash = {}
      file_hash['en'] = form_hash
      @io << file_hash.to_yaml
      complete
    end

    private

    # def compute_locales(input_locales=nil)
    #   all_locales = Primero::Application::locales
    #   correct_locales = all_locales & input_locales
    #   if input_locales.empty? or correct_locales.empty?
    #     @locales = all_locales
    #   else
    #     @locales = ['en'] | correct_locales
    #   end
    #   return @locales
    # end

  end
end
