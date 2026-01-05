# frozen_string_literal: true

class AddUserCategoryAndFlags < ActiveRecord::Migration[6.1]
  def change
    add_column :roles, :user_category, :string
    add_column :users, :self_registered, :boolean, default: false
    add_column :users, :duplicate, :boolean, default: false
  end
end
