# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::DateRange do
  describe '.query_scope', search: true do
    let!(:correct_match) { Child.create!(data: { name: 'Correct Match', registration_date: Date.new(2019, 1, 1) }) }
    let!(:incorrect_match) { Child.create!(data: { name: 'Incorrect Match', registration_date: Date.new(2018, 1, 1) }) }

    it 'matches on string values' do
      filter = SearchFilters::DateRange.new(
        field_name: 'registration_date', from: Date.new(2018, 6, 1), to: Date.new(2019, 3, 1)
      )
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(correct_match.name)
    end

    after do
      clean_data(Child)
    end
  end
end
