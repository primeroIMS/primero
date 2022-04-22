# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::IncidentAttackOn do
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
      data: { type: 'attack_on_schools', denial_method: %w[abduction_of_humanitarian_personnel other] },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', denial_method: ['restrictions_of_beneficiaries_access'] },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', denial_method: ['restrictions_of_beneficiaries_access'] },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', denial_method: %w[besiegement theft] },
      incident_id: incident3.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', denial_method: ['besiegement'] },
      incident_id: incident4.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident5.id
    )
  end

  it 'return data for incident attack on indicator' do
    denial_type_data = ManagedReports::Indicators::IncidentAttackOn.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_schools') }
    ).data

    expect(denial_type_data[0][:total]).to eq(5)
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::IncidentAttackOn.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_schools')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { id: 'violation', total: 1 }
              ]
            },
            {
              group_id: 2021,
              data: [{ id: 'violation', total: 2 }]
            },
            {
              group_id: 2022,
              data: [
                { id: 'violation', total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::IncidentAttackOn.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_schools')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 'august-2020', data: [{ id: 'violation', total: 1 }] },
            { group_id: 'august-2021', data: [{ id: 'violation', total: 2 }] },
            { group_id: 'january-2022', data: [{ id: 'violation', total: 1 }] },
            { group_id: 'february-2022', data: [{ id: 'violation', total: 1 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::IncidentAttackOn.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_schools')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 'q1-2022', data: [{ id: 'violation', total: 2 }] },
            { group_id: 'q3-2020', data: [{ id: 'violation', total: 1 }] },
            { group_id: 'q3-2021', data: [{ id: 'violation', total: 2 }] }
          ]
        )
      end
    end
  end
end
