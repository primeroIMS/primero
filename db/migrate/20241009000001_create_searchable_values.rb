# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateSearchableValues < ActiveRecord::Migration[6.1]
  def change
    create_table :searchable_values do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string :field_name
      t.string :value
    end

    add_index :searchable_values, %i[field_name record_id record_type value], name: 'searchable_values_filter_idx'
  end
end
