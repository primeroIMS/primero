# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddUserForeignKeys < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :users, :agencies, column: 'agency_id'
    add_foreign_key :users, :roles, column: 'role_id'
    add_foreign_key :users, :identity_providers, column: 'identity_provider_id'
  end
end
