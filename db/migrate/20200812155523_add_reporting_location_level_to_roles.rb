# frozen_string_literal: true

class AddReportingLocationLevelToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :reporting_location_level, :integer
  end
end
