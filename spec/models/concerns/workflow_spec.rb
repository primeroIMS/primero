require 'spec_helper'

class TestWorkflowClass < CouchRest::Model::Base
  include Workflow
end

describe Workflow do
  before do
    lookup = Lookup.new(:id => "lookup-service-response-type",
                   :name => "Service Response Type",
                   :locked => true,
                   :lookup_values => [
                       {id: "care_plan", display_text: "Care plan"}.with_indifferent_access,
                       {id: "action_plan", display_text: "Action plan"}.with_indifferent_access,
                       {id: "service_provision", display_text: "Service provision"}.with_indifferent_access
                   ])
    @lookups = [lookup]

    @module_a = PrimeroModule.new(
        program_id: "module_a",
        associated_record_types: ['case'],
        name: "Test Module A",
        associated_form_ids: [],
        use_workflow_case_plan: true,
        use_workflow_assessment: true
    )

    @module_b = PrimeroModule.new(
        program_id: "module_b",
        associated_record_types: ['case'],
        name: "Test Module B",
        associated_form_ids: [],
        use_workflow_case_plan: true,
        use_workflow_assessment: true
    )
  end

  describe 'workflow_statuses' do
    context 'when there are multiple modules' do
      before do
        @modules = [@module_a, @module_b]
      end

      it 'returns a workflow status hash list' do
        status_list = TestWorkflowClass.workflow_statuses(@modules, @lookups)
        expect(status_list).to include(include('id' => Workflow::WORKFLOW_NEW))
        expect(status_list).to include(include('id' => Workflow::WORKFLOW_REOPENED))
        expect(status_list).to include(include('id' => 'care_plan'))
        expect(status_list).to include(include('id' => 'action_plan'))
        expect(status_list).to include(include('id' => 'service_provision'))
        expect(status_list).to include(include('id' => Workflow::WORKFLOW_CLOSED))
      end

      context 'and no modules use workflow_assessment' do
        before do
          @module_a.use_workflow_assessment = false
          @module_b.use_workflow_assessment = false
        end

        it 'does not include Workflow Assessment in the status list' do
          expect(TestWorkflowClass.workflow_statuses(@modules, @lookups)).not_to include(include('id' => Workflow::WORKFLOW_ASSESSMENT))
        end
      end

      context 'and one modules uses workflow_assessment' do
        before do
          @module_a.use_workflow_assessment = true
          @module_b.use_workflow_assessment = false
        end

        it 'does include Workflow Assessment in the status list' do
          expect(TestWorkflowClass.workflow_statuses(@modules, @lookups)).to include(include('id' => Workflow::WORKFLOW_ASSESSMENT))
        end
      end

      context 'and both modules use workflow_assessment' do
        before do
          @module_a.use_workflow_assessment = true
          @module_b.use_workflow_assessment = true
        end

        it 'does include Workflow Assessment in the status list' do
          expect(TestWorkflowClass.workflow_statuses(@modules, @lookups)).to include(include('id' => Workflow::WORKFLOW_ASSESSMENT))
        end
      end
    end
  end

  describe 'workflow_sequence_strings' do
    before do
      @test_obj = TestWorkflowClass.new
      @test_obj.stub(:module).and_return(@module_a)
      @test_obj.stub(:case_status_reopened).and_return(false)
    end

    it 'returns a list of workflow strings' do
      workflow_strings = @test_obj.workflow_sequence_strings(@lookups)
      expect(workflow_strings).to include(["Care plan", "care_plan"])
      expect(workflow_strings).to include(["Action plan", "action_plan"])
      expect(workflow_strings).to include(["Service provision", "service_provision"])
      expect(workflow_strings).to include(["Closed", "closed"])
    end

    #TODO: WARNING - there is Case specific logic in this concern
    context 'when a case has been reopened' do
      before do
        @test_obj.stub(:case_status_reopened).and_return(true)
      end

      it 'returns a list of workflow strings having REOPENED' do
        expect(@test_obj.workflow_sequence_strings(@lookups)).to include(["Reopened", "reopened"])
      end

      it 'returns a list of workflow strings not having NEW' do
        expect(@test_obj.workflow_sequence_strings(@lookups)).not_to include(["New", "new"])
      end
    end

    context 'when a case has not been reopened' do
      before do
        @test_obj.stub(:case_status_reopened).and_return(false)
      end

      it 'returns a list of workflow strings not having REOPENED' do
        expect(@test_obj.workflow_sequence_strings(@lookups)).not_to include(["Reopened", "reopened"])
      end

      it 'returns a list of workflow strings having NEW' do
        expect(@test_obj.workflow_sequence_strings(@lookups)).to include(["New", "new"])
      end
    end
  end
end