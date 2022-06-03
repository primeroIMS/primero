# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::Detention do
  let(:detention) { ManagedReports::SubReports::Detention.new }

  it 'return the subreport id the subject' do
    expect(detention.id).to eq('detention')
  end

  it 'return an Array of instance' do
    expect(detention.indicators).to be_an_instance_of(Array)
    expect(detention.indicators.size).to eq(4)
  end

  it 'return a Hash of Lookups' do
    expect(detention.lookups).to be_an_instance_of(Hash)
    expect(detention.lookups.size).to eq(3)
  end
end
