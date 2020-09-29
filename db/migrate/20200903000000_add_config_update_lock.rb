# frozen_string_literal: true

class AddConfigUpdateLock < ActiveRecord::Migration[5.2]
  def change
    add_column :system_settings, :config_update_lock, :boolean, null: false, default: false
  end
end
