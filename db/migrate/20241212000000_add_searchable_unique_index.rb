# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddSearchableUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    add_index :searchable_booleans, %i[field_name record_id record_type value],
              name: 'searchable_booleans_unique_idx', unique: true

    add_index :searchable_datetimes, %i[field_name record_id record_type value],
              name: 'searchable_datetimes_unique_idx', unique: true

    add_index :searchable_numerics, %i[field_name record_id record_type value],
              name: 'searchable_numerics_unique_idx', unique: true

    add_index :searchable_values, %i[field_name record_id record_type value],
              name: 'searchable_values_unique_idx', unique: true
  end
end
