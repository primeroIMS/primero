# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::CaseSourceIdentificationReferral do
  let(:child1) do
    Child.create!(
      data: { age: 8, sex: 'male', registration_date: '2021-10-05', source_identification_referral: 'source_1' }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        age: 2,
        sex: 'male',
        registration_date: '2021-11-18',
        source_identification_referral: 'source_2',
        protection_concerns: %w[concern_1]
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        age: 3,
        sex: 'female',
        registration_date: '2022-01-05',
        source_identification_referral: 'source_3',
        protection_concerns: %w[concern_1]
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: { age: 11, sex: 'female', registration_date: '2022-02-01', source_identification_referral: 'source_1' }
    )
  end

  before do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child)
    child1
    child2
    child3
    child4
  end

  after do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child)
  end

  it 'returns data for case_source_identification_referral indicator' do
    report_data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'source_1', female: 1, male: 1, total: 2 },
        { id: 'source_2', male: 1, total: 1 },
        { id: 'source_3', female: 1, total: 1 }
      ]
    )
  end

  context 'when sex is null' do
    before do
      Child.create!(
        id: '78360f14-95a6-11f0-aa51-7c10c98b54af',
        data: {
          registration_date: '2021-11-07',
          age: 8,
          status: 'open',
          source_identification_referral: 'source_4'
        }
      )
    end

    after do
      Child.find_by(id: '78360f14-95a6-11f0-aa51-7c10c98b54af').destroy!
    end

    it 'returns incomplete_data for null sex' do
      report_data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'source_1', female: 1, male: 1, total: 2 },
          { id: 'source_2', male: 1, total: 1 },
          { id: 'source_3', female: 1, total: 1 },
          { id: 'source_4', incomplete_data: 1, total: 1 }
        ]
      )
    end
  end

  context 'when filtered by age range and protection concerns' do
    it 'returns data for the applied filters' do
      report_data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(
        nil,
        {
          'age' => SearchFilters::NumericRange.new(field_name: 'age', from: 0, to: 5),
          'protection_concerns' => SearchFilters::TextList.new(field_name: 'protection_concerns', values: %w[concern_1])
        }
      ).data

      expect(report_data).to match_array(
        [
          { id: 'source_2', male: 1, total: 1 },
          { id: 'source_3', female: 1, total: 1 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-01-01',
              to: '2021-12-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: match_array(
                [
                  { id: 'source_1', male: 1, total: 1 },
                  { id: 'source_2', male: 1, total: 1 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-11-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: match_array([{ id: 'source_1', male: 1, total: 1 }])
            },
            {
              group_id: '2021-11',
              data: match_array([{ id: 'source_2', male: 1, total: 1 }])
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::CaseSourceIdentificationReferral.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-10-16'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-09-26 - 2021-10-02',
              data: []
            },
            {
              group_id: '2021-10-03 - 2021-10-09',
              data: match_array([{ id: 'source_1', male: 1, total: 1 }])
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: []
            }
          ]
        )
      end
    end
  end
end
