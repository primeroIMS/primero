# frozen_string_literal: true

class AddCollapseToFields < ActiveRecord::Migration[6.1]
  def change
    add_column :fields, :collapse, :string
  end
end
