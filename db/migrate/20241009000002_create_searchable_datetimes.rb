# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateSearchableDatetimes < ActiveRecord::Migration[6.1]
  def change
    create_table :searchable_datetimes do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string :field_name
      t.datetime :value
    end

    add_index :searchable_datetimes, :value
  end
end
