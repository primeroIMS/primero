# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddPermissionToFormPermission < ActiveRecord::Migration[5.2]
  def change
    add_column :form_sections_roles, :permission, :string, default: 'rw'
    add_column :form_sections_roles, :id, :primary_key
    add_index :form_sections_roles, :id, unique: true
  end
end
