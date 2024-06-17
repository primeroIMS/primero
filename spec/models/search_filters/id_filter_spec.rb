# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::IdFilter do
  describe 'filter', search: true do
    let!(:record1) { Child.create!(data: { name: 'Record 1', sex: 'female', age: 12, record_state: true }) }
    let!(:record2) { Child.create!(data: { name: 'Record 2', sex: 'male', age: 8, record_state: false }) }

    it 'matches the record id' do
      filter = SearchFilters::IdFilter.new(field_name: 'id', value: record1.id)
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end

    after(:each) do
      clean_data(Child)
    end
  end
end
