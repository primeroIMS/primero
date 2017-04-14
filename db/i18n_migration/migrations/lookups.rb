puts 'Migrating (i81n): Lookups'

include MigrationHelper

# What if repo adds new lookups and user added options
Lookup.all.rows.map {|r| Lookup.database.get(r["id"]) }.each do |lookup|
  if lookup["lookup_values"].present?
    value = MigrationHelper.generate_keyed_value(lookup['lookup_values'])

    MigrationHelper.create_locales do |locale|
      lookup["lookup_values_#{locale}"] = value
    end

    lookup.delete("lookup_values")
  end

  lookup.save
end

