# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateSearchableIdentifiers < ActiveRecord::Migration[6.1]
  def change
    create_table :searchable_identifiers do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string 'field_name'
      t.string 'value'
    end

    add_index :searchable_identifiers,
              %i[record_type record_id field_name],
              unique: true,
              name: 'searchable_identifiers_unique_idx'
  end
end
