# frozen_string_literal: true

require 'rails_helper'

describe SearchFilters::ValueList do
  describe 'to_s' do
    it 'generates a query param' do
      filter = SearchFilters::ValueList.new(field_name: 'age', values: [4, 5, 12])

      expect(filter.to_s).to eq('age=4,5,12')
    end
  end
end
