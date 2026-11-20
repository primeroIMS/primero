# frozen_string_literal: true

require 'rails_helper'

describe SearchFilters::Value do
  describe 'to_s' do
    it 'generates a query param for equality' do
      filter = SearchFilters::Value.new(field_name: 'age', value: 18)

      expect(filter.to_s).to eq('age=18')
    end

    it 'generates an upper-bounded range for a less-than constraint' do
      filter = SearchFilters::Value.new(field_name: 'age', value: 18, operator: '<')

      expect(filter.to_s).to eq('age=..18')
    end

    it 'generates a lower-bounded range for a greater-than constraint' do
      filter = SearchFilters::Value.new(field_name: 'age', value: 19, operator: '>')

      expect(filter.to_s).to eq('age=18..')
    end
  end

  describe 'filter', search: true do
    let!(:correct_match) { Child.create!(data: { name: 'Correct Match', sex: 'female', age: 12, record_state: true }) }
    let!(:incorrect_match) { Child.create!(data: { name: 'Incorrect Match', sex: 'male', age: 8, record_state: false }) }

    it 'matches on number values' do
      filter = SearchFilters::Value.new(field_name: 'age', value: 12)
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(correct_match.name)
    end

    after(:each) do
      clean_data(Child)
    end
  end
end
