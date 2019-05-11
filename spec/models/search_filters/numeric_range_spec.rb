require 'rails_helper'

describe SearchFilters::NumericRange do

  describe '.query_scope', search: true do

    before :example do
      reload_model(Child) do
        allow(Field).to receive(:all_filterable_numeric_field_names) { %w(age) }
      end

      @correct_match = Child.create!(data: {name: 'Correct Match', age: 12 })
      @incorrect_match = Child.create!(data: {name: 'Incorrect Match', age: 8 })
      Sunspot.commit
    end

    it 'matches on a numeric range' do
      filter = SearchFilters::NumericRange.new(
          field_name: 'age', from: 11, to: 15)

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