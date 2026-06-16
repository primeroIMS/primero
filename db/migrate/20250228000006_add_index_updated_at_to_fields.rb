# frozen_string_literal: true

class AddIndexUpdatedAtToFields < ActiveRecord::Migration[6.1]
  def change
    add_index :fields, :updated_at
  end
end
