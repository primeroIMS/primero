require 'prawn/document'
require 'arabic-letter-connector'

module Exporters
  class NewPDFExporter < BaseExporter
    extend BaseSelectFields

    class << self
      def id
        'new_case_pdf'
      end

      def mime_type
        'pdf'
      end

      def supported_models
        [Child]
      end

      def excluded_forms
        FormSection.binary_form_names
      end

      def properties_to_export(properties_by_module, custom_export_options)
        unless custom_export_options.present?
          properties_by_module = exclude_forms(properties_by_module) if excluded_forms.present?
        end
        filter_custom_exports(properties_by_module, custom_export_options)
      end

      def reverse_page_direction
        I18n.locale.to_s.start_with?('ar')
      end
    end

    def initialize(output_file_path=nil)
      super(output_file_path)
    end

    def complete
      @io = StringIO.new(@pdf)
    end

    def export(cases, properties_by_module, current_user, custom_export_options, *args)
      @pdf_cases = []
      unless @props.present?
        @props = self.class.properties_to_export(properties_by_module, custom_export_options)
      end

      unless @form_sections.present?
        @form_sections = self.class.case_form_sections_by_module(cases, current_user)
      end

      cases

      cases.each do |cs|
        @pdf_cases << render_case(cs, @form_sections[cs.module.name], @props[cs.module.id])
      end

      printed_date = "#{I18n.t("exports.printed_date")} #{render_i18n_text(I18n.l(DateTime.now, format: :default))}"
      ac = ApplicationController.new
      @pdf = WickedPdf.new.pdf_from_string(
        ac.render_to_string('document_templates/case', encoding: "UTF-8", locals: { cases: @pdf_cases } ),
        margin:{
          top:35,
          right:5,
          left:5,
          bottom:20,
        },
        header: {
          spacing: 5,
          content: ac.render_to_string('document_templates/header',
                                        encoding: "UTF-8",
                                        locals: {
                                                  case_id: "#{I18n.t("case.label")}: #{cases.first.short_id}",
                                                  printed_date: printed_date
                                                })
        },
        footer: {
          spacing: 5,
          left: '[page]'
        }
      )
      @pdf

    end

    private

    def include_rtl?(txt)
      TwitterCldr::Shared::Bidi
          .from_string(txt)
          .types
          .include?(:R)
    end

    def reorder(txt)
      TwitterCldr::Shared::Bidi
        .from_string(txt.reverse, direction: :RTL)
        .reorder_visually!
        .to_s
    end

    def connect(txt)
      ArabicLetterConnector.transform(txt)
    end

    def render_i18n_text(txt)
      return txt.reverse if !include_rtl?(txt) && self.class.reverse_page_direction
      return txt if !include_rtl?(txt) && !self.class.reverse_page_direction

      if txt.match(/^\d{2}:\d{2} \d{4}-.*-\d{2}$/) || txt.match(/^\d{4}-.*-\d{2}$/)
        txt = txt.reverse!.gsub(/\p{Arabic}+/){ |ar| ar.reverse! }
      end

      if include_rtl?(txt) && txt.match(/\(|\)+/)
        txt = txt.gsub(/\(|\)+/) do |par|
          par.codepoints == 40 ? ")" : "("
        end
      end

      reorder(connect(txt))
    end

    def render_case(_case, base_subforms, prop)
      #Only print the case if the case's module matches the selected module
      if prop.present?
        case_forms = []
        base_subforms = base_subforms.select{|sf| prop.keys.include?(sf.unique_id)}

        grouped_subforms = base_subforms.group_by(&:form_group_name)

        grouped_subforms.each do |(parent_group, fss)|
          fss.each do |fs|
             case_forms << { form_name: render_i18n_text(fs.name), form_section: render_form_section(_case, fs, prop) }
          end
        end
        return case_forms
      end
    end

    def render_form_section(_case, form_section, prop)
      prop_field_keys = prop[form_section.unique_id].keys
      normal_fields = form_section.fields.select {|f| prop_field_keys.include?(f.name)}
      subforms = form_section.fields.select {|f| f.type == Field::SUBFORM }

      fields = render_fields(_case, normal_fields)

      data_subform = []
      render_subform = subforms.each do |subf|
        form_data = _case.__send__(subf.name) || _case[subf.name]
        filtered_subforms = subf.subform_section.fields.reject {|f| f.type == 'separator' || f.visible? == false}
        name_subform = render_i18n_text(subf.display_name)
        fields_subform = []
        if (form_data.try(:length) || 0) > 0
          form_data.each do |el|
            data_subform << { name: name_subform, fields: render_fields(el, filtered_subforms)}
          end
        else
          data_subform << { name: name_subform, fields: render_fields( nil, filtered_subforms)}
        end
      end
      {fields: fields, subform: data_subform }
    end

    def render_fields(obj, fields)
      table_data = fields.map do |f|
        if obj.present?
          value = censor_value(f.name, obj)
          row = [render_i18n_text(f.display_name), format_field(f, value)]
        else
          row = [render_i18n_text(f.display_name), nil]
        end

        row.reverse! if self.class.reverse_page_direction
        row
      end
    end

    def censor_value(attr_name, obj)
      case attr_name
      when 'name'
        obj.try(:hidden_name) ? '***hidden***' : obj.name
      else
        obj.__send__(attr_name)
      end
    end

    def format_field(field, value)
      date_format, time_format = self.class.reverse_page_direction ? [:rtl, :rtl_with_time] : [:default, :with_time]

      case value
      when TrueClass, FalseClass
        if value
          render_i18n_text(field.display_text(value))
        else
          ""
        end
      when String
        render_i18n_text(field.display_text(value))
      when DateTime
        render_i18n_text(I18n.l(value.in_time_zone, format: time_format))
      when Date
        render_i18n_text(I18n.l(value, format: date_format))
      when Time
        render_i18n_text(I18n.l(value, format: time_format))
      when Array
        value.map {|el| format_field(field, el) }.join(', ')
      #when Hash
        #value.inject {|acc, (k,v)| acc.merge({ k => format_field(field, v) }) }
      else
        render_i18n_text(value.to_s)
      end
    end

  end
end
