# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorRelationship do
  before do
    clean_data(Incident)

    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship1', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship2', 'primary_perpetrator' => 'primary' }
      ])
    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship3', 'primary_perpetrator' => 'primary' }
      ])
    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship2', 'primary_perpetrator' => 'primary' }
      ])
    Incident.create!(alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' }
      ])
  end

  it 'returns the number of incidents grouped by perpetrator_relationship' do
    data = ManagedReports::Indicators::PerpetratorRelationship.build.data

    expect(data).to match_array(
      [
        { 'id' => 'relationship1', 'total' => 1 },
        { 'id' => 'relationship2', 'total' => 2 },
        { 'id' => 'relationship3', 'total' => 1 },
        { 'id' => 'relationship4', 'total' => 3 }
      ]
    )
  end
end
