# frozen_string_literal: true

class AddIncidentReportingLocationConfig < ActiveRecord::Migration[6.1]
  def change
    add_column :system_settings, :incident_reporting_location_config, :jsonb
  end
end
