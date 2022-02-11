# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorAgeGroup do
  before do
    clean_data(Incident)

    Incident.create!(alleged_perpetrator: [{ 'age_group' => '0_11', 'primary_perpetrator' => 'primary' }])
    Incident.create!(alleged_perpetrator:
      [
        { 'age_group' => '12_17', 'primary_perpetrator' => 'primary' },
        { 'age_group' => '18_25', 'primary_perpetrator' => 'primary' }
      ])
    Incident.create!(alleged_perpetrator:
      [
        { 'age_group' => '18_25', 'primary_perpetrator' => 'primary' }
      ])
    Incident.create!(alleged_perpetrator:
      [
        { 'age_group' => '61', 'primary_perpetrator' => 'primary' },
        { 'age_group' => '61', 'primary_perpetrator' => 'primary' }
      ])
  end

  it 'returns the number of incidents grouped by age_group' do
    data = ManagedReports::Indicators::PerpetratorAgeGroup.build.data

    expect(data).to match_array(
      [
        { 'id' => '0_11', 'total' => 1 },
        { 'id' => '12_17', 'total' => 1 },
        { 'id' => '18_25', 'total' => 2 },
        { 'id' => '61', 'total' => 2 }
      ]
    )
  end
end
