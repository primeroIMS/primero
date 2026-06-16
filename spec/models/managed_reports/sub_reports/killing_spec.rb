# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::Killing do
  let(:killing) { ManagedReports::SubReports::Killing.new }

  it 'return the subreport id the subject' do
    expect(killing.id).to eq('killing')
  end

  it 'return an Array of instance' do
    expect(killing.indicators).to be_an_instance_of(Array)
    expect(killing.indicators.size).to eq(5)
  end

  it 'return a Hash of Lookups' do
    expect(killing.lookups).to be_an_instance_of(Hash)
    expect(killing.lookups.size).to eq(5)
  end
end
