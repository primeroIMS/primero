# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddPrimeroVersionToPrimeroConfigurations < ActiveRecord::Migration[5.2]
  def change
    add_column :primero_configurations, :primero_version, :string
  end
end
