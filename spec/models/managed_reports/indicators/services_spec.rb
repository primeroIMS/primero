# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::Services do
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
        services_section: [
          { unique_id: 'e2229eb0-d610-11f0-97c4-7c10c98b54af', service_type: 'service1' },
          { unique_id: '8042cef0-d614-11f0-b8dd-7c10c98b54af', service_type: 'service2' },
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
        services_section: [
          { unique_id: 'af6e6608-d614-11f0-b0ba-7c10c98b54af', service_type: 'service1' },
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
        services_section: [
          { unique_id: 'c191ecce-d614-11f0-9aa9-7c10c98b54af', service_type: 'service2' },
          { unique_id: 'd117815e-d614-11f0-87ea-7c10c98b54af', service_type: 'service3' },
        ]
      }
    )
  end

  it 'returns data for services indicator' do
    report_data = ManagedReports::Indicators::Services.build(nil, {}).data

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
      report_data = ManagedReports::Indicators::Services.build(
        nil, { 'service_type' => SearchFilters::TextList.new(field_name: 'service_type', values: %w[service1]) }
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
