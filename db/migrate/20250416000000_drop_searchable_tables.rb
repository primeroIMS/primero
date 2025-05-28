# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class DropSearchableTables < ActiveRecord::Migration[6.1]
  def change
    drop_table :searchable_values
    drop_table :searchable_datetimes
    drop_table :searchable_booleans
    drop_table :searchable_numerics
  end
end
