# frozen_string_literal: true

class AddFieldDisplayConditions < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :display_conditions_record, :jsonb
    add_column :fields, :display_conditions_subform, :jsonb
  end
end
