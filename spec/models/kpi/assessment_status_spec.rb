# frozen_string_literal: true

require 'rails_helper'

describe Kpi::AssessmentStatus, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/10/26')) }
  let(:to) { indexed_field(DateTime.parse('2020/10/31')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }
  let(:group4) { 'group4' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:survivor_assessment_form, [
           field(:assessment_emotional_state_start, mandatory_for_completion: true),
           field(:assessment_emotional_state_end, mandatory_for_completion: true),
           field(:assessment_presenting_problem, mandatory_for_completion: true),
           field(:assessment_main_concerns, mandatory_for_completion: true),
           field(:assessment_current_situation, mandatory_for_completion: true)
         ])

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group2, group4],
                    assessment_emotional_state_start: 'Overwhelmed',
                    assessment_emotional_state_end: 'Resilient',
                    assessment_presenting_problem: 'Anxiety',
                    assessment_main_concerns: 'Poor sales',
                    assessment_current_situation: 'Poor'
                  })

    Child.create!(data: {
                    module_id: PrimeroModule::GBV,
                    created_at: DateTime.parse('2020/10/27'),
                    owned_by_groups: [group3]
                  })

    Sunspot.commit
  end

  with 'No cases in the users groups with completed assessments' do
    it 'should return 0% completed assessments' do
      json = Kpi::AssessmentStatus.new(from, to, [group1]).to_json
      expect(json[:data][:completed]).to eql(0)
    end
  end

  with 'A single case in the users groups with a completed assessment' do
    it 'should return 100% completed assessments' do
      json = Kpi::AssessmentStatus.new(from, to, [group2]).to_json
      expect(json[:data][:completed]).to eql(1.0)
    end
  end

  with 'A single case in the users groups with a completed assessment' do
    it 'should return 100% completed assessments' do
      json = Kpi::AssessmentStatus.new(from, to, [group2, group3]).to_json
      expect(json[:data][:completed]).to eql(0.5)
    end
  end

  with 'A single case in both users groups with a completed assessment' do
    it 'should return 100% completed assessments' do
      json = Kpi::AssessmentStatus.new(from, to, [group2, group4]).to_json
      expect(json[:data][:completed]).to eql(1.0)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
