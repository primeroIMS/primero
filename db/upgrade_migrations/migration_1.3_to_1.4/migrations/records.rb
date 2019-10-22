puts 'Migrating (i81n): Records'

include MigrationHelper

record_classes = [Child, TracingRequest, Incident];

record_classes.each do |record_type|
  field_options = MigrationHelper.get_field_options(record_type.locale_prefix)

  record_type.each_slice do |records|
    records_to_save = []

    records.each do |record|
      record.each do |k,v|
        if v.present? && field_options[k].present? && 
          if field_options[k].is_a?(Hash)
            v.each_with_index do |sf, index|
              field_options[k].each do |sub_key, sub_options|
                subform_field_value = record[k][index][sub_key]
                new_value = MigrationHelper.get_value(subform_field_value, sub_options)
                if new_value.present?
                  record[k][index][sub_key] = new_value
                end
              end
            end
          elsif field_options[k].is_a?(Array)
            options = field_options[k]
            value = MigrationHelper.get_value(v, options)
            if value.present?
              record[k] = value 
            end
          end
        end
      end

      records_to_save << record 
    end
    
    if records_to_save.present?
      record_type.save_all!(records_to_save)
    end
  end
end