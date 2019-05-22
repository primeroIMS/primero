require 'rails_helper'

describe SearchFilters::Value do

  describe '.query_scope', search: true do

    before :example do
      reload_model(Child) do
        allow(Field).to receive(:all_filterable_field_names) { %w(sex) }
      end

      @correct_match = Child.create!(data: {name: 'Correct Match', sex: 'female', age: 12, record_state: true })
      @incorrect_match = Child.create!(data: {name: 'Incorrect Match', sex: 'male', age: 8, record_state: false })
      Sunspot.commit
    end

    it 'matches on string values' do
      filter = SearchFilters::Value.new(field_name: 'sex', value: 'female')

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    it 'matches on boolean value' do
      filter = SearchFilters::Value.new(field_name: 'record_state', value: true)

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