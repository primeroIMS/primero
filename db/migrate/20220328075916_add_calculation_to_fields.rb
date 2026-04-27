# frozen_string_literal: true

class AddCalculationToFields < ActiveRecord::Migration[6.1]
  def change
    add_column :fields, :calculation, :jsonb
  end
end
