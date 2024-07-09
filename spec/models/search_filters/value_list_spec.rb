# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::ValueList do
  describe 'to_s' do
    it 'generates a query param' do
      filter = SearchFilters::ValueList.new(field_name: 'age', values: [4, 5, 12])

      expect(filter.to_s).to eq('age=4,5,12')
    end
  end
end
