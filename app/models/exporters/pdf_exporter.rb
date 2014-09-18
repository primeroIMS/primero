require 'prawn/document'

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

      def export(cases, _, current_user)
        pdf = Prawn::Document.new(:info => {
          :Title => "Primero Child Export",
          :Author => "Primero",
          :Subject => "Ids: " + (cases.map {|c| c.case_id}.join(', ')),
          :CreationDate => Time.now,
        })

        cases.each do |c|
          subforms_sorted = FormSection.get_permitted_form_sections(c.module, 'case', current_user)
          pdf.start_new_page if pdf.page_number > 1
          pdf.outline.section(section_title(c), :destination => pdf.page_number)
          render_case(pdf, c, subforms_sorted)
        end

        pdf.render
      end

      def section_title(_case)
        _case.name || _case.short_id
      end

      def render_case(pdf, _case, base_subforms)
        render_title(pdf, _case)

        render_photo(pdf, _case)

        base_subforms.each do |fs|
          pdf.text fs.name, :style => :bold, :size => 16
          pdf.move_down 10
          pdf.outline.add_subsection_to(section_title(_case)) do
            pdf.outline.section(fs.name, :destination => pdf.page_number)
          end

          render_form_section(pdf, _case, fs)

          pdf.move_down 10
        end
      end

      def render_title(pdf, _case)
        pdf.text "#{_case.name} (#{_case.short_id})", :style => :bold, :size => 20, :align => :center
      end

      def render_photo(pdf, _case)
        photo_file = if _case.primary_photo
          _case.primary_photo.data
        else
          File.new("app/assets/images/no_photo_clip.jpg", 'r')
        end

        pdf.image(photo_file,
          :position => :center,
          :fit => [pdf.bounds.width, pdf.bounds.width])
      end

      def render_form_section(pdf, _case, form_section)
        (subforms, normal_fields) = form_section.fields.partition {|f| f.type == Field::SUBFORM }

        render_fields(pdf, _case, normal_fields)

        subforms.map do |subf|
          pdf.move_down 10

          form_data = _case.__send__(subf.name)
          if (form_data.try(:length) || 0) > 0
            pdf.text subf.display_name, :style => :bold, :size => 12
            form_data.each do |el|
              render_fields(pdf, el, subf.subform_section.fields)
            end
          end
        end
      end

      def render_fields(pdf, obj, fields)
        table_data = fields.map do |f|
          [f.display_name, format_field(f, obj.__send__(f.name))]
        end

        table_options = {
          :row_colors => %w[  cccccc ffffff  ],
          :width => 500,
          :column_widths => {0 => 200, 1 => 300},
          :position => :left,
        }

        pdf.table(table_data, table_options) if table_data.length > 0
      end

      def format_field(field, value)
        case value
        when String
          value
        when DateTime
          value.strftime("%d-%b-%Y")
        when Date
          value.strftime("%d-%b-%Y")
        when Array
          value.map {|el| format_field(field, el) }.join(', ')
        #when Hash
          #value.inject {|acc, (k,v)| acc.merge({ k => format_field(field, v) }) }
        else
          value.to_s
        end
      end
    end
  end
end
