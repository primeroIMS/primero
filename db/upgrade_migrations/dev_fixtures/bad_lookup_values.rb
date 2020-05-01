#This script will search through records and report on fields that use a lookup but have a value not in that lookup's options
#Goal: Keep this simple enough to run in the old pre-migrated system (ex. 1.3)
#Much of this was based on migration_helper.rb in the migrations below
#TODO determine if we can re-use migration helper.  There are some tweaks here...


#Only get the fields that potentially use lookups
def get_fields(form_section)
  field_types = ['select_box', 'tick_box', 'radio_button', 'subform']
  form_section.fields.select{|f| field_types.include?(f.type) || f.is_location? }
end

def get_option_list(field, locations)
  #Get the English translated options since old versions weren't i18n yet
  field.options_list(nil, nil, locations, true, {locale: Primero::Application::LOCALE_ENGLISH})
end


def get_lookup_fields(record_type, locations)
  lookup_fields = {}
  record_type = 'case' if record_type == 'child'
  FormSection.find_by_parent_form(record_type).each do |fs|
    fields = get_fields(fs)
    fields.each do |field|
      if field.subform_section.present?
        lookup_fields[field.name] = {} if lookup_fields[field.name].blank?
        lookup_fields[field.name][:is_subform] = true
        sub_fields = get_fields(field.subform_section)
        sub_fields.each do |sf|
          sub_options = get_option_list(sf, locations)
          if sub_options.present?
            field_hash = {}
            field_hash[:lookup] = sf.option_strings_source
            field_hash[:options] = sub_options unless sf.option_strings_source == 'Location'
            lookup_fields[field.name][sf.name] = field_hash
          end
        end
      else
        options = get_option_list(field, locations)
        if options.present?
          field_hash = {}
          field_hash[:lookup] = field.option_strings_source
          field_hash[:options] = options unless field.option_strings_source == 'Location'
          lookup_fields[field.name] = field_hash
        end
      end
    end
  end
  lookup_fields
end

def get_value(value, options)
  if value.present? && options.present?
    if value.is_a?(Array)
      #look for value iin either the ids or in the display text
      #If it has already been converted, it should be in one of the id's
      #If it hasn't yet been converted, it should be in one of the display_text
      values = value.map{|val| val.to_s.strip}
      v = options.select{|o| values.include?(o['id']) || values.include?(o['display_text'].strip)}.map{|option| option['id']}.uniq
    else
      value = value.gsub(/_[0-9]{5}+$/, "") if value.is_a?(String)
      #The to_s is necessary to catch cases where the value is true or false
      v = options.select{|option| option['id'] == value.to_s.strip || option['display_text'].strip == value.to_s.strip || option['display_text'].strip == value.to_s.capitalize.strip}.first.try(:[], 'id')
      if v == 'true'
        v = true
      elsif v == 'false'
        v = false
      end
      v
    end
  end
end


#####################
# Beginning of script
#####################
locations = Location.all_names

record_classes = [Child, TracingRequest, Incident]
record_classes.each do |record_type|
  puts "------------------------------------------------------------------"
  puts "Searching #{record_type} records..."
  puts "------------------------------------------------------------------"

  lookup_fields = get_lookup_fields(record_type.locale_prefix, locations)

  record_type.each_slice do |records|
    db_records = records.map {|r| record_type.database.get(r.id) }
    records.each_with_index do |record, rec_index|
      record.each do |k,v|
        #use the value from the datbase if v is blank
        #Sometimes yes/no values can get screwed up by the record model
        v ||= db_records[rec_index][k]
        if v.present? && lookup_fields[k].present?
          if lookup_fields[k][:is_subform].present?
            v.each_with_index do |sf, index|
              lookup_fields[k].each do |sub_key, sub_value|
                next unless sub_value.is_a?(Hash)
                # Get the data from the raw db query...
                # to handle case where field type changed which could cause new model to step all over old data
                # EXAMPLE 'Yes' 'No' now handled as a boolean true/false... old 'Yes' 'No' vales seen as nil by the model
                subform_field_value = db_records[rec_index][k][index][sub_key]
                next if subform_field_value.blank?
                sub_options = sub_value[:lookup] == 'Location' ? locations : sub_value[:options]
                new_value = get_value(subform_field_value, sub_options)

                if new_value.blank? && new_value != false
                  if sub_value[:lookup].present?
                    puts "#{record.display_id}   SUBFORM: #{k}  INDEX: #{index}  FIELD: #{sub_key}   VALUE: #{subform_field_value}   LOOKUP: #{sub_value[:lookup]}"
                  else
                    puts "#{record.display_id}   SUBFORM: #{k}  INDEX: #{index}  FIELD: #{sub_key}   VALUE: #{subform_field_value}   OPTIONS: #{sub_value[:options]}"
                  end
                  puts '------'
                end
                # record[k][index][sub_key] = new_value if new_value.present? || new_value == false
              end
            end
          elsif lookup_fields[k][:options].is_a?(Array)
            next if lookup_fields[k][:lookup] == 'User'
            options = lookup_fields[k][:lookup] == 'Location' ? locations : lookup_fields[k][:options]
            value = get_value(v, options)

            if value.blank? && value != false
              if lookup_fields[k][:lookup].present?
                puts "#{record.display_id}   FIELD: #{k}   VALUE: #{v}   LOOKUP: #{lookup_fields[k][:lookup]}"
              else
                puts "#{record.display_id}   FIELD: #{k}   VALUE: #{v}   OPTIONS: #{lookup_fields[k][:options]}"
              end
              puts '------'
            end
          end
        end
      end
    end
  end
end

