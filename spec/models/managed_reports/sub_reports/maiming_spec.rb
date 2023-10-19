# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::Maiming do
  let(:maining) { ManagedReports::SubReports::Maiming.new }

  it 'return the subreport id the subject' do
    expect(maining.id).to eq('maiming')
  end

  it 'return an Array of instance' do
    expect(maining.indicators).to be_an_instance_of(Array)
    expect(maining.indicators.size).to eq(5)
  end

  it 'return a Hash of Lookups' do
    expect(maining.lookups).to be_an_instance_of(Hash)
    expect(maining.lookups.size).to eq(5)
  end
end
