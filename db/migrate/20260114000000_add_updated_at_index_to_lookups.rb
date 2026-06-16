# frozen_string_literal: true

class AddUpdatedAtIndexToLookups < ActiveRecord::Migration[8.1]
  def change
    add_index :lookups, %i[updated_at]
  end
end
