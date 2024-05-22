# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddFamilyIdToCases < ActiveRecord::Migration[5.0]
  def change
    add_column :cases, :family_id, :uuid

    add_foreign_key :cases, :families, column: 'family_id'
    add_index :cases, :family_id
  end
end
