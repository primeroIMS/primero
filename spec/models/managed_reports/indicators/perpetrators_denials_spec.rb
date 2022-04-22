# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorsDenials do
  before do
    clean_data(Incident, Violation, Perpetrator)

    incident = Incident.create!(data: { incident_date: Date.new(2020, 8, 8), status: 'open' })
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 5, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident3.save!

    violation1 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'arson' }, incident_id: incident.id
    )
    violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation2 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'aerial_attack' }, incident_id: incident2.id
    )
    violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident2.id)
    violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_3' })]

    violation4 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'arson' }, incident_id: incident3.id
    )
    violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_4' })]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::PerpetratorsDenials.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(perpetrators_data).to match_array(
      [
        { id: 'armed_force_2', total: 2 },
        { id: 'armed_force_4', total: 1 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PerpetratorsDenials.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
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
            { group_id: 2020, data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: 2021, data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: 2022, data: [{ id: 'armed_force_4', total: 1 }] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PerpetratorsDenials.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-02-28'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: '2020-09', data: [] },
            { group_id: '2020-10', data: [] },
            { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] },
            { group_id: '2021-01', data: [] },
            { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] },
            { group_id: '2021-04', data: [] },
            { group_id: '2021-05', data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: '2021-06', data: [] },
            { group_id: '2021-07', data: [] },
            { group_id: '2021-08', data: [] },
            { group_id: '2021-09', data: [] },
            { group_id: '2021-10', data: [] },
            { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] },
            { group_id: '2022-01', data: [] },
            { group_id: '2022-02', data: [{ id: 'armed_force_4', total: 1 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::PerpetratorsDenials.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: '2020-Q4', data: [] },
            { group_id: '2021-Q1', data: [] },
            { group_id: '2021-Q2', data: [{ id: 'armed_force_2', total: 1 }] },
            { group_id: '2021-Q3', data: [] },
            { group_id: '2021-Q4', data: [] },
            { group_id: '2022-Q1', data: [{ id: 'armed_force_4', total: 1 }] }
          ]
        )
      end
    end
  end
end
