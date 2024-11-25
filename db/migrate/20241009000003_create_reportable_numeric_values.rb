# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class CreateReportableNumericValues < ActiveRecord::Migration[6.1]
  def change
    create_table :reportable_numeric_values do |t|
      t.references :record, polymorphic: true, type: :uuid
      t.string :field_name
      t.integer :value
    end

    add_index :reportable_numeric_values, :value
  end
end
