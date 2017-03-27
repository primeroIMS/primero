include MigrationHelper

puts 'Migrating (i81n): Lookups'

Lookup.all.rows.map {|r| Lookup.database.get(r["id"]) }.each do |lookup|
  if lookup["lookup_values"].present?
    value = MigrationHelper.generate_keyed_value(lookup['lookup_values'])

    Primero::Application::locales.each do |locale|
      lookup["lookup_values_#{locale}"] = value
    end
  end

  lookup.save
end

