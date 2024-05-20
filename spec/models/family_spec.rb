# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    it 'can find a Family by Family Number' do
      Family.create!(data: { family_name: 'Family One', family_number: 'ABC123XYZ' })
      search_result = PhoneticSearchService.search(Family, query: 'ABC123XYZ').records
      expect(search_result).to have(1).family
      expect(search_result.first.family_number).to eq('ABC123XYZ')
    end
  end

  describe 'phonetic tokens' do
    before do
      clean_data(Family)
    end

    it 'generates the phonetic tokens' do
      registry_record = Family.create!(data: { family_name: 'Miller' })
      expect(registry_record.tokens).to eq(%w[MLR])
    end
  end

  after do
    clean_data(Family)
  end
end
