# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::NumericRange do
  describe 'filter', search: true do
    before(:each) do
      clean_data(Child)
    end

    let!(:correct_match) { Child.create!(data: { name: 'Correct Match', age: 12 }) }
    let!(:incorrect_match) { Child.create!(data: { name: 'Incorrect Match', sex: 'male', age: 8 }) }

    it 'matches on a numeric range' do
      filter = SearchFilters::NumericRange.new(
        field_name: 'age', from: 11, to: 15
      )
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(correct_match.name)
    end

    after(:each) do
      clean_data(Child)
    end
  end
end
