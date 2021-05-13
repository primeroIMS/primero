# frozen_string_literal: true

require 'rails_helper'

describe Kpi::NumberOfCases, search: true do
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/09/01')) }
  let(:to) { indexed_field(DateTime.parse('2020/12/01')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  # Restricted to cases made my group members.
  # Number of new cases per reporting site.
  # Restricted by from, to dates.

  before :each do
    clean_data(Location, Child)

    @london = Location.create!(
      location_code: '41',
      name: 'London',
      placename: 'London',
      type: 'County',
      hierarchy_path: 'GBR.01.41',
      admin_level: 2
    )

    @manchester = Location.create!(
      location_code: '40',
      name: 'Manchester',
      placename: 'Manchester',
      type: 'County',
      hierarchy_path: 'GBR.01.40',
      admin_level: 2
    )

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    owned_by_location: @london.location_code,
                    owned_by_groups: [group1],
                    created_at: DateTime.parse('2020/10/01')
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    owned_by_location: @london.location_code,
                    owned_by_groups: [group3],
                    created_at: DateTime.parse('2020/10/01')
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    owned_by_location: @manchester.location_code,
                    owned_by_groups: [group3],
                    created_at: DateTime.parse('2020/11/01')
                  })

    Sunspot.commit
  end

  describe 'Performance' do
    it 'should only use two queries' do
      kpi = Kpi::NumberOfCases.new(from, to, [group1, group3])

      expect { kpi.to_json }.to make_queries(1)
    end
  end

  with 'No cases' do
    it 'should return no data for each of the three months' do
      json = Kpi::NumberOfCases.new(from, to, [group1]).to_json
      expect(json[:dates].length).to eq(3)
    end
  end

  with 'A single case made on 2020/10/01 by someone in the users groups' do
    it 'should return a single case in the second month' do
      json = Kpi::NumberOfCases.new(from, to, [group1]).to_json
      expect(json[:data][0][json[:dates].second]).to eq(1)
    end
  end

  with 'A a user not in the groups that own the case' do
    it 'should return no data' do
      json = Kpi::NumberOfCases.new(from, to, [group2]).to_json
      expect(json[:data][0]).to be(nil)
    end
  end

  with 'A a user in 2 groups each with 1 case' do
    it 'should return 2 cases' do
      json = Kpi::NumberOfCases.new(from, to, [group1, group3]).to_json
      expect(json[:data][0][json[:dates].second]).to eq(2)
    end
  end

  after :each do
    clean_data(Location, Child)
  end
end
