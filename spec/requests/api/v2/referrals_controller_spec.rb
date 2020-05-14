# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ReferralsController, type: :request do
  include ActiveJob::TestHelper
  before :each do
    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_refer_case = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::REFERRAL, Permission::RECEIVE_REFERRAL
      ]
    )
    @role = Role.new(permissions: [@permission_refer_case], modules: [@primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @case_a = Child.create(
      data: {
        name: 'Test', owned_by: 'user1',
        disclosure_other_orgs: true, consent_for_services: true,
        module_id: @primero_module.unique_id
      }
    )
    @case_b = Child.create(
      data: {
        name: 'Test', owned_by: 'user1',
        disclosure_other_orgs: true, consent_for_services: true,
        module_id: @primero_module.unique_id, services_section: [
          {
            service_type: 'Test type', service_implementing_agency_individual: @user1.user_name, service_provider: true
          }
        ]
      }
    )
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.select { |job| job.values.first == AuditLogJob }.first[:args].first }

  describe 'GET /api/v2/case/:id/referrals' do
    before :each do
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_a)
    end

    it 'lists the referrals for a case' do
      sign_in(@user2)
      get "/api/v2/cases/#{@case_a.id}/referrals"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq(@case_a.id.to_s)
      expect(json['data'][0]['transitioned_to']).to eq('user2')
      expect(json['data'][0]['transitioned_by']).to eq('user1')

      expect(audit_params['action']).to eq('show_referrals')
    end

    it "get a forbidden message if the user doesn't have view permission" do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case_a.id}/referrals"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case_a.id}/referrals")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/case/:id/referrals' do
    it 'refers a the record to the target user' do
      sign_in(@user1)
      params = { data: { transitioned_to: 'user2', notes: 'Test Notes' } }
      post "/api/v2/cases/#{@case_a.id}/referrals", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')

      expect(audit_params['action']).to eq('refer')
    end

    it "get a forbidden message if the user doesn't have referral permission" do
      login_for_test
      params = { data: { transitioned_to: 'user2', notes: 'Test Notes' } }
      post "/api/v2/cases/#{@case_a.id}/referrals", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case_a.id}/referrals")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'testing the mark_service_object_referred method' do
      sign_in(@user1)
      params = {
        data: {
          transitioned_to: 'user2', notes: 'Test Notes',
          service_record_id: @case_b.data['services_section'][0]['unique_id']
        }
      }
      post "/api/v2/cases/#{@case_b.id}/referrals", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record']['services_section'][0]['service_status_referred']).to be_truthy
      expect(json['data']['record_id']).to eq(@case_b.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')

      expect(audit_params['action']).to eq('refer')
    end
  end

  describe 'POST /api/v2/case/referrals' do
    before :each do
      @case_a2 = Child.create(
        data: {
          name: 'Test2', owned_by: 'user1',
          disclosure_other_orgs: true, consent_for_services: true,
          module_id: @primero_module.unique_id
        }
      )
    end

    it 'refers multiple records to the target user' do
      sign_in(@user1)
      params = { data: { ids: [@case_a.id, @case_a2.id], transitioned_to: 'user2', notes: 'Test Notes' } }
      post '/api/v2/cases/referrals', params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['record_id']).to eq(@case_a.id.to_s)
      expect(json['data'][0]['transitioned_to']).to eq('user2')
      expect(json['data'][0]['transitioned_by']).to eq('user1')
      expect(json['data'][1]['record_id']).to eq(@case_a2.id.to_s)
      expect(json['data'][1]['transitioned_to']).to eq('user2')
      expect(json['data'][1]['transitioned_by']).to eq('user1')
    end
  end

  describe 'DELETE /api/v2/cases/:id/referrals/:referral_id' do
    before :each do
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_a)
    end

    it 'completes this referral' do
      sign_in(@user1)
      delete "/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_DONE)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')

      expect(audit_params['action']).to eq('refer_revoke')

      @case_a.reload
      expect(@case_a.assigned_user_names).to_not include('user2')
    end
  end

  after :each do
    clear_enqueued_jobs
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition)
  end
end
