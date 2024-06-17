# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::BooleanList do
  let(:record1) { Child.create!(data: { name: 'Record 1', sex: nil, age: 12, record_state: true }) }
  let(:record2) { Child.create!(data: { name: 'Record 2', sex: nil, age: 12, record_state: 'true' }) }
  let(:record3) { Child.create!(data: { name: 'Record 3', sex: nil, age: 12, record_state: 'false' }) }
  let(:record4) { Child.create!(data: { name: 'Record 4', sex: 'female', age: 12, record_state: false }) }

  before(:each) do
    clean_data(Child)
    record1
    record2
    record3
    record4
  end

  it 'matches the not_null filter' do
    filter = SearchFilters::NotNull.new(field_name: 'sex')
    search = PhoneticSearchService.search(Child, filters: [filter])

    expect(search.total).to eq(1)
    expect(search.records.map(&:id)).to match_array([record4.id])
  end
end
