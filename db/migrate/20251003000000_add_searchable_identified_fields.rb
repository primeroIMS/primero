# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

class AddSearchableIdentifiedFields < ActiveRecord::Migration[5.0]
  def change
    add_column :cases, :srch_identified_by, :string
    add_column :cases, :srch_identified_by_full_name, :string
    add_column :cases, :srch_identified_at, :datetime

    add_index :cases, :srch_identified_by
    add_index :cases, :srch_identified_at
  end
end
