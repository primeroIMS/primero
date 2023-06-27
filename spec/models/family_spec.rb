# frozen_string_literal: true

require 'rails_helper'

describe Family do
  before do
    clean_data(Family)
  end

  describe 'parent_form' do
    it 'returns family' do
      expect(Family.parent_form).to eq('family')
    end
  end

  describe 'quicksearch', search: true do
    it 'has a searchable case id, survivor number' do
      expected = %w[short_id family_id family_name family_number]
      expect(Family.quicksearch_fields).to match_array(expected)
    end

    it 'can find a Family by Family Number' do
      family = Family.create!(data: { family_name: 'Family One', family_number: 'ABC123XYZ' })
      family.index!
      search_result = SearchService.search(Family, query: 'ABC123XYZ').results
      expect(search_result).to have(1).family
      expect(search_result.first.family_number).to eq('ABC123XYZ')
    end
  end

  after do
    clean_data(Family)
  end
end
