# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

puts 'Migrating (i18n): Lookups'

include MigrationHelper

# What if repo adds new lookups and user added options
Lookup.all.rows.map { |r| Lookup.database.get(r['id']) }.each do |lookup|
  if lookup['lookup_values'].present?
    base_value = MigrationHelper.generate_keyed_value(lookup['lookup_values'])

    MigrationHelper.create_locales do |locale|
      lookup["lookup_values_#{locale}"] = if lookup["lookup_values_#{locale}"].present?
                                            MigrationHelper.translate_keyed_value(lookup["lookup_values_#{locale}"], base_value)
                                          else
                                            base_value
                                          end
    end

    lookup.delete('lookup_values')
  end

  lookup.save
end
