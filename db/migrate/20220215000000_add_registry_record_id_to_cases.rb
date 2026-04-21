# frozen_string_literal: true

class AddRegistryRecordIdToCases < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :registry_record_id, :uuid

    add_index :cases, :registry_record_id
  end
end
