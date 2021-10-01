# frozen_string_literal: true

require 'rails_helper'

describe GBVKpiCalculationService do
  include FormAndFieldHelper

  before :each do
    clean_data(FormSection)

    form(:action_plan_form, [
      field(:test),
      field(:action_plan_section, {
        subform_section: form(:action_plan_section, [
          field(:test, mandatory_for_completion: true)
        ])
      })
    ])
  end

  describe 'Performance' do
    describe '#completed_action_plan' do
      it 'should only use two queries' do
        kpis = GBVKpiCalculationService.new(Child.new)

        expect { kpis.completed_action_plan }.to make_queries(2)
      end
    end
  end

  describe '#form_responses' do
    it "should return a FormSectionResponseList when data isn't present" do
      form_responses = GBVKpiCalculationService.new(Child.new)
                                               .form_responses(:action_plan_form)

      expect(form_responses).to be_a(FormSectionResponseList)
      # the record replaces any responses if no responses exist under the
      # assumption that the form represents a slice of data on the record itself.
      expect(form_responses.count).to eql(1)
    end

    it 'should return an array of forms if a form is present' do
      form_responses = GBVKpiCalculationService.new(Child.new(data: {
                                                                action_plan_form: [{
                                                                  test: 'test'
                                                                }]
                                                              })).form_responses(:action_plan_form)

      expect(form_responses.count).to eql(1)
    end
  end

  describe 'fetching subforms that don\'t exist from form_section_responses' do
    it 'should return an empty form_section_response_list' do
      responses = GBVKpiCalculationService
                  .new(Child.new(data: { action_plan_form: [] }))
                  .form_responses(:action_plan_form)
                  .subform(:test)

      expect(responses.count).to eql(0)
    end
  end

  after :each do
    clean_data(FormSection)
  end
end
