# frozen_string_literal: true

class AddCaseIdIndex < ActiveRecord::Migration[6.1]
  def change
    add_index :cases, "(data->>'case_id')", name: 'cases_on_case_id', using: 'btree'
  end
end
