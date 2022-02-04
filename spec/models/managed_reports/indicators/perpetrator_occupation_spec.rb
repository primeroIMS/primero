# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorOccupation do
  before do
    clean_data(Incident)

    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_occupation' => 'occupation_1' },
        { 'perpetrator_occupation' => 'occupation_2' }
      ])
    Incident.create!(alleged_perpetrator: [{ 'perpetrator_occupation' => 'occupation_2' }])
    Incident.create!(alleged_perpetrator: [{ 'perpetrator_occupation' => 'occupation_3' }])
    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_occupation' => 'occupation_4' },
        { 'perpetrator_occupation' => 'occupation_4' },
        { 'perpetrator_occupation' => 'occupation_4' }
      ])
  end

  it 'returns the number of incidents grouped by perpetrator_occupation' do
    data = ManagedReports::Indicators::PerpetratorOccupation.build.data

    expect(data).to match_array(
      [
        { 'id' => 'occupation_1', 'total' => 1 },
        { 'id' => 'occupation_2', 'total' => 2 },
        { 'id' => 'occupation_3', 'total' => 1 },
        { 'id' => 'occupation_4', 'total' => 3 }
      ]
    )
  end
end
