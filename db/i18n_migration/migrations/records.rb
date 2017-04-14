puts 'Migrating (i81n): Records'

include MigrationHelper

Records = [Child, TracingRequest, Incident];

# TODO: Do some more testing
Records.each do |record_type|
  field_options = MigrationHelper.get_field_options(record_type.locale_prefix)

  record_type.each_slice do |record|
    if record.present?
      current_record = record.first
      current_record.keys.each do |key|
        if field_options[key].present? && field_options[key].is_a?(Hash) && current_record[key].present?
          value = field_options[key].select{|fo| fo['display_text'] == current_record[key]}
          binding.pry
          current_record[key] = value if value.present?
        end
      end
    end
  end
end