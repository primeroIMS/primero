puts 'Migrating (i81n): Records'

Records = [Child, TracingRequest, Incident];

# TODO: Do some more testing
Records.each do |record_type|
  field_options = MigrationHelper.get_field_options(record_type.locale_prefix)

  record_type.all.rows.map {|r| record_type.database.get(r["id"]) }.each do |record|
    record.keys.each do |key|
      if field_options[key].present? && field_options[key].is_a?(Object) && record[key].present?
        value = field_options[key].select{|fo| fo['display_name'] == record[key]}
        record[key] = value if value.present?
      end
    end
  end
end