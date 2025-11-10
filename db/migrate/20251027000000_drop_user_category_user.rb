# frozen_string_literal: true

class DropUserCategoryUser < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :user_category, :string
  end
end
