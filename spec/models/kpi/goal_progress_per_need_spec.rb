# frozen_string_literal: true

require 'rails_helper'

describe KPI::GoalProgressPerNeed, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  let(:from) { indexed_field(DateTime.parse('2020/09/01')) }
  let(:to) { indexed_field(DateTime.parse('2020/11/01')) }
  let(:group1) { 'group1' }
  let(:group2) { 'group2' }
  let(:group3) { 'group3' }

  before :each do
    clean_data(Child, FormSection, Field)

    form(:action_plan_form, [
      field(:gbv_follow_up_subform_section, {
        subform_section: form(:gbv_follow_up_subform_section, [
          field(:gbv_assessment_progress_safety),
          field(:gbv_assessment_progress_health),
          field(:gbv_assessment_progress_psychosocial),
          field(:gbv_assessment_progress_justice),
          field(:gbv_assessment_other_goals)
        ])
      })
    ])

    Child.create!({ data: {
      created_at: DateTime.parse('2020/10/15'),
      owned_by_groups: [group2],
      gbv_follow_up_subform_section: [{
        gbv_assessment_progress_safety: 'n_a',
        gbv_assessment_progress_health: 'in_progress',
        gbv_assessment_progress_psychosocial: 'in_progress',
        gbv_assessment_progress_justice: 'met',
        gbv_assessment_other_goals: 'met'
      }]
    }})

    Child.create!({ data: {
      created_at: DateTime.parse('2020/10/15'),
      owned_by_groups: [group3],
      gbv_follow_up_subform_section: [{
        gbv_assessment_progress_safety: 'met',
        gbv_assessment_progress_health: 'in_progress',
        gbv_assessment_progress_psychosocial: 'in_progress',
        gbv_assessment_progress_justice: 'in_progress',
        gbv_assessment_other_goals: 'met'
      }]
    }})
    Sunspot.commit
  end

  with 'No cases in the users group' do
    it 'should return 0 progress for all goals' do
      json = KPI::GoalProgressPerNeed.new(from, to, [group1]).to_json
      json[:data].each do |goal|
        expect(goal[:percentage]).to eq(0.0)
      end
    end
  end

  with 'A single case with some goals completed' do
    it 'should return 1.0 progress for all completed goals' do
      json = KPI::GoalProgressPerNeed.new(from, to, [group2]).to_json
      goals = json[:data].map { |goal| goal.map(&:second) }.to_h
      expect(goals['Safety']).to eq(0.0)
      expect(goals['Health']).to eq(0.0)
      expect(goals['Psychosocial']).to eq(0.0)
      expect(goals['Justice']).to eq(1.0)
      expect(goals['Other']).to eq(1.0)
    end
  end

  with 'A two cases with some goals completed' do
    it 'should return 1.0 progress for all completed goals, 0.5 for goals only completed by one case' do
      json = KPI::GoalProgressPerNeed.new(from, to, [group2, group3]).to_json
      goals = json[:data].map { |goal| goal.map(&:second) }.to_h
      expect(goals['Safety']).to eq(1.0)
      expect(goals['Health']).to eq(0.0)
      expect(goals['Psychosocial']).to eq(0.0)
      expect(goals['Justice']).to eq(0.5)
      expect(goals['Other']).to eq(1.0)
    end
  end

  after :each do
    clean_data(Child, FormSection, Field)
  end
end
