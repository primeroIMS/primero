# frozen_string_literal: true

require 'rails_helper'

describe Kpi::ReportingDelay, search: true do
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
    clean_data(Location, Incident)

    @london = Location.create!(
      location_code: '41',
      name: 'London',
      placename: 'London',
      type: 'County',
      hierarchy_path: 'GBR.01.41',
      admin_level: 2
    )

    Incident.create!(data: {
                       module_id: PrimeroModule::GBV,
                       owned_by_location: @london.location_code,
                       owned_by_groups: [group1],
                       date_of_first_report: DateTime.parse('2020/10/01'),
                       incident_date: DateTime.parse('2019/09/01'),
                       created_at: DateTime.parse('2020/10/01')
                     })

    Incident.create!(data: {
                       module_id: PrimeroModule::GBV,
                       owned_by_location: @london.location_code,
                       owned_by_groups: [group3],
                       date_of_first_report: DateTime.parse('2020/10/01'),
                       incident_date: DateTime.parse('2020/09/15'),
                       created_at: DateTime.parse('2020/10/01')
                     })

    Sunspot.commit
  end

  with 'No incidents owned by users group' do
    it 'should return no data for each of the 6 time periods' do
      json = Kpi::ReportingDelay.new(from, to, [group2]).to_json
      json[:data].each do |period|
        expect(period[:total_incidents]).to eq(0)
      end
    end
  end

  with 'An incident owned by the users group with > 3 months reporting delay' do
    it 'should produce a count of 1 for > 3 months' do
      json = Kpi::ReportingDelay.new(from, to, [group1]).to_json
      expect(json[:data].last[:total_incidents]).to eq(1)
      expect(json[:data][-3][:total_incidents]).to eq(0)
    end
  end

  with 'An incident owned by the users group with 15 - 30 days reporting delay' do
    it 'should produce a count of 1 for 15 - 30 days' do
      json = Kpi::ReportingDelay.new(from, to, [group3]).to_json
      expect(json[:data].last[:total_incidents]).to eq(0)
      expect(json[:data][-3][:total_incidents]).to eq(1)
    end
  end

  with 'A user in all groups with incidents' do
    it 'should produce a count of 1 for 15 - 30 days and > 3months' do
      json = Kpi::ReportingDelay.new(from, to, [group1, group3]).to_json
      expect(json[:data].last[:total_incidents]).to eq(1)
      expect(json[:data][-3][:total_incidents]).to eq(1)
    end
  end

  after :each do
    clean_data(Location, Incident)
  end
end
