# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe GenderBasedViolence do
  before :each do
    clean_data(Incident)
  end

  let(:user) { fake_user(user_name: 'test_user') }

  describe 'elapsed_reporting_time' do
    let(:incident) do
      Incident.create!(
        data: { incident_date: Date.new(2020, 8, 10), date_of_first_report: Date.new(2020, 8, 12) }
      )
    end

    it 'sets the elapsed reporting time when a incident is created' do
      expect(incident.elapsed_reporting_time).to eq('0_3_days')
    end

    it 'clears the elapsed reporting time if the incident_date is removed' do
      incident.incident_date = nil
      incident.save!

      expect(incident.elapsed_reporting_time).to be_nil
    end

    it 'clears the elapsed reporting time if the date_of_first_report is removed' do
      incident.date_of_first_report = nil
      incident.save!

      expect(incident.elapsed_reporting_time).to be_nil
    end
  end

  describe 'calculate_gbv_case_context' do
    it 'sets the appropiate case context for child_sexual_abuse' do
      incident = Incident.create!(
        data: {
          age: 10,
          abduction_status_time_of_incident: 'status_1',
          harmful_traditional_practice: 'practice_1',
          goods_money_exchanged: true,
          gbv_sexual_violence_type: GenderBasedViolence::RAPE,
          alleged_perpetrator: [
            { unique_id: '0001', perpetrator_relationship: GenderBasedViolence::INTIMATE_PARTNER_FORMER_PARTNER }
          ]
        }
      )

      expect(incident.gbv_case_context).to match_array(
        [
          GenderBasedViolence::INTIMATE_PARTNER_VIOLENCE,
          GenderBasedViolence::CHILD_SEXUAL_ABUSE,
          GenderBasedViolence::POSSIBLE_SEXUAL_EXPLOITATION,
          GenderBasedViolence::POSSIBLE_SEXUAL_SLAVERY,
          GenderBasedViolence::HARMFUL_TRADITIONAL_PRACTICE
        ]
      )
    end

    it 'sets the appropiate case context for early_marriage' do
      incident = Incident.create!(
        data: {
          age: 10,
          abduction_status_time_of_incident: 'status_1',
          harmful_traditional_practice: 'practice_1',
          goods_money_exchanged: true,
          gbv_sexual_violence_type: GenderBasedViolence::FORCED_MARRIAGE,
          alleged_perpetrator: [
            { unique_id: '0001', perpetrator_relationship: GenderBasedViolence::INTIMATE_PARTNER_FORMER_PARTNER }
          ]
        }
      )

      expect(incident.gbv_case_context).to match_array(
        [
          GenderBasedViolence::INTIMATE_PARTNER_VIOLENCE,
          GenderBasedViolence::EARLY_MARRIAGE,
          GenderBasedViolence::HARMFUL_TRADITIONAL_PRACTICE
        ]
      )
    end
  end
end
