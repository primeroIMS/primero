# frozen_string_literal: true

require 'rails_helper'

describe SearchFilters::NotValue do
  describe '.query_scope', search: true do
    before :example do
      clean_data(Child)
      @correct_match = Child.create!(data: { name: 'Correct Match', sex: 'female', age: 12, record_state: true })
      Child.create!(data: { name: 'Incorrect Match 1', sex: 'male', age: 8, record_state: false })
      Child.create!(data: { name: 'Incorrect Match 2', sex: 'male', age: 10, record_state: false })
      Sunspot.commit
    end

    it 'matches on string values' do
      filter = SearchFilters::NotValue.new(field_name: 'sex', values: 'male')

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    it 'matches on boolean value' do
      filter = SearchFilters::NotValue.new(field_name: 'record_state', values: false)

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    it 'matches by two values' do
      filter = SearchFilters::NotValue.new(field_name: 'age', values: [8, 10])

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    after :example do
      clean_data(Child)
    end
  end
end
