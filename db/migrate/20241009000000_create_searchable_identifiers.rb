# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateSearchableIdentifiers < ActiveRecord::Migration[6.1]
  enable_extension 'pg_trgm' unless ENV['PRIMERO_PG_APP_ROLE'] || extension_enabled?('pg_trgm')

  def change
    create_table :searchable_identifiers do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string 'field_name'
      t.string 'value'
    end

    add_index :searchable_identifiers,
              :value,
              using: :gin,
              opclass: :gin_trgm_ops,
              name: 'searchable_identifiers_value_idx'
  end
end
