# frozen_string_literal: true

require 'rails_helper'

describe SearchFilters::RangeList do
  it 'builds an upper-bounded numeric query from an open-ended range list' do
    params = DestringifyService.destringify({ 'age' => ['..18'] }, true)
    filter = SearchFilterService.new.build_filters(params).first

    expect(filter.query).to eq("(data @? '$.age ? (@ <= 18)')")
    expect(filter.query(Child)).to eq('(srch_age IS NOT NULL AND srch_age <= 18)')
  end

  it 'builds a lower-bounded numeric query from an open-ended range list' do
    params = DestringifyService.destringify({ 'age' => ['18..'] }, true)
    filter = SearchFilterService.new.build_filters(params).first

    expect(filter.query).to eq("(data @? '$.age ? (@ >= 18)')")
    expect(filter.query(Child)).to eq('(srch_age IS NOT NULL AND srch_age >= 18)')
  end

  it 'builds a single upper-bounded numeric filter' do
    params = DestringifyService.destringify({ 'age' => '..18' }, true)
    filter = SearchFilterService.new.build_filters(params).first

    expect(filter).to be_a(SearchFilters::NumericRange)
    expect(filter.query).to eq("data @? '$.age ? (@ <= 18)'")
  end
end
