# frozen_string_literal: true

require 'rails_helper'

describe Kpi::TimeFromCaseOpenToClose, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2019/01/01')) }
  let(:to) { indexed_field(DateTime.parse('2020/12/31')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:gbv_case_closure_form, [
           field(:created_at),
           field(:date_closure)
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2019/10/15'),
                    status: Record::STATUS_CLOSED,
                    owned_by_groups: [group2],
                    date_closure: DateTime.parse('2020/10/01')
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    owned_by_groups: [group3],
                    status: Record::STATUS_CLOSED,
                    created_at: DateTime.parse('2020/05/15'),
                    date_closure: DateTime.parse('2020/10/01')
                  })

    Sunspot.commit
  end

  with 'No cases in the users group' do
    it 'should return 0 for all time periods' do
      json = Kpi::TimeFromCaseOpenToClose.new(from, to, [group1]).to_json
      delays = json[:data].map { |delay| delay.map(&:second) }.to_h
      expect(delays['1-month'].nan?).to be(true)
      expect(delays['1-3months'].nan?).to be(true)
      expect(delays['3-6months'].nan?).to be(true)
      expect(delays['7-months'].nan?).to be(true)
    end
  end

  with 'One case with almost a year between creation and closure.' do
    it 'should return 1.0 in  > 6 months' do
      json = Kpi::TimeFromCaseOpenToClose.new(from, to, [group2]).to_json
      delays = json[:data].map { |delay| delay.map(&:second) }.to_h
      expect(delays['1-month']).to eq(0.0)
      expect(delays['1-3months']).to eq(0.0)
      expect(delays['3-6months']).to eq(0.0)
      expect(delays['7-months']).to be(1.0)
    end
  end

  with 'Two cases one with a year and 1 with 5 months between open and closure' do
    it 'should return 0.5 in > 6 months and 0.5 in 3-6 months' do
      json = Kpi::TimeFromCaseOpenToClose.new(from, to, [group2, group3]).to_json
      delays = json[:data].map { |delay| delay.map(&:second) }.to_h
      expect(delays['1-month']).to eq(0.0)
      expect(delays['1-3months']).to eq(0.0)
      expect(delays['3-6months']).to eq(0.5)
      expect(delays['7-months']).to be(0.5)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
