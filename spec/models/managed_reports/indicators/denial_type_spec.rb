# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::DenialType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.new(2021, 5, 23), status: 'open' })
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 4, 4), status: 'open' })
    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: %w[abduction_of_humanitarian_personnel other] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['restrictions_of_beneficiaries_access'] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: %w[besiegement theft] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['besiegement'] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: {
        type: 'denial_humanitarian_access',
        denial_method: %w[vehicle_hijacking property_damage]
      },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['property_damage'] },
      incident_id: incident1.id
    )
  end

  it 'return data for denial_method indicator' do
    denial_type_data = ManagedReports::Indicators::DenialType.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(denial_type_data).to match_array(
      [
        { id: 'theft', total: 1 },
        { id: 'besiegement', total: 2 },
        { id: 'abduction_of_humanitarian_personnel', total: 1 },
        { id: 'restrictions_of_beneficiaries_access', total: 1 },
        { id: 'property_damage', total: 2 },
        { id: 'vehicle_hijacking', total: 1 },
        { id: 'other', total: 1 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::DenialType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2021-04-01',
              to: '2022-05-01'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: [
                { id: 'other', total: 1 },
                { id: 'besiegement', total: 2 },
                { id: 'abduction_of_humanitarian_personnel', total: 1 },
                { id: 'restrictions_of_beneficiaries_access', total: 1 },
                { id: 'theft', total: 1 }
              ]
            },
            {
              group_id: 2022,
              data: [
                { id: 'vehicle_hijacking', total: 1 },
                { id: 'property_damage', total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::DenialType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 'may-2021',
              data: [
                { id: 'besiegement', total: 2 },
                { id: 'restrictions_of_beneficiaries_access', total: 1 },
                { id: 'theft', total: 1 },
                { id: 'other', total: 1 },
                { id: 'abduction_of_humanitarian_personnel', total: 1 }
              ]
            },
            {
              group_id: 'april-2022',
              data: [
                { id: 'property_damage', total: 2 },
                { id: 'vehicle_hijacking', total: 1 }
              ]
            }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::DenialType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 'q2-2021',
              data: [{ id: 'restrictions_of_beneficiaries_access', total: 1 },
                     { id: 'besiegement', total: 2 },
                     { id: 'theft', total: 1 },
                     { id: 'other', total: 1 },
                     { id: 'abduction_of_humanitarian_personnel', total: 1 }]
            },
            {
              group_id: 'q2-2022',
              data: [{ id: 'property_damage', total: 2 }, { id: 'vehicle_hijacking', total: 1 }]
            }
          ]
        )
      end
    end
  end
end
