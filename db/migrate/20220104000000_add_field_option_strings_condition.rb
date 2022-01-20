# frozen_string_literal: true

class AddFieldOptionStringsCondition < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :option_strings_condition, :jsonb
  end
end
