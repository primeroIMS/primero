# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddSearchableUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :searchable_booleans, name: 'searchable_booleans_filter_idx'

    add_index :searchable_booleans, %i[field_name record_id record_type value],
              name: 'searchable_booleans_unique_idx', unique: true

    remove_index :searchable_datetimes, name: 'searchable_datetimes_filter_idx'

    add_index :searchable_datetimes, %i[field_name record_id record_type value],
              name: 'searchable_datetimes_unique_idx', unique: true

    remove_index :searchable_numerics, name: 'searchable_numerics_filter_idx'

    add_index :searchable_numerics, %i[field_name record_id record_type value],
              name: 'searchable_numerics_unique_idx', unique: true

    remove_index :searchable_values, name: 'searchable_values_filter_idx'

    add_index :searchable_values, %i[field_name record_id record_type value],
              name: 'searchable_values_unique_idx', unique: true
  end
end
