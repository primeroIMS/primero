# frozen_string_literal: true

class AddPermissionToFormPermission < ActiveRecord::Migration[5.2]
  def change
    add_column :form_sections_roles, :permission, :string, default: 'rw'
  end
end
