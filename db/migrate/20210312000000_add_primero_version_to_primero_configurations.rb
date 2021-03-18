# frozen_string_literal: true

class AddPrimeroVersionToPrimeroConfigurations < ActiveRecord::Migration[5.2]
  def change
    add_column :primero_configurations, :primero_version, :string
  end
end
