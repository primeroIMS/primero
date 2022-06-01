# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::SexualViolence do
  let(:rape) { ManagedReports::SubReports::SexualViolence.new }

  it 'return the subreport id the subject' do
    expect(rape.id).to eq('sexual_violence')
  end

  it 'return an Array of instance' do
    expect(rape.indicators).to be_an_instance_of(Array)
    expect(rape.indicators.size).to eq(5)
  end

  it 'return a Hash of Lookups' do
    expect(rape.lookups).to be_an_instance_of(Hash)
    expect(rape.lookups.size).to eq(3)
  end

  it 'return Lookups keys as values' do
    expect(rape.lookups.values).to match_array(
      %w[
        lookup-armed-force-group-or-other-party
        Location
        lookup-mrm-sexual-violence-type
      ]
    )
  end
end
