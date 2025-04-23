# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilterService do
  let(:service) { SearchFilterService.new }

  describe '.select_filter_params' do
    it 'excludes rails utility parameters' do
      result = service.select_filter_params({ 'sex' => 'male', 'age' => 10, 'action' => 'get' }, %w[sex age])
      expect(result.keys).to match(%w[sex age])
    end

    it 'only includes permitted params' do
      result = service.select_filter_params({ 'sex' => 'male', 'age' => 10, 'action' => 'get' }, %w[sex])
      expect(result.keys).to match(%w[sex])
    end
  end

  describe 'filter construction' do
    it 'builds a value filter from numeric values' do
      filter = service.build_filters({ 'age' => 10 }).first
      expect(filter).to be_instance_of(SearchFilters::Value)
      expect(filter.field_name).to eq('age')
      expect(filter.value).to eq(10)
    end

    it 'builds a value filter from string values' do
      filter = service.build_filters({ 'sex' => 'male' }).first
      expect(filter).to be_instance_of(SearchFilters::TextValue)
      expect(filter.field_name).to eq('sex')
      expect(filter.value).to eq('male')
    end

    it 'builds a value filter from boolean values' do
      filter = service.build_filters({ 'valid' => true }).first
      expect(filter).to be_instance_of(SearchFilters::BooleanValue)
      expect(filter.field_name).to eq('valid')
      expect(filter.value).to be true
    end

    it 'builds a not filter from numeric values' do
      filter = service.build_filters({ 'not' => { 'age' => 10 } }).first
      expect(filter).to be_instance_of(SearchFilters::Not)
      expect(filter.filter).to be_instance_of(SearchFilters::Value)
      expect(filter.filter.field_name).to eq('age')
      expect(filter.filter.value).to eq(10)
    end

    it 'builds a not filter from string values' do
      filter = service.build_filters({ 'not' => { 'sex' => 'male' } }).first
      expect(filter).to be_instance_of(SearchFilters::Not)
      expect(filter.filter).to be_instance_of(SearchFilters::TextValue)
      expect(filter.filter.field_name).to eq('sex')
      expect(filter.filter.value).to eq('male')
    end

    it 'builds a not filter from boolean values' do
      filter = service.build_filters({ 'not' => { 'valid' => true } }).first
      expect(filter).to be_instance_of(SearchFilters::Not)
      expect(filter.filter).to be_instance_of(SearchFilters::BooleanValue)
      expect(filter.filter.field_name).to eq('valid')
      expect(filter.filter.value).to eq(true)
    end

    it 'builds a not filter with two values' do
      filter = service.build_filters({ 'not' => { 'age' => [10, 8] } }).first
      expect(filter).to be_instance_of(SearchFilters::Not)
      expect(filter.filter).to be_instance_of(SearchFilters::ValueList)
      expect(filter.filter.field_name).to eq('age')
      expect(filter.filter.values).to eq([10, 8])
    end

    it 'builds a date range filter from date range values' do
      filter = service.build_filters(
        { 'registration_date' => { 'from' => Date.new(2018, 1, 1), 'to' => Date.new(2019, 1, 1) } }
      ).first
      expect(filter).to be_instance_of(SearchFilters::DateRange)
      expect(filter.field_name).to eq('registration_date')
      expect(filter.from).to eq(Date.new(2018, 1, 1))
      expect(filter.to).to eq(Date.new(2019, 1, 1))
    end

    it 'builds a numeric range filter from numeric range values' do
      filter = service.build_filters({ 'age' => { 'from' => 0, 'to' => 5 } }).first
      expect(filter).to be_instance_of(SearchFilters::NumericRange)
      expect(filter.field_name).to eq('age')
      expect(filter.from).to eq(0)
      expect(filter.to).to eq(5)
    end

    it 'builds a value list filter from a value list' do
      filter = service.build_filters({ 'sex' => %w[male female] }).first
      expect(filter).to be_instance_of(SearchFilters::TextList)
      expect(filter.field_name).to eq('sex')
      expect(filter.values).to eq(%w[male female])
    end

    it 'builds an or filter from or values if they are specified as a hash' do
      params = { 'or' => {
        'age' => { 'from' => 0, 'to' => 5 },
        'sex' => 'female',
        'not' => { 'sex' => 'female' }
      } }
      filter = service.build_filters(params).first
      expect(filter).to be_instance_of(SearchFilters::Or)
      expect(filter.filters[0]).to be_instance_of(SearchFilters::NumericRange)
      expect(filter.filters[0].field_name).to eq('age')
      expect(filter.filters[0].from).to eq(0)
      expect(filter.filters[0].to).to eq(5)
      expect(filter.filters[1]).to be_instance_of(SearchFilters::TextValue)
      expect(filter.filters[1].field_name).to eq('sex')
      expect(filter.filters[1].value).to eq('female')
      expect(filter.filters[2]).to be_instance_of(SearchFilters::Not)
      expect(filter.filters[2].filter).to be_instance_of(SearchFilters::TextValue)
      expect(filter.filters[2].filter.field_name).to eq('sex')
      expect(filter.filters[2].filter.value).to eq('female')
    end

    it 'builds an or filter from or values if they are specified as a hash' do
      params = { 'or' => [
        { 'age' => { 'from' => 0, 'to' => 5 } },
        { 'sex' => 'female' },
        'not' => { 'sex' => 'female' }
      ] }
      filter = service.build_filters(params).first
      expect(filter).to be_instance_of(SearchFilters::Or)
      expect(filter.filters[0]).to be_instance_of(SearchFilters::NumericRange)
      expect(filter.filters[0].field_name).to eq('age')
      expect(filter.filters[0].from).to eq(0)
      expect(filter.filters[0].to).to eq(5)
      expect(filter.filters[1]).to be_instance_of(SearchFilters::TextValue)
      expect(filter.filters[1].field_name).to eq('sex')
      expect(filter.filters[1].value).to eq('female')
      expect(filter.filters[2]).to be_instance_of(SearchFilters::Not)
      expect(filter.filters[2].filter).to be_instance_of(SearchFilters::TextValue)
      expect(filter.filters[2].filter.field_name).to eq('sex')
      expect(filter.filters[2].filter.value).to eq('female')
    end

    it 'does not build a filter for an invalid hash' do
      params = { 'age' => { 'display_name' => 'Age' } }

      expect(service.build_filters(params)).to be_empty
    end

    it 'builds a location filter' do
      filter = service.build_filters({ 'loc:location_current' => 'city1' }).first
      expect(filter).to be_instance_of(SearchFilters::LocationValue)
      expect(filter.field_name).to eq('loc:location_current')
      expect(filter.value).to eq('city1')
    end

    it 'builds a location list filter' do
      filter = service.build_filters({ 'loc:location_current' => ['city1'] }).first
      expect(filter).to be_instance_of(SearchFilters::LocationList)
      expect(filter.field_name).to eq('loc:location_current')
      expect(filter.values).to eq(['city1'])
    end

    it 'builds a filter for a list of ranges' do
      filter = service.build_filters({ 'age' => [{ 'from' => 10, 'to' => 16 }] }).first
      expect(filter).to be_instance_of(SearchFilters::RangeList)
      expect(filter.field_name).to eq('age')
      expect(filter.values).to eq([{ 'from' => 10, 'to' => 16 }])
    end
  end

  describe 'Service' do
    it 'constructs valid authorized filters from the input' do
      params = {
        'action' => 'post',
        'sex' => 'female',
        'age' => '0..5'
      }
      result = SearchFilterService.build_filters(params, %w[age])
      expect(result.size).to eq(1)
      expect(result[0].field_name).to eq('age')
      expect(result[0].from).to eq(0)
      expect(result[0].to).to eq(5)
    end
  end

  describe 'Permitted field names with number at the end' do
    it 'constructs valid filters from the input' do
      params = {
        'age2' => '0..5'
      }
      result = SearchFilterService.build_filters(params, %w[age])
      expect(result.size).to eq(1)
      expect(result[0].field_name).to eq('age2')
      expect(result[0].from).to eq(0)
      expect(result[0].to).to eq(5)
    end

    it 'constructs invalid filters if the number at the end is not in the range 0..5' do
      params = {
        'age6' => '0..5'
      }
      result = SearchFilterService.build_filters(params, %w[age])
      expect(result.blank?).to eq(true)
    end
  end
end
