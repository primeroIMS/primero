# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::SubReports::Recruitment do
  let(:recruitment) { ManagedReports::SubReports::Recruitment.new }

  it 'return the subreport id the subject' do
    expect(recruitment.id).to eq('recruitment')
  end

  it 'return an Array of instance' do
    expect(recruitment.indicators).to be_an_instance_of(Array)
    expect(recruitment.indicators.size).to eq(5)
  end

  it 'return a Hash of Lookups' do
    expect(recruitment.lookups).to be_an_instance_of(Hash)
    expect(recruitment.lookups.size).to eq(5)
  end

  it 'return Lookups keys as values' do
    expect(recruitment.lookups.values).to match_array(
      %w[
        lookup-armed-force-group-or-other-party
        Location
        lookup-combat-role-type
        lookup-recruitment-factors
        lookup-violation-tally-options
      ]
    )
  end
end
