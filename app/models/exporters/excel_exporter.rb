require 'writeexcel'

module Exporters
  class ExcelExporter < BaseExporter
    class << self
      def id
        'xls'
      end

      def excluded_properties
        ['histories']
      end

      # @returns: a String with the Excel file data
      def export(models, properties, *args)
        @forms = build_forms(models)
        @sheets = {}

        io = StringIO.new
        workbook = WriteExcel.new(io)
        models.each do |model|
          @forms[model.module_id].each do |key, form|
            sheet = build_sheet(key, form, workbook)
            #module_id was injected as part of the first 3 fields for any row.
            values = sheet["fields"].reject{|name| name == "module_id"}.map do |name|
              get_value(model, name)
            end.flatten
            #try to find out if the row has no value, so there is no need to fill.
            if values.reject(&:blank?).present?
              #get the value of the 3 fields are always goes in any sheet.
              others_fields = ["_id", "model_type", "module_id"].map do |name|
                get_value(model, name)
              end.flatten
              col = 0
              (others_fields + values).each do |value|
                sheet["work_sheet"].write(sheet["row"], col, value)
                column_widths(sheet, col, value)
                col += 1
              end
              #the row should be tracked per sheet.
              sheet["row"] += 1
              adjust_column_width(sheet)
            end
          end
        end
        workbook.close
        io.string
      end

      private

      def adjust_column_width(sheet)
        sheet["column_widths"].each_with_index {|w, i| sheet["work_sheet"].set_column(i, i, w)}
      end

      def get_value(model, field_name)
        if field_name == "model_type"
          value = model.class.name
        else
          name = field_name.sub(/\[\]/, "")
          value = model.send(name)
          value = value.join(" ||| ") if value.is_a?(Array)
        end
        value
      end

      def column_widths(sheet, col, value)
        sheet["column_widths"][col] = value.to_s.length if value.to_s.length > sheet["column_widths"][col]
      end

      def build_forms(models)
        parent_form = models.first.class.parent_form
        modules = PrimeroModule.all.all
        modules.select{|pm| pm.associated_record_types.include?(parent_form)}.map do |pm|
          [pm.id, build_form_definition(pm, parent_form)]
        end.to_h.each{|key, value| value["___record_state___"]=other_form_section_fields()}
      end

      def build_form_definition(primero_module, parent_form)
        excluded_forms = ["mrm_summary_page", "tracing_request_photos_and_audio",
                          "incident_other_documents", "photos_and_audio",
                          "other_documents"]
        form_section_by_module(primero_module, parent_form)
          .reject{|form_section| excluded_forms.include?(form_section.unique_id)}
          .map do |form_section|
          [
            form_section.unique_id,
            {
              "name" => form_section.name,
              "fields" => exportable_fields(form_section.fields)
            }
          ]
        end.to_h
      end

      def other_form_section_fields
        {"name"=>"___record_state___",
         "fields"=>[
            "created_organization",
            "created_by_full_name",
            "last_updated_at",
            "last_updated_by",
            "last_updated_by_full_name",
            "posted_at",
            "unique_identifier",
            "record_state",
            "hidden_name",
            "owned_by_full_name",
            "previously_owned_by_full_name",
            "duplicate",
            "duplicate_of"]
        }
      end

      def build_sheet(form_id, form, workbook)
        return @sheets[form_id] if @sheets[form_id].present?
        work_sheet = generate_work_sheet(workbook, form["name"])
        column_widths = generate_column_widths((["_id", "model_type", "module_id"] + form["fields"]).uniq)
        write_header(work_sheet, (["_id", "model_type", "module_id"] + form["fields"]).uniq)
        @sheets[form_id] = {"work_sheet" => work_sheet, "fields" => form["fields"], "column_widths" => column_widths, "row" => 1}
      end

      def generate_work_sheet(workbook, form_name)
        #Clean up name and truncate to the allowed limit.
        work_sheet_name = form_name.sub(/[\[\]\:\*\?\/\\]/, " ").truncate(31)
        workbook.add_worksheet(work_sheet_name)
      end

      def exportable_fields(form_fields)
        form_fields.map do |field|
          if field.type == Field::DATE_RANGE
            [field.name + "_date_or_date_range",
             field.name,
             field.name + "_from",
             field.name + "_to"]
          elsif field.type == Field::TALLY_FIELD
            [field.name + "_boys",
             field.name + "_girls",
             field.name + "_unknown",
             field.name + "_total"]
          elsif field.type == Field::CHECK_BOXES
            field.name + "[]"
          elsif field.type == Field::SELECT_BOX && field.multi_select == true
            field.name + "[]"
          #Separator should be ignored, it has no data.
          #Subforms should ignored for now.
          elsif field.type != Field::SEPARATOR && field.type != Field::SUBFORM
            field.name
          end
        end.compact.uniq.flatten
      end

      def write_header(work_sheet, fields)
        col = 0
        fields.each do |name|
          work_sheet.write(0, col, name)
          col += 1
        end
      end

      def generate_column_widths(fields)
        fields.map { |name| name.length }
      end

      def form_section_by_module(primero_module, parent_form)
        forms_by_record_type = primero_module.associated_forms_grouped_by_record_type
        forms_for_current_record_type = forms_by_record_type[parent_form]
        forms_for_current_record_type.select(&:visible).sort {|a, b| [a.order_form_group, a.order] <=> [b.order_form_group, b.order] }
      end

    end
  end
end
