# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::Or do
  describe '.filter', search: true do
    before(:each) do
      clean_data(Incident, Child)
    end

    let!(:correct_match1) {
      Child.create!(data: { name: 'Correct Match1', sex: 'female', protection_concerns: %w[trafficking] })
    }
    let!(:correct_match2) {
      Child.create!(data: { name: 'Correct Match2', sex: 'male', protection_concerns: %w[statelessness] })
    }
    let!(:incorrect_match) {
      Child.create!(data: { name: 'Incorrect Match', sex: 'male', protection_concerns: %w[trafficking] })
    }

    it 'matches on values for either or the given fields' do
      filter = SearchFilters::Or.new(filters: [
                                       SearchFilters::TextValue.new(field_name: 'sex', value: 'female'),
                                       SearchFilters::TextValue.new(field_name: 'protection_concerns',
                                                                    value: 'statelessness')
                                     ])
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(2)
      expect(search.records.map(&:name)).to include(correct_match1.name, correct_match2.name)
    end

    after(:each) do
      clean_data(Incident, Child)
    end
  end
end
