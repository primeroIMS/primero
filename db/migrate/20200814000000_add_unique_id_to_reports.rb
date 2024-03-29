# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddUniqueIdToReports < ActiveRecord::Migration[5.2]
  def change
    add_column :reports, :unique_id, :string
    add_column :reports, :disabled, :boolean, null: false, default: false
    add_index :reports, :unique_id, unique: true
  end
end
