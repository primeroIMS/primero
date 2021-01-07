# frozen_string_literal: true

require 'rails_helper'

describe KPI::ServicesProvided, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/10/26')) }
  let(:to) { indexed_field(DateTime.parse('2020/10/31')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }
  let(:service1) { 'service1' }
  let(:service2) { 'service2' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:action_plan_form, [
      field(:gbv_follow_up_subform_section, {
        subform_section: form(:gbv_follow_up_subform_section, [
          field(:service_type_provided)
        ])
      })
    ])

    Child.create!({ data: {
      created_at: DateTime.parse('2020/10/27'),
      owned_by_groups: [group2],
      gbv_follow_up_subform_section: [{
        service_type_provided: service1
      }]
    }})

    Child.create!({ data: {
      created_at: DateTime.parse('2020/10/27'),
      owned_by_groups: [group3],
      gbv_follow_up_subform_section: [{
        service_type_provided: service2
      }]
    }})

    Sunspot.commit
  end

  with 'No cases in the users group' do
    it 'should return no services' do
      json = KPI::ServicesProvided.new(from, to, [group1]).to_json
      expect(json[:data][:services_provided].length).to eq(0)
    end
  end

  with 'With one case with an action plan filled out in the users group' do
    it 'should return a count of 1 for service 1' do
      json = KPI::ServicesProvided.new(from, to, [group2]).to_json
      expect(json[:data][:services_provided].first[:count]).to eq(1)
      expect(json[:data][:services_provided].second).to be(nil)
    end
  end

  with 'With two cases with an action plan filled out in the users groups' do
    it 'should return a count of 1 for service 1 and 1 for service 2' do
      json = KPI::ServicesProvided.new(from, to, [group2, group3]).to_json
      expect(json[:data][:services_provided].first[:count]).to eq(1)
      expect(json[:data][:services_provided].second[:count]).to eq(1)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
