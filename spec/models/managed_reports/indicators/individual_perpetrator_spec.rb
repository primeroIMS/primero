# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::IndividualPerpetrator do
  before do
    clean_data(Incident, Violation, IndividualVictim, Perpetrator, Lookup)

    incident = Incident.create!(data: { incident_date: Date.new(2021, 5, 23), status: 'open' })

    Lookup.create_or_update!(
      unique_id: 'lookup-perpetrator-category-type',
      name_en: 'Armed Force Group Or Other Party',
      lookup_values: [
        { id: 'armed_force_1', display_text: 'Armed Force 1' },
        { id: 'armed_group_1', display_text: 'Armed Group 1' },
        { id: 'other_party_1', display_text: 'Other Party 1' },
        { id: 'unknown', display_text: 'Unknown' }
      ].map(&:with_indifferent_access)
    )

    violation1 = Violation.create!(
      data: { type: 'killing', ctfmr_verified: 'verified', violation_tally:
          { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 } },
      incident_id: incident.id
    )

    violation1.individual_victims = [
      IndividualVictim.create!(
        data: {
          individual_age: 9,
          entity_responsible_deprivation_liberty: 'armed_force'
        }
      ),

      IndividualVictim.create!(
        data: {
          individual_age: 2,
          entity_responsible_deprivation_liberty: 'unknown'
        }
      )
    ]

    violation1.perpetrators = [Perpetrator.create!(data: { perpetrator_category: 'armed_force_1' })]

    violation2 = Violation.create!(
      data: { type: 'attack_on_schools', violation_tally: { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 } },
      incident_id: incident.id
    )

    violation2.individual_victims = [
      IndividualVictim.create!(
        data: {
          individual_age: 10,
          individual_sex: 'unknown'
        }
      )
    ]

    violation2.perpetrators = [Perpetrator.create!(data: { perpetrator_category: 'armed_force_2' })]
  end

  it 'return data for individual age indicator' do
    data = ManagedReports::Indicators::IndividualPerpetrator.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'incident_date' => SearchFilters::DateRange.new(
          field_name: 'incident_date',
          from: '2021-04-01',
          to: '2022-06-10'
        )
      }
    ).data

    expect(data).to match_array(
      [{ group_id: '2021-Q2', data: [{ id: 'armed_force_1', total: 1 }, { id: 'armed_force_2', total: 1 }] },
       { group_id: '2021-Q3', data: [] },
       { group_id: '2021-Q4', data: [] },
       { group_id: '2022-Q1', data: [] },
       { group_id: '2022-Q2', data: [] }]
    )
  end
end
