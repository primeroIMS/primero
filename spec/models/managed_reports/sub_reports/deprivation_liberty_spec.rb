# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::SubReports::DeprivationLiberty do
  let(:detention) { ManagedReports::SubReports::DeprivationLiberty.new }

  it 'return the subreport id the subject' do
    expect(detention.id).to eq('deprivation_liberty')
  end

  it 'return an Array of instance' do
    expect(detention.indicators).to be_an_instance_of(Array)
    expect(detention.indicators.size).to eq(4)
  end

  it 'return a Hash of Lookups' do
    expect(detention.lookups).to be_an_instance_of(Hash)
    expect(detention.lookups.size).to eq(3)
  end

  it 'return indicators_subcolumns keys as values' do
    expect(detention.indicators_subcolumns.keys).to match_array(
      %w[
        perpetrator_detention
        reporting_location_detention
        detention_status
      ]
    )
  end
end
