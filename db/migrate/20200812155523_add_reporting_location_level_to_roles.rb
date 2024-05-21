# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddReportingLocationLevelToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :reporting_location_level, :integer
  end
end
