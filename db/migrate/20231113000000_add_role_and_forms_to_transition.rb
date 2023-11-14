# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddRoleAndFormsToTransition < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :role_id, :integer
    add_foreign_key :transitions, :roles, column: 'role_id'
    add_column :transitions, :form_unique_ids, :string, array: true

    add_index :transitions, :role_id
  end
end
