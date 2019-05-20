require 'rails_helper'

describe SearchFilters::DateRange do

  describe '.query_scope', search: true do

    before :example do
      reload_model(Child) do
        allow(Field).to receive(:all_searchable_date_field_names) { %w(registration_date) }
      end

      @correct_match = Child.create!(data: {name: 'Correct Match', registration_date: Date.new(2019,1,1) })
      @incorrect_match = Child.create!(data: {name: 'Incorrect Match', registration_date: Date.new(2018,1,1) })
      Sunspot.commit
    end

    it 'matches on string values' do
      filter = SearchFilters::DateRange.new(
          field_name: 'registration_date', from: Date.new(2018,6,1), to: Date.new(2019,3,1))

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    after :example do
      @correct_match.destroy
      @incorrect_match.destroy
    end

  end

end