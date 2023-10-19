# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::MilitaryUse do
  let(:military_use) { ManagedReports::SubReports::MilitaryUse.new }

  it 'return the subreport id the subject' do
    expect(military_use.id).to eq('military_use')
  end

  it 'return an Array of instance' do
    expect(military_use.indicators).to be_an_instance_of(Array)
    expect(military_use.indicators.one?).to be_truthy
  end

  it 'return a Hash of Lookups' do
    expect(military_use.lookups).to be_an_instance_of(Hash)
    expect(military_use.lookups.one?).to be_truthy
  end
end
