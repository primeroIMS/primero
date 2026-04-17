# frozen_string_literal: true

class AddRoleToTransition < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :authorized_role_unique_id, :string
    add_index :transitions, :authorized_role_unique_id
  end
end
