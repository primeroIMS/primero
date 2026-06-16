# frozen_string_literal: true

class AddConfigurationFileVersionToSystemSettings < ActiveRecord::Migration[5.2]
  def change
    add_column :system_settings, :configuration_file_version, :string
  end
end
