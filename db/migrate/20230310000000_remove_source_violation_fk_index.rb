# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class RemoveSourceViolationFkIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :violations, column: :source_id
    remove_foreign_key :violations, to_table: :sources
  end
end
