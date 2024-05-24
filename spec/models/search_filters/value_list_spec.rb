# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::ValueList do
  describe '.query_scope', search: true do
    before :example do
      @correct_match1 = Child.create!(data: { name: 'Correct Match', protection_concerns: %w[statelessness] })
      @correct_match2 = Child.create!(data: { name: 'Correct Match', protection_concerns: %w[trafficked] })
      @incorrect_match = Child.create!(data: { name: 'Incorrect Match', protection_concerns: %w[labor] })
      @age_match = Child.create!(data: { name: 'Incorrect Match', age: 5 })
      Sunspot.commit
    end

    it 'matches on a list of values' do
      filter = SearchFilters::ValueList.new(field_name: 'protection_concerns', values: %w[statelessness trafficked])

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(2)
      expect(search.results.map(&:name)).to include(@correct_match1.name, @correct_match2.name)
    end

    it 'matches on a list of range values' do
      filter = SearchFilters::ValueList.new(field_name: 'age', values: [{ 'from' => 0, 'to' => 5 }])

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@age_match.name)
    end

    after :example do
      @correct_match1.destroy
      @correct_match2.destroy
      @incorrect_match.destroy
    end
  end
end
