# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::MilitaryUse do
  before do
    clean_data(Incident, Violation)

    incident1 = Incident.new_with_user(@self_user, { incident_date: Date.new(2020, 8, 8), status: 'open' })
    incident1.save!
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 8, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 1, 8), status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident4.save!
    incident5 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 3, 28), status: 'open' })
    incident5.save!

    Violation.create!(
      data: { type: 'military_use', military_use_type: 'military_use_of_school' },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'military_use', military_use_type: 'military_use_of_school' },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'military_use', military_use_type: 'military_use_of_hospital' },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'military_use', military_use_type: 'military_use_of_school' },
      incident_id: incident3.id
    )

    Violation.create!(
      data: { type: 'military_use', military_use_type: 'military_use_of_hospital' },
      incident_id: incident4.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident5.id
    )
  end

  it 'return data for military_use indicator' do
    military_use_data = ManagedReports::Indicators::MilitaryUse.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'military_use') }
    ).data

    expect(military_use_data).to match_array(
      [
        { id: 'military_use_of_hospital', total: 2 },
        { id: 'military_use_of_school', total: 3 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::MilitaryUse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'military_use')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { id: 'military_use_of_school', total: 1 }
              ]
            },
            {
              group_id: 2021,
              data: [
                { id: 'military_use_of_hospital', total: 1 },
                { id: 'military_use_of_school', total: 1 }
              ]
            },
            {
              group_id: 2022,
              data: [
                { id: 'military_use_of_hospital', total: 1 },
                { id: 'military_use_of_school', total: 1 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::MilitaryUse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-02-28'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'military_use')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [{ id: 'military_use_of_school', total: 1 }] },
            { group_id: '2020-09', data: [] },
            { group_id: '2020-10', data: [] },
            { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] },
            { group_id: '2021-01', data: [] },
            { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] },
            { group_id: '2021-04', data: [] },
            { group_id: '2021-05', data: [] },
            { group_id: '2021-06', data: [] },
            { group_id: '2021-07', data: [] },
            {
              group_id: '2021-08',
              data: [
                { id: 'military_use_of_hospital', total: 1 },
                { id: 'military_use_of_school', total: 1 }
              ]
            },
            { group_id: '2021-09', data: [] },
            { group_id: '2021-10', data: [] },
            { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] },
            { group_id: '2022-01', data: [{ id: 'military_use_of_school', total: 1 }] },
            { group_id: '2022-02', data: [{ id: 'military_use_of_hospital', total: 1 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::MilitaryUse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'military_use')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [{ id: 'military_use_of_school', total: 1 }] },
            { group_id: '2020-Q4', data: [] },
            { group_id: '2021-Q1', data: [] },
            { group_id: '2021-Q2', data: [] },
            {
              group_id: '2021-Q3',
              data: [
                { id: 'military_use_of_hospital', total: 1 },
                { id: 'military_use_of_school', total: 1 }
              ]
            },
            { group_id: '2021-Q4', data: [] },
            {
              group_id: '2022-Q1',
              data: [
                { id: 'military_use_of_hospital', total: 1 },
                { id: 'military_use_of_school', total: 1 }
              ]
            }
          ]
        )
      end
    end
  end
end
