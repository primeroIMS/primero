# frozen_string_literal: true

class AddExcludeEmptyRowsToReports < ActiveRecord::Migration[5.2]
  def change
    add_column :reports, :exclude_empty_rows, :boolean, null: false, default: false
  end
end
