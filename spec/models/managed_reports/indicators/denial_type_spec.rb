# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::DenialType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(
      data: { incident_date: Date.new(2021, 5, 23), status: 'open', module_id: PrimeroModule::MRM }
    )
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 4, 4), status: 'open' })
    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: %w[abduction_of_humanitarian_personnel other] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['restrictions_of_beneficiaries_access'] },
      incident_id: incident.id
    )

    incident.build_or_update_violations_and_associations(
      {
        denial_humanitarian_access: [
          {
            denial_method: %w[besiegement theft],
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2021, 9, 5)
          }
        ]
      }.with_indifferent_access
    )
    incident.save!

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['besiegement'] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 } },
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

  describe 'has_late_verified_violations filter' do
    it 'returns the data only for those incidents where the value is true' do
      denial_type_data = ManagedReports::Indicators::DenialType.build(
        nil,
        {
          'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access'),
          'has_late_verified_violations' => SearchFilters::BooleanValue.new(
            field_name: 'has_late_verified_violations', value: true
          )
        }
      ).data

      expect(denial_type_data).to match_array(
        [
          { id: 'theft', total: 1 },
          { id: 'besiegement', total: 2 },
          { id: 'abduction_of_humanitarian_personnel', total: 1 },
          { id: 'restrictions_of_beneficiaries_access', total: 1 },
          { id: 'other', total: 1 }
        ]
      )
    end
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
              from: Date.parse('2021-04-01'),
              to: Date.parse('2022-05-01')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: [
                { id: 'abduction_of_humanitarian_personnel', total: 1 },
                { id: 'besiegement', total: 2 },
                { id: 'other', total: 1 },
                { id: 'restrictions_of_beneficiaries_access', total: 1 },
                { id: 'theft', total: 1 }
              ]
            },
            {
              group_id: 2022,
              data: [
                { id: 'property_damage', total: 2 },
                { id: 'vehicle_hijacking', total: 1 }
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
              from: Date.parse('2021-05-01'),
              to: Date.parse('2022-04-10')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-05',
              data: [
                { id: 'abduction_of_humanitarian_personnel', total: 1 },
                { id: 'besiegement', total: 2 },
                { id: 'other', total: 1 },
                { id: 'restrictions_of_beneficiaries_access', total: 1 },
                { id: 'theft', total: 1 }
              ]
            },
            { data: [], group_id: '2021-06' }, { data: [], group_id: '2021-07' },
            { data: [], group_id: '2021-08' }, { data: [], group_id: '2021-09' },
            { data: [], group_id: '2021-10' }, { data: [], group_id: '2021-11' },
            { data: [], group_id: '2021-12' }, { data: [], group_id: '2022-01' },
            { data: [], group_id: '2022-02' }, { data: [], group_id: '2022-03' },
            {
              group_id: '2022-04',
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
              from: Date.parse('2021-04-01'),
              to: Date.parse('2022-06-10')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-Q2',
              data: [
                { id: 'abduction_of_humanitarian_personnel', total: 1 },
                { id: 'besiegement', total: 2 },
                { id: 'other', total: 1 },
                { id: 'restrictions_of_beneficiaries_access', total: 1 },
                { id: 'theft', total: 1 }
              ]
            },
            { data: [], group_id: '2021-Q3' }, { data: [], group_id: '2021-Q4' },
            { data: [], group_id: '2022-Q1' },
            {
              group_id: '2022-Q2',
              data: [{ id: 'property_damage', total: 2 }, { id: 'vehicle_hijacking', total: 1 }]
            }
          ]
        )
      end
    end
  end
end
