# frozen_string_literal: true

require 'rails_helper'

describe GbvKpiCalculationService do
  include FormAndFieldHelper

  before :each do
    clean_data(FormSection)

    form(:action_plan, [
      field(:test)
    ])
  end

  describe "#form_responses" do
    it "should return a FormSectionResponseList when data isn't present" do
      form_responses = GbvKpiCalculationService.new(Child.new).
        form_responses(:action_plan)

      expect(form_responses).to be_a(FormSectionResponseList)
      # the record replaces any responses if no responses exist under the
      # assumption that the form represents a slice of data on the record itself.
      expect(form_responses.count).to eql(1)
    end

    it "should return an array of forms if a form is present" do
      form_responses = GbvKpiCalculationService.new(Child.new(data: {
        action_plan: [{
          test: 'test'
        }]
      })).form_responses(:action_plan)

      expect(form_responses.count).to eql(1)
    end
  end

  after :each do
    clean_data(FormSection)
  end
end
