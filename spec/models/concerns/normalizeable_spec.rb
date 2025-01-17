# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Normalizeable do
  before do
    clean_data(
      SearchableBoolean, SearchableDatetime, SearchableNumeric, SearchableValue, Child
    )
    allow(SystemSettings).to receive(:current).and_return(SystemSettings.new)
  end

  describe 'searchable_booleans' do
    let(:child) { Child.create!(data: { record_state: true }) }
    before { child }

    it 'creates a searchable boolean for record_state' do
      booleans = SearchableBoolean.where(record_id: child.id, record_type: Child.name, field_name: 'record_state')
      expect(booleans.size).to eq(1)
      expect(booleans.first.value).to eq(true)
    end

    it 'updates a searchable boolean' do
      child.record_state = false
      child.save!

      booleans = SearchableBoolean.where(record_id: child.id, record_type: Child.name, field_name: 'record_state')
      expect(booleans.size).to eq(1)
      expect(booleans.first.value).to eq(false)
    end
  end

  describe 'searchable_values' do
    let(:child) { Child.create!(data: { sex: 'female' }) }
    before { child }

    it 'creates a searchable value for sex' do
      values = SearchableValue.where(record_id: child.id, record_type: Child.name, field_name: 'sex')
      expect(values.size).to eq(1)
      expect(values.first.value).to eq('female')
    end

    it 'updates a searchable value' do
      child.sex = nil
      child.save!

      booleans = SearchableValue.where(record_id: child.id, record_type: Child.name, field_name: 'sex')
      expect(booleans.size).to eq(1)
      expect(booleans.first.value).to be_nil
    end
  end

  describe 'searchable_numerics' do
    let(:child) { Child.create!(data: { age: 5 }) }
    before { child }

    it 'creates a searchable numeric for age' do
      numerics = SearchableNumeric.where(record_id: child.id, record_type: Child.name, field_name: 'age')
      expect(numerics.size).to eq(1)
      expect(numerics.first.value).to eq(5)
    end

    it 'updates a searchable numeric for age' do
      child.age = 8
      child.save!

      numerics = SearchableNumeric.where(record_id: child.id, record_type: Child.name, field_name: 'age')
      expect(numerics.size).to eq(1)
      expect(numerics.first.value).to eq(8)
    end
  end

  describe 'searchable_datetimes' do
    let(:child) do
      Child.create!(
        data: {
          services_section: [
            {
              unique_id: 'de9eba6a-b7dc-11ef-a44d-18c04db5c362',
              service_response_day_time: '2012-12-01T08:48:01.000Z',
              service_response_timeframe: '1_day'
            },
            {
              unique_id: 'f23b85ee-b7dc-11ef-8870-18c04db5c362',
              service_response_day_time: '2022-01-10T07:20:05.000Z',
              service_response_timeframe: '5_day'
            }
          ]
        }
      )
    end

    before { child }

    it 'creates a searchable datetime for each value in service_due_dates' do
      values = SearchableDatetime.where(record_id: child.id, record_type: Child.name, field_name: 'service_due_dates')

      expect(values.size).to eq(2)
      expect(values.map(&:value)).to match_array(
        [Time.zone.parse('2012-12-02T08:48:01.000Z'), Time.zone.parse('2022-01-15T07:20:05.000Z')]
      )
    end

    it 'removes the searchable datetime for the missing value in service_due_dates' do
      child.services_section = [
        {
          'unique_id' => 'de9eba6a-b7dc-11ef-a44d-18c04db5c362',
          'service_response_day_time' => Time.zone.parse('2012-12-01T08:48:01.000Z'),
          'service_response_timeframe' => '1_day',
          'service_implemented' => 'implemented'
        },
        {
          'unique_id' => 'f23b85ee-b7dc-11ef-8870-18c04db5c362',
          'service_response_day_time' => Time.zone.parse('2022-01-10T07:20:05.000Z'),
          'service_response_timeframe' => '5_day'
        }
      ]
      child.save!

      values = SearchableDatetime.where(record_id: child.id, record_type: Child.name, field_name: 'service_due_dates')
      expect(values.size).to eq(1)
      expect(values.map(&:value)).to match_array([Time.zone.parse('2022-01-15T07:20:05.000Z')])
    end

    it 'does not create duplicates' do
      child.services_section = [
        {
          'unique_id' => 'de9eba6a-b7dc-11ef-a44d-18c04db5c362',
          'service_response_day_time' => Time.zone.parse('2012-12-01T08:48:01.000Z'),
          'service_response_timeframe' => '1_day'
        },
        {
          'unique_id' => 'f23b85ee-b7dc-11ef-8870-18c04db5c362',
          'service_response_day_time' => Time.zone.parse('2022-01-10T07:20:05.000Z'),
          'service_response_timeframe' => '5_day'
        },
        {
          'unique_id' => '95a4c030-b8d5-11ef-8249-18c04db5c362',
          'service_response_day_time' => Time.zone.parse('2023-12-05T15:12:02.000Z'),
          'service_response_timeframe' => '2_day'
        }
      ]
      child.save!

      values = SearchableDatetime.where(record_id: child.id, record_type: Child.name, field_name: 'service_due_dates')
      expect(values.size).to eq(3)
      expect(values.map(&:value)).to match_array(
        [
          Time.zone.parse('2012-12-02T08:48:01.000Z'),
          Time.zone.parse('2022-01-15T07:20:05.000Z'),
          Time.zone.parse('2023-12-07T15:12:02.000Z')
        ]
      )
    end
  end
end
