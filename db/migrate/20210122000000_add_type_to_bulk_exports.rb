# frozen_string_literal: true

class AddTypeToBulkExports < ActiveRecord::Migration[5.2]
  def change
    add_column :bulk_exports, :type, :string
  end
end
