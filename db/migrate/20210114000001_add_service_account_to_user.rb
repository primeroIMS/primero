# frozen_string_literal: true

class AddServiceAccountToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :service_account, :boolean, default: false, null: false
  end
end
