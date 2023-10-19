# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::IndividualChildren do
  let(:individual_children) { ManagedReports::SubReports::IndividualChildren.new }

  it 'return the subreport id the subject' do
    expect(individual_children.id).to eq('individual_children')
  end

  it 'return an Array of instance' do
    expect(individual_children.indicators).to be_an_instance_of(Array)
    expect(individual_children.indicators.size).to eq(4)
  end

  it 'return a Hash of Lookups' do
    expect(individual_children.lookups).to be_an_instance_of(Hash)
    expect(individual_children.lookups.size).to eq(3)
  end
end
