# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateSearchableBooleans < ActiveRecord::Migration[6.1]
  def change
    create_table :searchable_booleans do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string :field_name
      t.boolean :value
    end
  end
end
