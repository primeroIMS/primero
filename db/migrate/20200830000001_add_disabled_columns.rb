# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddDisabledColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :disabled, :boolean, null: false, default: false
    add_column :user_groups, :disabled, :boolean, null: false, default: false
  end
end
