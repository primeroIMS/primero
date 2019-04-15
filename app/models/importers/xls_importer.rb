module Importers
  class XlsImporter

    def initialize(file_path, record_type='case', module_id='primeromodule-cp')
      @record_type = record_type
      @primero_module = PrimeroModule.find_by(unique_id: module_id)
      @file_path = file_path
      @spreadsheet_forms = get_spreadsheet_list
    end

    def get_spreadsheet_list
      spreadsheet_forms = Dir.entries(@file_path)
      spreadsheet_forms.delete(".")
      spreadsheet_forms.delete("..")
      spreadsheet_forms
    end

    def define_spreadsheet(form)
      form_path = File.join(@file_path, "#{form.unique_id}.xls")
      @book = Spreadsheet.open(form_path)
      @survey = @book.worksheets.find{|w| w.name.gsub(/\u0000/, "") == 'survey'}
      @choices = @book.worksheets.find{|w| w.name.gsub(/\u0000/, "") == 'choices'}
      @settings = @book.worksheets.find{|w| w.name.gsub(/\u0000/, "") == 'settings'}
      @locales = determine_locales(@settings).reject{|e| e == 'en'} #TODO: do not update english for now
      update_values_survey(form,create_survey_hash(@survey))
      update_values_choices(form,create_choices_hash(@choices))
      update_values_settings(form,create_settings_hash(@settings))
    end

    def import_forms_from_spreadsheet
      all_db_forms = @primero_module.associated_forms_grouped_by_record_type(true)
      record_db_forms = all_db_forms[@record_type]
      Rails.logger.info {"Importing the forms in the following directory: #{@file_path}"}
      record_db_forms.each do |form|
        if @spreadsheet_forms.include?("#{form.unique_id}.xls")
          Rails.logger.info {"Importing form from #{form.unique_id}.xls"}
          define_spreadsheet(form)
        end
      end
    end

    def determine_locales(sheet)
      locales = []
      sheet.rows[0].each do |column|
        curr_column = column.split("::")
        locales = (curr_column[1].present? ? locales | [curr_column[1]] : locales)
      end
      locales
    end

    def update_values_survey(db_form, sheet_hash)
      #TODO: Implement 'hint' and 'guidance' labels
      db_form.fields.each do |db_field|
        if sheet_hash[db_field.name].present?
          @locales.each do |locale|
            eval("db_field.display_name_#{locale}=sheet_hash[db_field.name]['label'][locale]")
            eval("db_field.tick_box_label_#{locale}=sheet_hash[db_field.name]['tick_box_label'][locale]")
            eval("db_field.help_text_#{locale}=sheet_hash[db_field.name]['hint'][locale]")
            eval("db_field.guiding_questions_#{locale}=sheet_hash[db_field.name]['guidance'][locale]")
          end
        else
          Rails.logger.warn {"The questions for #{db_field.name} were not included in the Survey sheet of the #{db_form.unique_id}.xls spreadsheet and were not updated"}
        end
      end
    end

    def update_values_choices(db_form, sheet_hash)
      db_form.fields.each do |db_field|
        if db_field.option_strings_source.present? && db_field.option_strings_source.start_with?('lookup')
          option_source = db_field.option_strings_source.split.last
          lookup = Lookup.find_by(unique_id: option_source)
          if sheet_hash[db_field.name].present? && sheet_hash[db_field.name]["lookup"].present?
            @locales.each do |locale|
              new_value = []
              sheet_hash[db_field.name][option_source].each do |lookup_choice_id, lookup_choice_value|
                new_value << {"id" => lookup_choice_id, "display_text" => lookup_choice_value[locale]}
              end
              eval("lookup.lookup_values_#{locale}=new_value")
              lookup.save
            end
          else
          	Rails.logger.warn {"The lookup for #{db_field.name} was not included in the Choices sheet of the #{db_form.unique_id}.xls spreadsheet and was not updated"}
          end
        elsif db_field.option_strings_text.present?
          db_field.option_strings_text.each do |option|
            if sheet_hash[db_field.name].present? && sheet_hash[db_field.name][option['id']].present?
              @locales.each do |locale|
              	new_value = []
                sheet_hash[db_field.name].each do |choice_id, choice_value|
                  new_value << {"id" => choice_id, "display_text" => choice_value[locale]}
                end
                eval("db_field.option_strings_text_#{locale}=#{new_value}")
              end
            else
              Rails.logger.warn {"The choices for #{db_field.name} were not included in the Choices sheet of the #{db_form.unique_id}.xls spreadsheet and were not updated"}
            end
          end
          #NOTE: THIS MAKES IT TAKE FOREVER
          db_form.save
        end
      end
    end

    def update_values_settings(db_form, sheet_hash)
      if sheet_hash[db_form.unique_id].present?
        @locales.each do |locale|
          eval("db_form.name_#{locale}=sheet_hash[db_form.unique_id][locale]")
        end
        db_form.save
      else
      	Rails.logger.warn {"The form_id in the #{db_form.unique_id} Settings sheet of spreadsheet was not included or did not match its unique_id in the database, and so the name was not updated"}
      end
    end

    def create_survey_hash(sheet)
      survey_hash = {}
      heading = sheet.rows[0]
      sheet.rows.each do |row|
        if (row != heading)
          index = 0
          name = nil
          row.each do |column|
            column_type = (heading[index] || "").split("::")
            case column_type[0]
            when "type"
            when "name"
              name = column
              survey_hash[name] = {"label"=>{},"hint"=>{},"guidance"=>{}, "tick_box_label"=>{}}
            when "label"
              survey_hash[name]["label"][column_type[1]] = column
            when "tick_box_label"
              survey_hash[name]["tick_box_label"][column_type[1]] = column
            when "hint"
              survey_hash[name]["hint"][column_type[1]] = column
            when "guidance"
              survey_hash[name]["guidance"][column_type[1]] = column
            end
            index += 1
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
            column_type = (heading[index] || "").split("::")
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
            index += 1
          end
        end
      end
      choices_hash
    end

    def create_settings_hash(sheet)
      settings_hash = {}
      heading = sheet.rows[0]
      sheet.rows.each do |row|
        if (row != heading)
          index = 0
          unique_name = nil
          row.each do |column|
            # Check to see if heading is nil. This happens sometimes.
            column_type = heading[index].nil? ? [] : heading[index].split("::")
            case column_type[0]
            when "form_id"
              unique_name = column
              settings_hash[unique_name] = {}
            when "form_title"
              settings_hash[unique_name][column_type[1]] = column
            end
            index += 1
          end
        end
      end
      settings_hash
    end

  end
end
