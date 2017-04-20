module Importers
  class XlsImporter

    def initialize(file_path, record_type='case', module_id='primeromodule-cp')
      @record_type = record_type
      @primero_module = PrimeroModule.get(module_id)
      @file_path = file_path
      @spreadsheet_forms = Dir.entries(@file_path)
      @spreadsheet_forms.delete(".")
      @spreadsheet_forms.delete("..")
    end

    def define_spreadsheet(form)
      form_path = File.join(@file_path, "#{form.name.downcase}.xls")
      @book = Spreadsheet.open(form_path)
      @survey = @book.worksheet(0)
      @choices = @book.worksheet(1)
      @settings = @book.worksheet(2)
      @locales = determine_locales(@survey)
      update_values_survey(form,create_survey_hash(@survey))
      update_values_choices(form,create_choices_hash(@choices))
    end

    def import_forms_from_spreadsheet
      all_db_forms = @primero_module.associated_forms_grouped_by_record_type(true)
      record_db_forms = all_db_forms[@record_type]
      record_db_forms.each do |form|
        if @spreadsheet_forms.include?("#{form.name.downcase}.xls")
          define_spreadsheet(form)
        end
      end
    end

    def determine_locales(sheet)
      prev_column = nil
      prev_language = nil
      locales = []
      sheet.rows[0].each do |column|
        curr_column = column.split("::")
        if curr_column.length > 1
          locales = locales | [curr_column[1]]
        end
        prev_column = curr_column[0]
      end
      locales
    end

    def update_values_survey(db_form, sheet_hash)
      db_form.fields.each do |db_field|
        if sheet_hash[db_field.name].present?
          @locales.each do |locale|
            eval("db_field.display_name_#{locale}=sheet_hash[db_field.name]['label'][locale]")
          end
        end
      end
    end

    def update_values_choices(db_form, sheet_hash)
      db_form.fields.each do |db_field|
        if db_field.option_strings_source.present? && db_field.option_strings_source.start_with?('lookup')
      	  option_source = db_field.option_strings_source.split.last
      	  lookup = Lookup.get(option_source)
      	  if sheet_hash[db_field.name]["lookup"].present?
      	    @locales.each do |locale|
      	      new_value = []
      	      sheet_hash[db_field.name][option_source].each do |lookup_choice_id, lookup_choice_value|
                new_value << {"id" => lookup_choice_id, "display_text" => lookup_choice_value[locale]}
              end
              eval("lookup.lookup_values_#{locale}=new_value")
              lookup.save
            end
          end
        elsif db_field.option_strings_text.present?
          index = 0
          db_field.option_strings_text.each do |option|
            if sheet_hash[db_field.name][option['id']].present?
              @locales.each do |locale|
              	new_value = []
                sheet_hash[db_field.name].each do |choice_id, choice_value|
                  new_value << {"id" => choice_id, "display_text" => choice_value[locale]}
                end
                eval("db_field.option_strings_text_#{locale}=#{new_value}")
              end
            end
          index = index + 1
          end
          #NOTE: THIS MAKES IT TAKE FOREVER
          db_form.save
        end
      end
    end 

    def determine_column_headers(sheet)
      prev_column = nil
      heading = []
      sheet.rows[0].each do |column|
        curr_column = column.split("::")
        if curr_column[1].length > 1
          heading << {heading: curr_column[0], locale: curr_column[1]}
        else
          heading << {heading: curr_column[0]}
        end
        prev_column = curr_column[0]
      end
      heading
    end

    def create_survey_hash(sheet)
      survey_hash = {}
      heading = sheet.rows[0]
      sheet.rows.each do |row|
        if (row != heading)
          index = 0
          name = nil
          row.each do |column|
            column_type = heading[index].split("::")
            case column_type[0]
            when "type"
            when "name"
              name = column
              survey_hash[name] = {}
              survey_hash[name]["label"] = {}
              survey_hash[name]["hint"] = {}
              survey_hash[name]["guidance"] = {}
            when "label"
              survey_hash[name]["label"][column_type[1]] = column
            when "hint"
              survey_hash[name]["hint"][column_type[1]] = column
            when "guidance"
              survey_hash[name]["guidance"][column_type[1]] = column
            end
            index = index + 1

          end
        end
      end
      survey_hash
    end

    def create_choices_hash(sheet)
      choices_hash = {}
      heading = sheet.rows[0]
      sheet.rows.each do |row|
        if (row != heading)
          index = 0
          field_name = nil
          choice_name = nil
          lookup = nil
          lookup_choice_id = nil
          row.each do |column|
            column_type = heading[index].split("::")
            case column_type[0]
            when "list name"
              field_name = column.split("_opts")[0]
              if !choices_hash[field_name].present?
                choices_hash[field_name] = {}
              end
            when "name"
              lookup = column.split("-")[0].eql? "lookup"
              column = column.split(" ")
              choice_name = column.first
              lookup_choice_id = column.last
              if lookup
                choices_hash[field_name]["lookup"] = choice_name
                if !choices_hash[field_name][choice_name].present?
                  choices_hash[field_name][choice_name] = {}
                end
                choices_hash[field_name][choice_name][lookup_choice_id] = {}
              else
                choices_hash[field_name][choice_name] = {}
              end
            when "label"
              if choices_hash[field_name]["lookup"]
                choices_hash[field_name][choice_name][lookup_choice_id][column_type[1]] = column
              else
                choices_hash[field_name][choice_name][column_type[1]] = column
              end
            end
            index = index + 1
          end

        end
      end
      choices_hash
    end

  end
end
