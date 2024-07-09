# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::SubReports::DenialHumanitarianAccess do
  let(:denial_humanitarian_access) { ManagedReports::SubReports::DenialHumanitarianAccess.new }

  it 'return the subreport id the subject' do
    expect(denial_humanitarian_access.id).to eq('denial_humanitarian_access')
  end

  it 'return an Array of instance' do
    expect(denial_humanitarian_access.indicators).to be_an_instance_of(Array)
    expect(denial_humanitarian_access.indicators.size).to eq(4)
  end

  it 'return a Hash of Lookups' do
    expect(denial_humanitarian_access.lookups).to be_an_instance_of(Hash)
    expect(denial_humanitarian_access.lookups.size).to eq(3)
  end
end
