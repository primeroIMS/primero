# frozen_string_literal: true

require 'rails_helper'

describe Kpi::ClientSatisfactionRate, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/10/01')) }
  let(:to) { indexed_field(DateTime.parse('2020/12/31')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  before :each do
    clean_data(Child, FormSection, Field, Location)

    @london = Location.create!(
      location_code: '41',
      name: 'London',
      placename: 'London',
      type: 'County',
      hierarchy_path: 'GBR.01.41',
      admin_level: 2
    )

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/15'),
                    owned_by_groups: [group2],
                    opening_hours_when_client_could_attend: 'yes',
                    client_comfortable_with_case_worker: 'yes',
                    same_case_worker_each_visit: 'yes',
                    could_client_choose_support_person: 'yes',
                    client_informed_of_options: 'yes',
                    client_decided_what_next: 'yes',
                    client_referred_elsewhere: 'yes',
                    survivor_discreet_access: 'yes',
                    staff_respect_confidentiality: 'yes',
                    client_private_meeting: 'yes',
                    staff_friendly: 'yes',
                    staff_open_minded: 'yes',
                    staff_answered_all_questions: 'yes',
                    staff_client_could_understand: 'yes',
                    staff_allowed_enough_time: 'yes',
                    staff_helpful: 'yes',
                    client_feel_better: 'yes',
                    would_client_recommend_friend: 'yes'
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/11/15'),
                    owned_by_groups: [group3],
                    opening_hours_when_client_could_attend: 'no',
                    client_comfortable_with_case_worker: 'no',
                    same_case_worker_each_visit: 'no',
                    could_client_choose_support_person: 'no',
                    client_informed_of_options: 'no',
                    client_decided_what_next: 'no',
                    client_referred_elsewhere: 'no',
                    survivor_discreet_access: 'no',
                    staff_respect_confidentiality: 'no',
                    client_private_meeting: 'no',
                    staff_friendly: 'no',
                    staff_open_minded: 'no',
                    staff_answered_all_questions: 'no',
                    staff_client_could_understand: 'no',
                    staff_allowed_enough_time: 'no',
                    staff_helpful: 'no',
                    client_feel_better: 'no',
                    would_client_recommend_friend: 'no'
                  })

    Sunspot.commit
  end

  with 'No cases in the users groups' do
    it 'satisfaction rate should be nil' do
      json = Kpi::ClientSatisfactionRate.new(from, to, [group1]).to_json
      expect(json[:data][:satisfaction_rate]).to eq(nil)
    end
  end

  with 'One satisfied case in the users groups' do
    it 'should have a satisfaction_rate of 1.0' do
      json = Kpi::ClientSatisfactionRate.new(from, to, [group2]).to_json
      expect(json[:data][:satisfaction_rate]).to eq(1.0)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field, Location)
  end
end
