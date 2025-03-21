# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Workflow do
  before do
    clean_data(FormSection, Lookup, PrimeroModule)
    lookup = Lookup.create!(
      unique_id: 'lookup-service-response-type',
      name: 'Service Response Type',
      locked: true,
      lookup_values: [
        { id: 'care_plan', display_text: 'Care plan' }.with_indifferent_access,
        { id: 'action_plan', display_text: 'Action plan' }.with_indifferent_access,
        { id: 'service_provision', display_text: 'Service provision' }.with_indifferent_access
      ]
    )
    @lookups = [lookup]

    @module = PrimeroModule.new(
      name: 'Test Module A',
      form_sections: [],
      module_options: {
        use_workflow_case_plan: true,
        use_workflow_assessment: true
      }
    )
  end

  describe 'workflow_statuses' do
    it 'returns a workflow status hash list' do
      status_list = Child.workflow_statuses(@module)[:en]
      expect(status_list).to include(include('id' => Workflow::WORKFLOW_NEW))
      expect(status_list).to include(include('id' => Workflow::WORKFLOW_REOPENED))
      expect(status_list).to include(include('id' => 'care_plan'))
      expect(status_list).to include(include('id' => 'action_plan'))
      expect(status_list).to include(include('id' => 'service_provision'))
      expect(status_list).to include(include('id' => Workflow::WORKFLOW_CLOSED))
    end

    context 'and module does not use workflow_assessment' do
      before do
        @module.use_workflow_assessment = false
      end

      it 'does not include Workflow Assessment in the status list' do
        expect(Child.workflow_statuses(@module)[:en]).not_to(
          include(include('id' => Workflow::WORKFLOW_ASSESSMENT))
        )
      end
    end

    context 'and module use workflow_assessment' do
      before do
        @module.use_workflow_assessment = true
      end

      it 'does include Workflow Assessment in the status list' do
        expect(Child.workflow_statuses(@module)[:en]).to(
          include(include('id' => Workflow::WORKFLOW_ASSESSMENT))
        )
      end
      it 'return assesment from app strings' do
        assessment_status_text = Child.workflow_statuses(@module)[:en]
                                      &.find { |lkp| lkp['id'] == Workflow::WORKFLOW_ASSESSMENT }
                                      &.dig('display_text')
        expect(assessment_status_text).to eq('Assessment')
      end
    end

    context 'when assessment value is present on workflow lookup' do
      before do
        clean_data(Lookup)
        Lookup.create!(
          unique_id: 'lookup-workflow',
          name_i18n: { en: 'Workflow' },
          lookup_values_i18n: [
            { id: 'case_plan', display_text: { en: 'Case Plan LK' } },
            { id: 'assessment', display_text: { en: 'Assessment LK' } }
          ]
        )
      end
      it 'return assesment from Lookup' do
        assessment_status_text = Child.workflow_statuses(@module)[:en]
                                      &.find { |lkp| lkp['id'] == Workflow::WORKFLOW_ASSESSMENT }
                                      &.dig('display_text')
        expect(assessment_status_text).to eq('Assessment LK')
      end

      it 'return status that include text from workflow lookup' do
        workflow_status = Child.workflow_statuses(@module)[:en].map { |lk| lk['display_text'] }

        expect(workflow_status).to match_array(['New', 'Reopened', 'Assessment LK', 'Case Plan LK', 'Closed'])
      end
      after do
        clean_data(Lookup)
      end
    end
  end

  describe 'calculate_workflow' do
    before do
      clean_data(FormSection, Lookup, PrimeroModule)

      Lookup.create(
        id: 'lookup-service-response-type',
        name: 'Service Response Type',
        locked: true,
        lookup_values: [
          { id: 'care_plan', display_text: 'Care plan' }.with_indifferent_access,
          { id: 'action_plan', display_text: 'Action plan' }.with_indifferent_access,
          { id: 'service_provision', display_text: 'Service provision' }.with_indifferent_access
        ]
      )
      form_section_a = create(:form_section, unique_id: 'A', name: 'A')
      form_section_b = create(:form_section, unique_id: 'B', name: 'B')

      a_module = PrimeroModule.new(
        associated_record_types: ['case'],
        name: 'Test Module',
        form_sections: [form_section_a, form_section_b],
        module_options: {
          use_workflow_case_plan: true,
          use_workflow_assessment: true
        }
      )
      user = User.new(user_name: 'bob123')
      @case1 = Child.new_with_user user, name: 'Workflow Tester'
      @case1.stub(:module).and_return(a_module)
      @case1.save
    end

    context 'when case is new' do
      it 'workflow status should be NEW' do
        expect(@case1.workflow).to eq(Workflow::WORKFLOW_NEW)
      end
    end

    context 'when case is open' do
      before :each do
        @case1.status = Record::STATUS_OPEN
      end

      context 'and date assesment initiated is set' do
        before :each do
          @case1.assessment_requested_on = Date.current
          @case1.save
        end

        it 'workflow status should be ASSESMENT' do
          expect(@case1.workflow).to eq(Workflow::WORKFLOW_ASSESSMENT)
        end
      end

      context 'and date case plan initiated is set' do
        before do
          @case1.date_case_plan = Date.current
          @case1.save
        end

        it 'workflow status should be CASE PLAN' do
          expect(@case1.workflow).to eq(Workflow::WORKFLOW_CASE_PLAN)
        end
      end

      context 'and service response type is set' do
        before do
          @case1.services_section = [
            { 'service_response_type' => 'action_plan', 'service_implemented' => Serviceable::SERVICE_NOT_IMPLEMENTED }
          ]
          @case1.save!
        end
        it 'workflow status should be the response type of the service' do
          expect(@case1.workflow).to eq('action_plan')
        end
      end

      context 'and service response type is not set' do
        context 'and case has been reopened' do
          before do
            @case1.case_status_reopened = true
            @case1.save
          end
          it 'workflow status should be REOPENED' do
            expect(@case1.workflow).to eq(Workflow::WORKFLOW_REOPENED)
          end
        end
      end

      context 'and service response type is set' do
        before do
          @case1.services_section = [
            {
              'service_response_type' => 'service_provision', 'service_response_day_time' => DateTime.now,
              'service_type' => 'shelter_service'
            }
          ]
          @case1.save!
        end
        it 'workflow status should be service_provision' do
          expect(@case1.workflow).to eq('service_provision')
        end
      end
    end

    context 'when case is closed' do
      before do
        @case1.status = Record::STATUS_CLOSED
        @case1.save!
      end

      it 'workflow status should be CLOSED' do
        expect(@case1.workflow).to eq(Workflow::WORKFLOW_CLOSED)
      end
    end

    context 'when case is reopened' do
      before :each do
        @case1.status = Record::STATUS_CLOSED
        @case1.save!
      end

      context 'and case has been reopened' do
        before :each do
          @case1.case_status_reopened = true
          @case1.status = Record::STATUS_OPEN
          @case1.save!
        end

        it 'workflow status should be REOPENED' do
          expect(@case1.status).to eq(Record::STATUS_OPEN)
          expect(@case1.workflow).to eq(Workflow::WORKFLOW_REOPENED)
        end
      end
    end
  end
end
