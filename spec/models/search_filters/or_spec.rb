require 'rails_helper'

describe SearchFilters::Or do

  describe '.query_scope', search: true do

    before :example do
      reload_model(Child) do
        allow(Field).to receive(:all_filterable_field_names) { %w(sex) }
        allow(Field).to receive(:all_filterable_multi_field_names) { %w(protection_concerns) }
      end

      @correct_match1 = Child.create!(data: {name: 'Correct Match1', sex: 'female', protection_concerns: %w(trafficking) })
      @correct_match2 = Child.create!(data: {name: 'Correct Match2', sex: 'male', protection_concerns: %w(statelessness)})
      @incorrect_match = Child.create!(data: {name: 'Incorrect Match', sex: 'male', protection_concerns: %w(trafficking) })
      Sunspot.commit
    end

    it 'matches on values for either or the given fields' do
      filter = SearchFilters::Or.new(filters: [
        SearchFilters::Value.new(field_name: 'sex', value: 'female'),
        SearchFilters::Value.new(field_name: 'protection_concerns', value: 'statelessness'),
      ])

      search = Child.search do
        filter.query_scope(self)
      end

      expect(search.total).to eq(2)
      expect(search.results.map(&:name)).to include(@correct_match1.name, @correct_match2.name)
    end

    after :example do
      @correct_match1.destroy
      @correct_match2.destroy
      @incorrect_match.destroy
    end

  end

end