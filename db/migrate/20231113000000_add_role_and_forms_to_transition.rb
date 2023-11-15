# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddRoleAndFormsToTransition < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :authorized_role_unique_id, :string
    add_column :transitions, :authorized_form_permissions, :jsonb

    add_index :transitions, :authorized_role_unique_id
  end
end
