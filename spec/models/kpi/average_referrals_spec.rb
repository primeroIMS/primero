# frozen_string_literal: true

require 'rails_helper'

describe Kpi::AverageReferrals, search: true do
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
           field(:action_plan_section,
                 subform_section: form(:action_plan_subform_section, [
                                         field(:service_referral)
                                       ]))
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group2],
                    action_plan_section: [{
                      service_referral: 'referred'
                    }, {
                      service_referral: 'referred'
                    }, {
                      service_referral: 'referred'
                    }, {
                      service_referral: 'referred'
                    }]
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group3],
                    action_plan_section: [{
                      service_referral: 'referred'
                    }, {
                      service_referral: 'referred'
                    }]
                  })

    Sunspot.commit
  end

  with 'No cases in the users group' do
    it 'should average referrals of 0' do
      json = Kpi::AverageReferrals.new(from, to, [group1]).to_json
      expect(json[:data][:average_referrals]).to eq(0.0)
    end
  end

  with 'One case with 4 referrals in the users group' do
    it 'should average referrals of 4' do
      json = Kpi::AverageReferrals.new(from, to, [group2]).to_json
      expect(json[:data][:average_referrals]).to eq(4.0)
    end
  end

  with 'One case with 4 referrals and one with 2 in the users group' do
    it 'should average referrals of 3' do
      json = Kpi::AverageReferrals.new(from, to, [group2, group3]).to_json
      expect(json[:data][:average_referrals]).to eq(3.0)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
