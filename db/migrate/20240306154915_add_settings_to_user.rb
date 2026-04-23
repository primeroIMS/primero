# frozen_string_literal: true

class AddSettingsToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :settings, :jsonb
  end
end
