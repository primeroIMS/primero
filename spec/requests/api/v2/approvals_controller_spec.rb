require 'rails_helper'

describe Api::V2::ApprovalsController, type: :request do
  before :each do
    clean_data(PrimeroModule, SystemSettings)
    SystemSettings.create!(
      default_locale: 'en',
      approval_forms_to_alert: {
        'cp_bia_form' => 'bia',
        'cp_case_plan' => 'case_plan',
        'closure_form' => 'closure'
      }
    )
    SystemSettings.current(true)

    @primero_module = PrimeroModule.new(name: 'CP', selectable_approval_types: true)
    @primero_module.save(validate: false)

    @case = Child.create(
      data: {
        name: 'Test',
        owned_by: 'faketest',
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

      params = { data: { approval_status: Child::APPROVAL_STATUS_REQUESTED, approval_type: approval_type } }

      patch "/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      expect(json['data']['record']['approval_subforms'][0]['approval_requested_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][0]['approval_status']).to eq(Child::APPROVAL_STATUS_REQUESTED)
      expect(json['data']['record']['approval_subforms'][0]['approval_date']).to eq(Date.today.to_s)
      if approval_id == Child::CASE_PLAN
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to eq(approval_type)
      else
        expect(json['data']['record']['approval_subforms'][0]['approval_for_type']).to be_nil
      end
    end
  end

  shared_examples 'approve for the record' do
    before do
      @case.approval_subforms = []
      @case.save!
    end

    it 'should successfully be approved' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])

      params = { data: { approval_status: Child::APPROVAL_STATUS_APPROVED, notes: 'some notes' } }

      patch "/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      expect(json['data']['record']['approval_subforms'][0]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][0]['approval_status']).to eq(Child::APPROVAL_STATUS_APPROVED)
      expect(json['data']['record']['approval_subforms'][0]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][0]['approval_manager_comments']).to eq(params[:data][:notes])
    end
  end

  shared_examples 'reject for the record' do
    before do
      @case.approval_subforms = []
      @case.save!
    end

    it 'should successfully be rejected' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [approval_permission])
        ])

      params = { data: { approval_status: Child::APPROVAL_STATUS_REJECTED, notes: 'some notes' } }

      patch "/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record']['id']).to eq(@case.id.to_s)
      expect(json['data']['record']['approval_subforms'].size).to eq(1)
      expect(json['data']['record']['approval_subforms'][0]['approval_response_for']).to eq(approval_id)
      expect(json['data']['record']['approval_subforms'][0]['approval_status']).to eq(Child::APPROVAL_STATUS_REJECTED)
      expect(json['data']['record']['approval_subforms'][0]['approval_date']).to eq(Date.today.to_s)
      expect(json['data']['record']['approval_subforms'][0]['approval_manager_comments']).to eq(params[:data][:notes])
    end
  end

  shared_examples 'forbidden approval request' do
    it 'returns forbidden if user does not have permission to request' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: ["Permission::APPROVE_#{approval_id.upcase}".constantize.to_sym])
        ])

      params = { data: { approval_status: Child::APPROVAL_STATUS_REQUESTED, notes: 'some notes' } }

      patch "/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params: params

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
          Permission.new(resource: Permission::CASE, actions: ["Permission::REQUEST_APPROVAL_#{approval_id.upcase}".constantize.to_sym])
        ])

      params = { data: { approval_status: approval_status, notes: 'some notes' } }

      patch "/api/v2/cases/#{@case.id}/approvals/#{approval_id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/approvals/#{approval_id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  let(:json) { JSON.parse(response.body) }
  let(:approval_type) { nil }

  describe 'PATCH /api/v2/case/:id/:approval_id' do
    context 'when the approval_id is BIA' do
      let(:approval_id) { Child::BIA }

      it_behaves_like 'request for the record' do
        let(:approval_permission) { Permission::REQUEST_APPROVAL_BIA }
      end

      it_behaves_like 'approve for the record' do
        let(:approval_permission) { Permission::APPROVE_BIA }
      end

      it_behaves_like 'reject for the record' do
        let(:approval_permission) { Permission::APPROVE_BIA }
      end

      it_behaves_like 'forbidden approval request'

      it_behaves_like 'forbidden approval' do
        let(:approval_status) { Child::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_status) { Child::APPROVAL_STATUS_REJECTED }
      end
    end

    context 'when the approval_id is CASE_PLAN' do
      let(:approval_id) { Child::CASE_PLAN }
      let(:approval_type) { 'service_provision' }

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
        let(:approval_status) { Child::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_status) { Child::APPROVAL_STATUS_REJECTED }
      end
    end

    context 'when the approval_id is CLOSURE' do
      let(:approval_id) { Child::CLOSURE }
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
        let(:approval_status) { Child::APPROVAL_STATUS_APPROVED }
      end

      it_behaves_like 'forbidden approval' do
        let(:approval_status) { Child::APPROVAL_STATUS_REJECTED }
      end
    end
  end

  after :each do
    clean_data(SystemSettings, PrimeroModule, UserGroup, Role, User, Child)
  end
end
