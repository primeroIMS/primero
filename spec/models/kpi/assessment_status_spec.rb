# frozen_string_literal: true

require 'rails_helper'

describe KPI::AssessmentStatus, search: true do
  include FormAndFieldHelper

  let(:from) { DateTime.parse('2020/10/26') }
  let(:to) { DateTime.parse('2020/10/31') }

  describe '#to_json' do
    with '1 case with a filled out survivor assessment form' do
      before do
        clean_data(Child, FormSection, Field)

        form(:survivor_assessment_form, [
          field(:assessment_emotional_state_start, mandatory_for_completion: true),
          field(:assessment_emotional_state_end, mandatory_for_completion: true),
          field(:assessment_presenting_problem, mandatory_for_completion: true),
          field(:assessment_main_concerns, mandatory_for_completion: true),
          field(:assessment_current_situation, mandatory_for_completion: true)
        ])

        child = Child.create!({
          data: {
            survivor_assessment_form: [{
              assessment_emotional_state_start: 'Overwhelmed',
              assessment_emotional_state_end: 'Resilient',
              assessment_presenting_problem: 'Anxiety',
              assessment_main_concerns: 'Poor sales',
              assessment_current_situation: 'Poor'
            }]
          }
        })
        child.update(created_at: from + 1)
        Sunspot.commit
      end

      it 'should return data that indicates that 100% are completed' do
        json = KPI::AssessmentStatus.new(from, to).to_json
        expect(json[:data][:completed]).to eql(1.0)
      end

      after do
        clean_data(Child, FormSection, Field)
      end
    end
  end
end
