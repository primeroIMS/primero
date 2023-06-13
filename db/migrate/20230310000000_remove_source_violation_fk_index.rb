# frozen_string_literal: true

class RemoveSourceViolationFkIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :violations, column: :source_id
    remove_foreign_key :violations, to_table: :sources
  end
end
