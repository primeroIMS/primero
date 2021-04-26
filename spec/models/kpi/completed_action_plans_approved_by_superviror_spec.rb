# frozen_string_literal: true

require 'rails_helper'

describe Kpi::CompletedSupervisorApprovedCaseActionPlans, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/10/26')) }
  let(:to) { indexed_field(DateTime.parse('2020/10/31')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:action_plan_form, [
           field(:action_plan_approved),
           field(:action_plan_section,
                 subform_section: form(:action_plan_subform_section, [
                                         field(:service_type, mandatory_for_completion: true)
                                       ]))
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group2],
                    action_plan_section: [{
                      service_type: 'test'
                    }]
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group2],
                    action_plan_approved: true,
                    action_plan_section: [{
                      service_type: 'test'
                    }]
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group3],
                    action_plan_approved: true,
                    action_plan_section: [{
                      service_type: 'test'
                    }]
                  })

    Sunspot.commit
  end

  with 'No cases in the users groups with completed, approved action plans' do
    it 'should return 0% completed action plans' do
      json = Kpi::CompletedSupervisorApprovedCaseActionPlans.new(from, to, [group1]).to_json
      expect(json[:data][:completed_and_approved]).to eql(0)
    end
  end

  with 'A single case in the users groups with a completed, approved action plan' do
    it 'should return 100% completed action plans' do
      json = Kpi::CompletedSupervisorApprovedCaseActionPlans.new(from, to, [group3]).to_json
      expect(json[:data][:completed_and_approved]).to eql(1.0)
    end
  end

  with 'Three cases with completed action plans, 2 approved' do
    it 'should return 66.7% of plans approved and completed' do
      json = Kpi::CompletedSupervisorApprovedCaseActionPlans.new(from, to, [group2, group3]).to_json
      expect(json[:data][:completed_and_approved]).to be_within(0.001).of(0.667)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
