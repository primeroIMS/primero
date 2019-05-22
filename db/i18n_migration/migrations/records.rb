puts 'Migrating (i18n): Records'

include MigrationHelper

record_classes = [Child, TracingRequest, Incident]

record_classes.each do |record_type|
  puts "------------------------------------------------------------------"
  puts "Migrating #{record_type} records..."
  field_options = MigrationHelper.get_field_options(record_type.locale_prefix)
  #TODO lets just get the select fields first, worry about their options later
  # select_fields = MigrationHelper.get_select_fields(record_type.locale_prefix)
  # select_field_names = select_fields.map(&:name)

  record_type.each_slice do |records|
    records_to_save = []

    records.each do |record|
      record.each do |k,v|
        if v.present? && field_options[k].present?
          if field_options[k].is_a?(Hash)
            v.each_with_index do |sf, index|
              field_options[k].each do |sub_key, sub_options|
                subform_field_value = record[k][index][sub_key]
                new_value = MigrationHelper.get_value(subform_field_value, sub_options)
                record[k][index][sub_key] = new_value if new_value.present?
              end
            end
          elsif field_options[k].is_a?(Array)
            options = field_options[k]
            value = MigrationHelper.get_value(v, options)
            record[k] = value if value.present?
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