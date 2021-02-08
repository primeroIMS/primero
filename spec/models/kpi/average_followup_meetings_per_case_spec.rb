# frozen_string_literal: true

require 'rails_helper'

describe Kpi::AverageFollowupMeetingsPerCase, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/09/01')) }
  let(:to) { indexed_field(DateTime.parse('2020/11/01')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }
  let(:agency1) { 'agency1' }
  let(:agency2) { 'agency2' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:action_plan_form, [
           field(:gbv_follow_up_subform_section,
                 subform_section: form(:gbv_follow_up_subform_section, [
                                         field(:followup_date)
                                       ]))
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/15'),
                    owned_by_groups: [group2],
                    owned_by_agency_id: agency1,
                    gbv_follow_up_subform_section: [{
                      followup_date: DateTime.parse('2020/10/20')
                    }, {
                      followup_date: DateTime.parse('2020/10/20')
                    }, {
                      followup_date: DateTime.parse('2020/10/20')
                    }, {
                      followup_date: DateTime.parse('2020/10/20')
                    }]
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/15'),
                    owned_by_groups: [group3],
                    owned_by_agency_id: agency1,
                    gbv_follow_up_subform_section: [{
                      followup_date: DateTime.parse('2020/10/20')
                    }, {
                      followup_date: DateTime.parse('2020/10/20')
                    }]
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/15'),
                    owned_by_groups: [group3],
                    owned_by_agency_id: agency2,
                    gbv_follow_up_subform_section: [{
                      followup_date: DateTime.parse('2020/10/20')
                    }, {
                      followup_date: DateTime.parse('2020/10/20')
                    }]
                  })

    Sunspot.commit
  end

  with 'No cases in the users group' do
    it 'should return 0 average followup meetings per case' do
      json = Kpi::AverageFollowupMeetingsPerCase.new(from, to, [group1], agency1).to_json
      expect(json[:data][:average_meetings]).to eq(0.0)
    end
  end

  with 'One case with 4 follow up meetings in the group' do
    it 'should return 4 average followup meetings per case' do
      json = Kpi::AverageFollowupMeetingsPerCase.new(from, to, [group2], agency1).to_json
      expect(json[:data][:average_meetings]).to eq(4.0)
    end
  end

  with 'One case with 4 follow up meetings and another with 2 in the group' do
    it 'should return 3 average followup meetings per case' do
      json = Kpi::AverageFollowupMeetingsPerCase.new(from, to, [group2, group3], agency1).to_json
      expect(json[:data][:average_meetings]).to eq(3.0)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
