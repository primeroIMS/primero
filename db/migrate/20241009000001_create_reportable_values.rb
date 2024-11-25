# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateReportableValues < ActiveRecord::Migration[6.1]
  def change
    create_table :reportable_values do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string :field_name
      t.string :value
    end

    add_index :reportable_values, :value
  end
end
