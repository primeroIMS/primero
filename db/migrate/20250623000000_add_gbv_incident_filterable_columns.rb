# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddGBVIncidentFilterableColumns < ActiveRecord::Migration[6.1]
  def change
    add_column :incidents, :srch_incident_date_derived, :datetime
    add_column :incidents, :srch_gbv_sexual_violence_type, :string
    add_column :incidents, :srch_cp_sexual_violence_type, :string
    add_column :incidents, :srch_owned_by_agency_office, :string
    add_column :incidents, :srch_unaccompanied_separated_status, :string
  end
end
