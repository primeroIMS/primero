# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::ApprovalsController, type: :request do
  include ActiveJob::TestHelper
  before :each do
    clean_data(PrimeroModule, SystemSettings)
    SystemSettings.create!(
      default_locale: 'en',
      approval_forms_to_alert: {
        'cp_bia_form' => 'assessment',
        'cp_case_plan' => 'case_plan',
        'closure_form' => 'closure'
      }
    )
    SystemSettings.current(true)

    @primero_module = PrimeroModule.new(name: 'CP', selectable_approval_types: true)
    @primero_module.save(validate: false)

    @user1 = User.new(user_name: 'user1', role: @role)
    @user1.save(validate: false)

    @case = Child.create(
      data: {
        name: 'Test',
        owned_by: 'user1',
        module_id: @primero_module.unique_id
      }
    )
  end

  shared_examples 'request for the record' do
    it 'should successfully be requested' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REQUESTED, approval_type: } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      expect(json['data']['record']['approval_subforms'][0]['approval_requested_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][0]['requested_by']).to eq(fake_user_name)
      expect(json['data']['record']['approval_subforms'][0]['approval_status']).to eq(
        Approval::APPROVAL_STATUS_REQUESTED
      )
      expect(json['data']['record']['approval_subforms'][0]['approval_date']).to eq(Date.today.to_s)
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to eq(approval_type)
        expect(audit_params['action']).to eq([approval_type, Approval::APPROVAL_STATUS_REQUESTED].join('_'))
      else
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to be_nil
      end
    end
  end

  shared_examples 'approve for the record' do
    before do
      @case.case_plan_approval_type = approval_type
      @case.approval_subforms = [{
        unique_id: 'aa8af9a2-3b98-11ea-b77f-2e728ce88125',
        approval_requested_for: 'request',
        approval_date: Date.today,
        approval_status: Approval::APPROVAL_STATUS_PENDING
      }]
      @case.save!
    end

    it 'should successfully be approved' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_APPROVED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(2)
      expect(json['data']['record']['approval_subforms'][1]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][1]['approval_status']).to eq(
        Approval::APPROVAL_STATUS_APPROVED
      )
      expect(json['data']['record']['approval_subforms'][1]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][1]['approved_by']).to eq(fake_user_name)
      expect(json['data']['record']['approval_subforms'][1]['approval_manager_comments']).to eq(params[:data][:notes])
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to be_nil
      end
    end

    it 'successfully approves own cases' do
      login_for_test(
        user_name: 'user1',
        permissions:[
          Permission.new(resource: Permission::CASE, actions: [approval_permission, Permission::SELF_APPROVE])
        ]
      )

      params = { data: { approval_status: Approval::APPROVAL_STATUS_APPROVED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(2)
      expect(json['data']['record']['approval_subforms'][1]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][1]['approval_status']).to eq(
        Approval::APPROVAL_STATUS_APPROVED
      )
      expect(json['data']['record']['approval_subforms'][1]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][1]['approved_by']).to eq('user1')
      expect(json['data']['record']['approval_subforms'][1]['approval_manager_comments']).to eq(params[:data][:notes])
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to be_nil
      end
    end

    it 'should successfully be approved without previous approvals' do
      @case.approval_subforms = nil
      @case.save!
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])
      params = { data: { approval_status: Approval::APPROVAL_STATUS_APPROVED, notes: 'some notes' } }
      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to be_nil
      end
    end
  end

  shared_examples 'reject for the record' do
    before do
      @case.case_plan_approval_type = approval_type
      @case.approval_subforms = [{
        unique_id: 'aa8af9a2-3b98-11ea-b77f-2e728ce88125',
        approval_requested_for: 'request',
        approval_date: Date.today,
        approval_status: Approval::APPROVAL_STATUS_PENDING
      }]
      @case.save!
    end

    it 'should successfully be rejected without previous approvals' do
      @case.approval_subforms = nil
      @case.save!
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])
      params = { data: { approval_status: Approval::APPROVAL_STATUS_REJECTED, notes: 'some notes' } }
      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to be_nil
      end
    end

    it 'should successfully be rejected' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REJECTED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(2)
      expect(json['data']['record']['approval_subforms'][1]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][1]['approval_status']).to eq(
        Approval::APPROVAL_STATUS_REJECTED
      )
      expect(json['data']['record']['approval_subforms'][1]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][1]['approved_by']).to eq(fake_user_name)
      expect(json['data']['record']['approval_subforms'][1]['approval_manager_comments']).to eq(params[:data][:notes])
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to be_nil
      end
    end

    it 'successfully rejects own cases' do
      login_for_test(
        user_name: 'user1',
        permissions:[
          Permission.new(resource: Permission::CASE, actions: [approval_permission, Permission::SELF_APPROVE])
        ]
      )

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REJECTED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(2)
      expect(json['data']['record']['approval_subforms'][1]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][1]['approval_status']).to eq(
        Approval::APPROVAL_STATUS_REJECTED
      )
      expect(json['data']['record']['approval_subforms'][1]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][1]['approved_by']).to eq('user1')
      expect(json['data']['record']['approval_subforms'][1]['approval_manager_comments']).to eq(params[:data][:notes])
      if approval_id == Approval::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][1]['approval_for_type']).to be_nil
      end
    end
  end

  shared_examples 'forbidden approval request' do
    it 'returns forbidden if user does not have permission to request' do
      login_for_test(permissions:
        [
          Permission.new(
            resource: Permission::CASE, actions: ["Permission::APPROVE_#{approval_id.upcase}".constantize.to_sym]
          )
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REQUESTED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/#{approval_id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  shared_examples 'forbidden approval' do
    it 'returns forbidden if user does not have permission to request' do
      login_for_test(permissions:
        [
          Permission.new(
            resource: Permission::CASE,
            actions: ["Permission::REQUEST_APPROVAL_#{approval_id.upcase}".constantize.to_sym]
          )
        ])

      params = { data: { approval_status:, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/#{approval_id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns forbidden if a user can not approve its own cases' do
      login_for_test(
        user_name: 'user1', permissions:[Permission.new(resource: Permission::CASE, actions: [approval_permission])]
      )

      params = { data: { approval_status: Approval::APPROVAL_STATUS_APPROVED, notes: 'some notes' } }

      patch("/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/#{approval_id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  let(:json) { JSON.parse(response.body) }
  let(:approval_type) { nil }
  let(:audit_params) { enqueued_jobs.find { |job| job[:job] == AuditLogJob }[:args].first }

  describe 'PATCH /api/v2/case/:id/:approval_id' do
    context 'when the approval_id is ASSESSMENT' do
      let(:approval_id) { Approval::ASSESSMENT }

      it_behaves_like 'request for the record' do
        let(:approval_permission) { Permission::REQUEST_APPROVAL_ASSESSMENT }
      end

      it_behaves_like 'approve for the record' do
        let(:approval_permission) { Permission::APPROVE_ASSESSMENT }
      end

      it_behaves_like 'reject for the record' do
        let(:approval_permission) { Permission::APPROVE_ASSESSMENT }
      end

      it_behaves_like 'forbidden approval request'

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_ASSESSMENT }
        let(:approval_status) { Approval::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_ASSESSMENT }
        let(:approval_status) { Approval::APPROVAL_STATUS_REJECTED }
      end
    end

    context 'when the approval_id is CASE_PLAN' do
      let(:approval_id) { Approval::CASE_PLAN }
      let(:approval_type) { Approval::CASE_PLAN }

      it_behaves_like 'request for the record' do
        let(:approval_permission) { Permission::REQUEST_APPROVAL_CASE_PLAN }
      end

      it_behaves_like 'approve for the record' do
        let(:approval_permission) { Permission::APPROVE_CASE_PLAN }
      end

      it_behaves_like 'reject for the record' do
        let(:approval_permission) { Permission::APPROVE_CASE_PLAN }
      end

      it_behaves_like 'forbidden approval request'

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_CASE_PLAN }
        let(:approval_status) { Approval::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_CASE_PLAN }
        let(:approval_status) { Approval::APPROVAL_STATUS_REJECTED }
      end
    end

    context 'when the approval_id is CLOSURE' do
      let(:approval_id) { Approval::CLOSURE }
      it_behaves_like 'request for the record' do
        let(:approval_permission) { Permission::REQUEST_APPROVAL_CLOSURE }
      end

      it_behaves_like 'approve for the record' do
        let(:approval_permission) { Permission::APPROVE_CLOSURE }
      end

      it_behaves_like 'reject for the record' do
        let(:approval_permission) { Permission::APPROVE_CLOSURE }
      end

      it_behaves_like 'forbidden approval request'

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_CLOSURE }
        let(:approval_status) { Approval::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_permission) { Permission::APPROVE_CLOSURE }
        let(:approval_status) { Approval::APPROVAL_STATUS_REJECTED }
      end
    end

    it 'should return 404 not found if the record_id does not exist' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_ASSESSMENT])
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REQUESTED } }

      patch('/api/v2/cases/77ad6b98-3c5e-11ea-b77f-2e728ce88125/approvals/assessment', params:)

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['status']).to eq(404)
      expect(json['errors'][0]['resource']).to eq(
        '/api/v2/cases/77ad6b98-3c5e-11ea-b77f-2e728ce88125/approvals/assessment'
      )
      expect(json['errors'][0]['message']).to eq('Not Found')
    end

    it 'should return 404 not found if the approval_id does not exist' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_ASSESSMENT])
        ])

      params = { data: { approval_status: Approval::APPROVAL_STATUS_REQUESTED } }

      patch("/api/v2/cases/#{@case.id}/approvals/unknown-approval-id", params:)

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['status']).to eq(404)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/unknown-approval-id")
      expect(json['errors'][0]['message']).to eq('Not Found')
    end

    it 'should return 422 not found if the approval_status does not exist' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_ASSESSMENT])
        ])

      params = { data: { approval_status: 'open' } }

      patch("/api/v2/cases/#{@case.id}/approvals/assessment", params:)

      expect(response).to have_http_status(422)
      expect(json['errors'][0]['status']).to eq(422)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/assessment")
      expect(json['errors'][0]['message']).to eq('approvals.error_invalid_status')
    end
  end

  after :each do
    clear_enqueued_jobs
    clean_data(SystemSettings, PrimeroModule, UserGroup, Role, User, Child)
  end
end
