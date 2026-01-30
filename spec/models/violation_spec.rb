# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe Violation, search: true do
  describe 'is_late_verification' do
    before do
      clean_data(Violation, Incident)
    end

    let!(:incident) { Incident.create!(data: { status: 'open', incident_date: Date.today - 4.months }) }

    it 'sets is_late_verification to false if ctfmr_verified is not verified' do
      violation = Violation.build_record(
        'killing',
        { ctfmr_verified: 'report_pending_verification', ctfmr_verified_date: Date.today },
        incident
      )
      violation.save!

      expect(violation.is_late_verification).to eq(false)
    end

    it 'sets is_late_verification to false if the ctfmr_verified_date is not present' do
      violation = Violation.build_record('killing', { ctfmr_verified: 'verified' }, incident)
      violation.save!

      expect(violation.is_late_verification).to eq(false)
    end

    it 'sets is_late_verification to true if the violation is late verified' do
      violation = Violation.build_record(
        'killing',
        { ctfmr_verified: 'verified', ctfmr_verified_date: Date.today },
        incident
      )
      violation.save!

      expect(violation.is_late_verification).to eq(true)
    end
  end
end
