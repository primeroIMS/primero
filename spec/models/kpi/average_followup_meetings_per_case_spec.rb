# frozen_string_literal: true

require 'rails_helper'

describe KPI::AverageFollowupMeetingsPerCase, search: true do
  include FormAndFieldHelper

  let(:from) { DateTime.parse('2020/10/26') }
  let(:to) { DateTime.parse('2020/10/31') }

  describe '#to_json' do
    with '1 case with 3 meetings inside the time period' do
      before do
        clean_data(Child, FormSection, Field)

        form(:action_plan_form, [
          field(:gbv_follow_up_subform_section,
                subform_section: form(:gbv_follow_up_subform_section, [
                  field(:followup_date)
          ]))
        ])

        Child.create!({
          data: {
            action_plan_form: [{
              gbv_follow_up_subform_section: [{
                followup_date: from - 10
              }, {
                followup_date: from + 2
              }, {
                followup_date: from + 3
              }, {
                followup_date: from + 4
              }]
            }]
          }
        })

        Sunspot.commit
      end

      it 'should return data that indicates that 100% are completed' do
        json = KPI::AverageFollowupMeetingsPerCase.new(from, to).to_json
        expect(json[:data][:average_meetings]).to eql(3.0)
      end

      after do
        clean_data(Child, FormSection, Field)
      end
    end
  end
end
