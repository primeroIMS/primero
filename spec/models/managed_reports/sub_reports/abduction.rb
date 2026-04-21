# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::Abduction do
  let(:recruitment) { ManagedReports::SubReports::Abduction.new }

  it 'return the subreport id the subject' do
    expect(recruitment.id).to eq('abduction')
  end

  it 'return an Array of instance' do
    expect(recruitment.indicators).to be_an_instance_of(Array)
    expect(recruitment.indicators.size).to eq(5)
  end

  it 'return a Hash of Lookups' do
    expect(recruitment.lookups).to be_an_instance_of(Hash)
    expect(recruitment.lookups.size).to eq(4)
  end

  it 'return Lookups keys as values' do
    expect(recruitment.lookups.values).to match_array(
      %w[
        lookup-armed-force-group-or-other-party
        Location
        lookup-violation-tally-options
        lookup-abduction-purpose
      ]
    )
  end

  it 'return indicators_subcolumns keys as values' do
    expect(recruitment.indicators_subcolumns.keys).to match_array(
      %w[
        perpetrators
        reporting_location
        abducted_status
        abduction_reasons
      ]
    )
  end
end
