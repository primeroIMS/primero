# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddConfigurationFileVersionToSystemSettings < ActiveRecord::Migration[5.2]
  def change
    add_column :system_settings, :configuration_file_version, :string
  end
end
