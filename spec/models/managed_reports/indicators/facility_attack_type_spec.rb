# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::FacilityAttackType do
  before do
    clean_data(Incident, Violation)

    incident1 = Incident.new_with_user(
      @self_user,
      {
        incident_date: Date.new(2020, 8, 8),
        status: 'open',
        module_id: PrimeroModule::MRM,
        attack_on_hospitals: [
          {
            facility_attack_type: %w[attack_on_education_personnel other_interference_with_education],
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2020, 11, 5)
          }
        ]
      }.with_indifferent_access
    )
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
      data: { type: 'attack_on_hospitals', facility_attack_type: ['attack_on_school_s'] },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', facility_attack_type: ['attack_on_school_s'] },
      incident_id: incident2.id
    )

    Violation.create!(
      data: {
        type: 'attack_on_hospitals',
        facility_attack_type: %w[threat_of_attack_on_school_s attack_on_education_personnel]
      },
      incident_id: incident3.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', facility_attack_type: ['threat_of_attack_on_school_s'] },
      incident_id: incident4.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 } },
      incident_id: incident5.id
    )
  end

  it 'return data for incident attack on indicator' do
    facility_attack_type_data = ManagedReports::Indicators::FacilityAttackType.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_hospitals') }
    ).data

    expect(facility_attack_type_data).to match_array(
      [
        { id: 'attack_on_education_personnel', total: 2 },
        { id: 'attack_on_school_s', total: 2 },
        { id: 'other_interference_with_education', total: 1 },
        { id: 'threat_of_attack_on_school_s', total: 2 }
      ]
    )
  end

  describe 'has_late_verified_violations filter' do
    it 'returns the data only for those incidents where the value is true' do
      facility_attack_type_data = ManagedReports::Indicators::FacilityAttackType.build(
        nil,
        {
          'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_hospitals'),
          'has_late_verified_violations' => SearchFilters::BooleanValue.new(
            field_name: 'has_late_verified_violations', value: true
          )
        }
      ).data

      expect(facility_attack_type_data).to match_array(
        [
          { id: 'attack_on_education_personnel', total: 1 },
          { id: 'other_interference_with_education', total: 1 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::FacilityAttackType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-10-10')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_hospitals')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'other_interference_with_education', total: 1 }
              ]
            },
            { group_id: 2021, data: [{ id: 'attack_on_school_s', total: 2 }] },
            {
              group_id: 2022,
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'threat_of_attack_on_school_s', total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::FacilityAttackType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-03-30')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_hospitals')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-08',
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'other_interference_with_education', total: 1 }
              ]
            },
            { group_id: '2020-09', data: [] }, { group_id: '2020-10', data: [] }, { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] }, { group_id: '2021-01', data: [] }, { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] }, { group_id: '2021-04', data: [] }, { group_id: '2021-05', data: [] },
            { group_id: '2021-06', data: [] }, { group_id: '2021-07', data: [] },
            { group_id: '2021-08', data: [{ id: 'attack_on_school_s', total: 2 }] },
            { group_id: '2021-09', data: [] }, { group_id: '2021-10', data: [] }, { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] },
            {
              group_id: '2022-01',
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'threat_of_attack_on_school_s', total: 1 }
              ]
            },
            { group_id: '2022-02', data: [{ id: 'threat_of_attack_on_school_s', total: 1 }] },
            { group_id: '2022-03', data: [] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::FacilityAttackType.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-03-30')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'attack_on_hospitals')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-Q3',
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'other_interference_with_education', total: 1 }
              ]
            },
            { group_id: '2020-Q4', data: [] }, { group_id: '2021-Q1', data: [] },
            { group_id: '2021-Q2', data: [] },
            { group_id: '2021-Q3', data: [{ id: 'attack_on_school_s', total: 2 }] },
            { group_id: '2021-Q4', data: [] },
            {
              group_id: '2022-Q1',
              data: [
                { id: 'attack_on_education_personnel', total: 1 },
                { id: 'threat_of_attack_on_school_s', total: 2 }
              ]
            }
          ]
        )
      end
    end
  end
end
