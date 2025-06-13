# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateCaseRelationships < ActiveRecord::Migration[6.1]
  def change
    create_table :case_relationships, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.uuid :from_case_id
      t.uuid :to_case_id
      t.string :relationship_type
      t.boolean :disabled, default: false, null: false
      t.boolean :primary, default: false, null: false
      t.foreign_key :cases, column: :from_case_id
      t.foreign_key :cases, column: :to_case_id

      t.timestamps
    end

    add_index :case_relationships, :from_case_id
    add_index :case_relationships, :to_case_id
    add_index :case_relationships, %i[from_case_id to_case_id], unique: true
  end
end

