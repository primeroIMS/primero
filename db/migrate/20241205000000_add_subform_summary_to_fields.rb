# frozen_string_literal: true

class AddSubformSummaryToFields < ActiveRecord::Migration[6.1]
  def change
    add_column :fields, :subform_summary, :jsonb
    add_index :fields, :subform_summary, using: :gin
  end
end
