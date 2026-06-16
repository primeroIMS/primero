# frozen_string_literal: true

class AddUserForeignKeys < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :users, :agencies, column: 'agency_id'
    add_foreign_key :users, :roles, column: 'role_id'
    add_foreign_key :users, :identity_providers, column: 'identity_provider_id'
  end
end
