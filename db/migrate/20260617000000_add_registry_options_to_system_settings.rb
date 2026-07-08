# frozen_string_literal: true

class AddRegistryOptionsToSystemSettings < ActiveRecord::Migration[8.1]
  def change
    add_column :system_settings, :registry_type_default, :string
    add_column :system_settings, :registry_options, :jsonb
  end
end
