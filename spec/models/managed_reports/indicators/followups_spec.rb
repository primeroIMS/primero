# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::Followups do
  before do
    clean_data(Child)

    SystemSettings.stub(:primary_age_ranges).and_return([0..5, 6..11, 12..17, 18..AgeRange::MAX])
  end

  let!(:case1) do
    Child.create!(
      {
        registration_date: Date.new(2022, 3, 10),
        sex: 'female',
        age: 5,
        followup_subform_section: [
          { unique_id: '8219faf8-d61b-11f0-974a-7c10c98b54af', followup_type: 'type1' },
          { unique_id: '863743de-d61b-11f0-8530-7c10c98b54af', followup_type: 'type2' },
        ]
      }
    )
  end

  let!(:case2) do
    Child.create!(
      {
        registration_date: Date.new(2023, 4, 18),
        sex: 'male',
        age: 10,
        followup_subform_section: [
          { unique_id: '86eb8c86-d61b-11f0-b0e6-7c10c98b54af', followup_type: 'type1' },
        ]
      }
    )
  end

  let!(:case3) do
    Child.create!(
      {
        registration_date: Date.new(2023, 4, 25),
        sex: 'male',
        age: 10,
        followup_subform_section: [
          { unique_id: '87aa54ae-d61b-11f0-9125-7c10c98b54af', followup_type: 'type2' },
          { unique_id: '884ce598-d61b-11f0-83ce-7c10c98b54af', followup_type: 'type3' },
        ]
      }
    )
  end

  it 'returns data for followups indicator' do
    report_data = ManagedReports::Indicators::Followups.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'female', '0 - 5': 2, total: 2 },
        { id: 'male', '6 - 11': 3,  total: 3 },
        { id: 'total', '0 - 5': 2, '6 - 11': 3, total: 5 }
      ]
    )
  end


  describe 'filters' do
    it 'returns data for specified service' do
      report_data = ManagedReports::Indicators::Followups.build(
        nil, { 'followup_type' => SearchFilters::TextList.new(field_name: 'followup_type', values: %w[type1]) }
      ).data

      expect(report_data).to match_array(
        [
          { id: 'female', '0 - 5': 1, total: 1 },
          { id: 'male', '6 - 11': 1, total: 1 },
          { id: 'total', '0 - 5': 1, '6 - 11': 1, total: 2 }
        ]
      )
    end
  end
end
