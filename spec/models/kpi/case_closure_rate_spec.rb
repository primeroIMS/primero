# frozen_string_literal: true

require 'rails_helper'

describe Kpi::CaseClosureRate, search: true do
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
      hierarchy_path: 'GBR.01.41'
    )

    form(:gbv_case_closure_form, [
           field(:created_at),
           field(:date_closure)
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2019/10/15'),
                    status: Record::STATUS_CLOSED,
                    owned_by_location: @london.location_code,
                    owned_by_groups: [group2],
                    date_closure: DateTime.parse('2020/11/01')
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/05/15'),
                    owned_by_groups: [group3],
                    status: Record::STATUS_CLOSED,
                    owned_by_location: @london.location_code,
                    date_closure: DateTime.parse('2020/11/01')
                  })

    Sunspot.commit
  end

  with 'No cases in the users groups' do
    it 'should return 0 data' do
      json = Kpi::CaseClosureRate.new(from, to, [group1]).to_json
      expect(json[:data].length).to eq(0)
    end
  end

  with 'One case closed in 2020/11' do
    it 'should return 1 case in 2020/11' do
      json = Kpi::CaseClosureRate.new(from, to, [group2]).to_json
      expect(json[:data].first[json[:dates].second]).to eq(1)
    end
  end

  with 'Two case closed in 2020/11' do
    it 'should return 2 case in 2020/11' do
      json = Kpi::CaseClosureRate.new(from, to, [group2, group3]).to_json
      expect(json[:data].first[json[:dates].second]).to eq(2)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field, Location)
  end
end
