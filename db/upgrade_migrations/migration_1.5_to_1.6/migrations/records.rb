puts 'Migrating (i18n): Records'

include MigrationHelper

record_classes = [Child, TracingRequest, Incident]

record_classes.each do |record_type|
  puts "------------------------------------------------------------------"
  puts "Migrating #{record_type} records..."
  field_options = MigrationHelper.get_field_options(record_type.locale_prefix)

  record_type.each_slice do |records|
    records_to_save = []
    db_records = records.map {|r| record_type.database.get(r.id) }
    records.each_with_index do |record, rec_index|
      record.each do |k,v|
        #use the value from the datbase if v is blank
        #Sometimes yes/no values can get screwed up by the record model
        v ||= db_records[rec_index][k]
        if v.present? && field_options[k].present?
          if field_options[k].is_a?(Hash)
            v.each_with_index do |sf, index|
              field_options[k].each do |sub_key, sub_options|
                # Get the data from the raw db query...
                # to handle case where field type changed which could cause new model to step all over old data
                # EXAMPLE 'Yes' 'No' now handled as a boolean true/false... old 'Yes' 'No' vales seen as nil by the model
                subform_field_value = db_records[rec_index][k][index][sub_key]
                new_value = MigrationHelper.get_value(subform_field_value, sub_options)
                record[k][index][sub_key] = new_value if new_value.present? || new_value == false
              end
            end
          elsif field_options[k].is_a?(Array)
            options = field_options[k]
            value = MigrationHelper.get_value(v, options)
            record[k] = value if value.present? || value == false
          end
        end
      end

      records_to_save << record 
    end

    if records_to_save.present?
      puts "Updating #{records_to_save.count} records"
      record_type.save_all!(records_to_save)
    end
  end
end