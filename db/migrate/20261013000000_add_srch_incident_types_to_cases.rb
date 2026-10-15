# frozen_string_literal: true

class AddSrchIncidentTypesToCases < ActiveRecord::Migration[8.1]
  def change
    add_column :cases, :srch_incident_types, :string, array: true, default: []
  end
end
