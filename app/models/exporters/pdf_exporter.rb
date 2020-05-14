# frozen_string_literal: true

require 'prawn/document'
require 'arabic-letter-connector'

module Exporters
  class PDFExporter < BaseExporter

    class << self
      def id
        'case_pdf'
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

      def fields_to_export(properties_by_module, custom_export_options)
        unless custom_export_options.present?
          properties_by_module = exclude_forms(properties_by_module) if excluded_forms.present?
        end
        filter_custom_exports(properties_by_module.flatten.uniq { |f| f.name }, custom_export_options)
      end

      def reverse_page_direction
        I18n.locale.to_s.start_with?('ar')
      end
    end

    def initialize(output_file_path=nil)
      super(output_file_path)

      @pdf = Prawn::Document.new(:info => {
        :Title => "Primero Child Export",
        :Author => "Primero",
        :CreationDate => Time.now
      })

      # TODO: We should be selective about loading these fonts based on language. For now we are loading
      # everything.

      # Fallback fonts for other lanuages.

      # Arabic - From what I understand, Arabic uses different diacritics we need to make sure
      # to factor that in when choosing a font.
      @pdf.font_families["Riwaj"] = {
        normal: {
          :file => Rails.root.join('public/i18n_fonts/Riwaj.ttf'),
          :font =>"Riwaj"
        }
      }

      # Nepali
      @pdf.font_families["Kalimati_Regular"] = {
        normal: {
          :file => Rails.root.join('public/i18n_fonts/Kalimati_Regular.ttf'),
          :font => "Kalimati_Regular"
        }
      }

      # Add fallback fonts to array
      @pdf.fallback_fonts = %w[Riwaj Kalimati_Regular Arial_Unicode_MS]

      @pdf.text_direction self.class.reverse_page_direction ? :rtl : :ltr

      @subjects = []
    end

    def complete
      #:Subject metadata should be specified on the constructor of the PDF, but because
      #the exporter works in batches, we will get the full list of cases id at the end
      #of the processing. There is no straightforward official way to set this metadata
      #other than the constructor, So The following is a ¡¡¡¡¡HACK!!!!.
      @pdf.state.store.info.data[:Subject] = "Ids: " + @subjects.join(', ')

      #we return in the buffer the content of the exporter, so we
      #pass to the render in order return the content, even render returns
      #a string we will not use.
      self.buffer.set_encoding(::Encoding::ASCII_8BIT)
      @pdf.render(self.buffer)

      #It is very important to return the pointer to the beginning so the caller
      #gets the content of the pdf.
      self.buffer.rewind
    end

    def export(cases, properties_by_module, current_user, custom_export_options, *args)
      unless @props.present?
        @props = self.class.fields_to_export(properties_by_module, custom_export_options)
      end

      unless @form_sections.present?
        @form_sections = self.class.case_form_sections_by_module(cases, current_user)
      end
      cases.each do |cs|
        @subjects << cs.case_id
        @pdf.start_new_page if @pdf.page_number > 1
        start_page = @pdf.page_number
        @pdf.outline.section(section_title(cs), :destination => @pdf.page_number)
        render_case(@pdf, cs, @form_sections[cs.module.name], @props)
        end_page = @pdf.page_number
        print_heading(@pdf, cs, start_page, end_page)
      end
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

    def print_heading(pdf, _case, start_page, end_page)
      if end_page > start_page
        for i in (start_page + 1)..end_page
          pdf.go_to_page(i)
          pdf.bounding_box([pdf.bounds.right-50, pdf.bounds.top + 15], :width => 50) do
            pdf.text "#{_case.short_id}", :align => self.class.reverse_page_direction ? :right : :left
          end
        end
      end
    end

    def section_title(_case)
      _case.short_id
    end

    def render_case(pdf, _case, base_subforms, prop)
      #Only print the case if the case's module matches the selected module
      if prop.present?
        base_subforms = base_subforms.select{|sf| prop.keys.include?(sf.unique_id)}

        render_title(pdf, _case)

        grouped_subforms = base_subforms.group_by(&:form_group_id)

        pdf.outline.add_subsection_to(section_title(_case)) do
          grouped_subforms.each do |(parent_group, fss)|
            pdf.outline.section(parent_group, :destination => pdf.page_number, :closed => true) do
              fss.each do |fs|
                pdf.text render_i18n_text(fs.name), :style => :bold, :size => 16, :align => (self.class.reverse_page_direction ? :right : :left)
                pdf.move_down 10

                pdf.outline.section(fs.name, :destination => pdf.page_number)

                render_form_section(pdf, _case, fs, prop)

                pdf.move_down 10
              end
            end
          end
        end
      end
    end

    def render_title(pdf, _case)
      pdf.text section_title(_case), :style => :bold, :size => 20, :align => :center
    end

    def render_form_section(pdf, _case, form_section, prop)
      (subforms, normal_fields) = form_section.fields.reject {|f| f.type == 'separator' || f.visible? == false}
                                                     .partition {|f| f.type == Field::SUBFORM }

      render_fields(pdf, _case, normal_fields)
      subforms.map do |subf|
        pdf.move_down 10
        form_data = _case.try(:data).try(:[], subf.name)
        filtered_subforms = subf.subform_section.fields.reject {|f| f.type == 'separator' || f.visible? == false}
        pdf.text render_i18n_text(subf.display_name), :style => :bold, :size => 12, :align => (self.class.reverse_page_direction ? :right : :left)

        if (form_data.try(:length) || 0) > 0
          form_data.each do |el|
            render_fields(pdf, el, filtered_subforms)
            pdf.move_down 10
          end
        else
          render_blank_subform(pdf, filtered_subforms)
        end
      end
    end

    def render_blank_subform(pdf, subforms)
      render_fields(pdf, nil, subforms)
      pdf.move_down 10
    end

    def render_fields(pdf, obj, fields)
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

      column_widths = self.class.reverse_page_direction ? {0 => 300, 1 => 200} : {0 => 200, 1 => 300}

      table_options = {
        :row_colors => %w[  cccccc ffffff  ],
        :width => 500,
        :column_widths => column_widths,
        :position => :left,
        :cell_style => {
          :align => self.class.reverse_page_direction ? :right : :left
        }
      }

      pdf.table(table_data, table_options) if table_data.length > 0
    end

    def censor_value(attr_name, obj)
      case attr_name
      when 'name'
        # TODO: Refactor, should use RecordDataService.visible_name
        obj["hidden_name"] ? '***hidden***' : obj["name"]
      else
        obj.respond_to?('data') ? obj.data[attr_name] : obj[attr_name]
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
        render_i18n_text(I18n.l(value, format: time_format))
      when Date
        render_i18n_text(I18n.l(value, format: date_format))
      when Time
        render_i18n_text(I18n.l(value, format: time_format))
      when Array
        value.map {|el| format_field(field, el) }.join(', ')
      #when Hash
        #value.inject {|acc, (k,v)| acc.merge({ k => format_field(field, v) }) }
      else
        return render_i18n_text(field.display_text(value)) if (value.is_a?(Integer) && field.option_strings_source.present?)
        render_i18n_text(value.to_s)
      end
    end

  end
end
