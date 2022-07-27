# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::SubReports::GhnReport do
  let(:ghn_report) { ManagedReports::SubReports::GhnReport.new }

  it 'return the subreport id the subject' do
    expect(ghn_report.id).to eq('ghn_report')
  end

  it 'return an Array of instance' do
    expect(ghn_report.indicators).to be_an_instance_of(Array)
    expect(ghn_report.indicators.size).to eq(7)
  end

  it 'return a Hash of Lookups' do
    expect(ghn_report.lookups).to be_an_instance_of(Hash)
    expect(ghn_report.lookups.size).to eq(1)
  end
end
