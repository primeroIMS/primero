# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.
class AddSettingsToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :settings, :jsonb
  end
end
