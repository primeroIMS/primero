# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Violations do

  describe '.properties' do
    let(:violation_report) do
      ManagedReports::Violations.new
    end
    it 'return id for violation_report' do
      expect(violation_report.id).to eq('violations')
    end

    it 'return properties for violation' do
      expect(violation_report.properties.keys).to match_array(%i[id name description module_id])
    end

    it 'return subreports for violation' do
      expect(violation_report.subreports).to match_array(Violation::TYPES)
    end
  end
end
