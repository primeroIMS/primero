# frozen_string_literal: true

class AddFieldDisplayConditions < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :display_conditions, :jsonb
    add_column :fields, :parent_display_conditions, :jsonb
  end
end
