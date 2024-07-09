# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateThemes < ActiveRecord::Migration[6.1]
  def change
    create_table :themes do |t|
      t.jsonb 'data', default: {}
      t.boolean :disabled, default: false, null: false

      t.timestamps
    end

    add_index :themes, :data, using: :gin
  end
end
