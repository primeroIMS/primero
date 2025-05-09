# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Normalizeable do
  before do
    clean_data(Child)
    allow(SystemSettings).to receive(:current).and_return(SystemSettings.new)
  end

  describe 'save_searchable_fields' do
    let(:child) do
      Child.create!(
        data: {
          record_state: true, status: 'open',
          protection_concerns: %w[concern1 concern2],
          closure_problems_severity: '1',
          client_summary_worries_severity: 'not_at_integer'
        }
      )
    end
    before { child }

    it 'saves the searchable fields for the record' do
      ch = Child.first
      expect(ch.srch_record_state).to eq(true)
      expect(ch.srch_status).to eq('open')
      expect(ch.srch_protection_concerns).to match_array(%w[concern1 concern2])
      expect(ch.srch_closure_problems_severity_int).to eq(1)
      expect(ch.srch_client_summary_worries_severity_int).to be_nil
    end
  end
end
