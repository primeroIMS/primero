# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SearchFilters::BooleanList do
  let(:record1) { Child.create!(data: { name: 'Record 1', sex: 'female', age: 12, record_state: true }) }
  let(:record2) { Child.create!(data: { name: 'Record 2', sex: 'female', age: 12, record_state: 'true' }) }
  let(:record3) { Child.create!(data: { name: 'Record 3', sex: 'female', age: 12, record_state: 'false' }) }
  let(:record4) { Child.create!(data: { name: 'Record 4', sex: 'female', age: 12, record_state: false }) }

  before(:each) do
    clean_data(Child)
    record1
    record2
    record3
    record4
  end

  it 'matches the true filter' do
    filter = SearchFilters::BooleanList.new(field_name: 'record_state', values: [true])
    search = PhoneticSearchService.search(Child, filters: [filter])

    expect(search.total).to eq(2)
    expect(search.records.map(&:id)).to match_array([record1.id, record2.id])
  end

  it 'matches the false filter' do
    filter = SearchFilters::BooleanList.new(field_name: 'record_state', values: [false])
    search = PhoneticSearchService.search(Child, filters: [filter])

    expect(search.total).to eq(2)
    expect(search.records.map(&:id)).to match_array([record3.id, record4.id])
  end
end
