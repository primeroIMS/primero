# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::Value do
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
