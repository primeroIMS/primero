# frozen_string_literal: true

class ReplaceSrchCpSexualViolenceTypeOnIncidents < ActiveRecord::Migration[8.1]
  def change
    remove_column :incidents, :srch_cp_sexual_violence_type, :string
    add_column :incidents, :srch_cp_incident_violence_type, :string
  end
end
