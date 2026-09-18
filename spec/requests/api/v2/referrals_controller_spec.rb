# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ReferralsController, type: :request do
  include ActiveJob::TestHelper
  before do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Referral)

    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_refer_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::REFERRAL]
    )
    @permission_receive_referral = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::RECEIVE_REFERRAL]
    )
    @permission_referral_from_service = Permission.new(
      resource: Permission::CASE, actions: [Permission::REFERRAL_FROM_SERVICE]
    )
    @role = Role.new(permissions: [@permission_refer_case], primero_modules: [@primero_module])
    @role.save(validate: false)
    @role_receive = Role.new(permissions: [@permission_receive_referral], primero_modules: [@primero_module])
    @role_receive.save(validate: false)
    @role_service = Role.new(
      permissions: [@permission_referral_from_service],
      primero_modules: [@primero_module],
      unique_id: 'role-receive-referral'
    )
    @role_service.save(validate: false)
    @system_role = Role.new(
      permissions: [@permission_refer_case], primero_modules: [@primero_module], user_category: Role::CATEGORY_SYSTEM
    )
    @system_role.save(validate: false)

    @maintenance_role = Role.new(
      permissions: [@permission_refer_case], primero_modules: [@primero_module], user_category: Role::CATEGORY_MAINTENANCE
    )
    @maintenance_role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role_receive, user_groups: [@group2])
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: @role_service, user_groups: [@group1])
    @user3.save(validate: false)
    @user4 = User.new(user_name: 'user4', role: @system_role, user_groups: [@group1])
    @user4.save(validate: false)
    @user5 = User.new(user_name: 'user5', role: @maintenance_role, user_groups: [@group2])
    @user5.save(validate: false)
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
    @case_c = Child.create(
      data: {
        name: 'Test', owned_by: 'user3',
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
  let(:audit_params) { enqueued_jobs.find { |job| job[:job] == AuditLogJob }[:args].first }

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
      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')

      expect(audit_params['action']).to eq('refer')
    end

    it 'refers the record if it is an external referral' do
      sign_in(@user1)

      params = {
        data: {
          remote: true,
          service: 'alternative_care',
          transitioned_to_agency: 'An external agency',
          transitioned_to_remote: 'An external user'
        }
      }

      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['type']).to eq('Referral')
      expect(json['data']['user_can_accept_or_reject']).to eq(false)
      expect(json['data']['transitioned_to_agency']).to eq('An external agency')
      expect(json['data']['transitioned_to_remote']).to eq('An external user')
    end

    it 'returns a 422 invalid if the target user has the system category' do
      sign_in(@user1)
      params = { data: { transitioned_to: 'user4', notes: 'Test Notes' } }
      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

      expect(response).to have_http_status(422)
      expect(json['errors'][0]['status']).to eq(422)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case_a.id}/referrals")
      expect(json['errors'][0]['detail']).to eq('transitioned_to')
      expect(json['errors'][0]['message'][0]).to eq('transition.errors.to_user_can_receive')
    end

    it 'returns a 422 invalid if the target user has the maintenance category' do
      sign_in(@user1)
      params = { data: { transitioned_to: 'user5', notes: 'Test Notes' } }
      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

      expect(response).to have_http_status(422)
      expect(json['errors'][0]['status']).to eq(422)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case_a.id}/referrals")
      expect(json['errors'][0]['detail']).to eq('transitioned_to')
      expect(json['errors'][0]['message'][0]).to eq('transition.errors.to_user_can_receive')
    end

    it "get a forbidden message if the user doesn't have referral permission" do
      login_for_test
      params = { data: { transitioned_to: 'user2', notes: 'Test Notes' } }
      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

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

      post("/api/v2/cases/#{@case_b.id}/referrals", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['services_section'][0]['service_status_referred']).to be_truthy
      expect(json['data']['record_id']).to eq(@case_b.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')

      expect(audit_params['action']).to eq('refer')
    end

    it 'refers the record if referred from a service and the user can refer from services' do
      sign_in(@user3)
      params = {
        data: {
          transitioned_to: 'user2', notes: 'Test Notes',
          service_record_id: @case_c.data['services_section'][0]['unique_id']
        }
      }
      post("/api/v2/cases/#{@case_c.id}/referrals", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case_c.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user3')
      expect(json['data']['notes']).to eq('Test Notes')

      expect(audit_params['action']).to eq('refer')
    end

    it 'refers a the record to the target user with an authorized role' do
      sign_in(@user1)
      params = {
        data: { transitioned_to: 'user2', notes: 'Test Notes', authorized_role_unique_id: 'role-receive-referral' }
      }
      post("/api/v2/cases/#{@case_a.id}/referrals", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')
      expect(json['data']['authorized_role_unique_id']).to eq('role-receive-referral')
      expect(audit_params['action']).to eq('refer')
    end

    it 'get a forbidden message if is not referred from a service and the user can only refer from service' do
      sign_in(@user3)
      params = { data: { transitioned_to: 'user2', notes: 'Test Notes' } }
      post("/api/v2/cases/#{@case_c.id}/referrals", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case_c.id}/referrals")
      expect(json['errors'][0]['message']).to eq('Forbidden')
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
      post('/api/v2/cases/referrals', params:)

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
      sign_in(@user2)
      params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
      delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')

      expect(audit_params['action']).to eq('refer_revoke')

      @case_a.reload
      expect(@case_a.assigned_user_names).to_not include('user2')
    end

    it 'completes the referral with not_successful status and reason_not_successful' do
      sign_in(@user2)
      params = {
        data: {
          success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
          reason_not_successful: 'client_refused_services'
        }
      }
      delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_NOT_SUCCESSFUL)
      expect(json['data']['data']['reason_not_successful']).to eq('client_refused_services')
    end

    it 'completes the referral with service_implemented when a service record exists' do
      referral_service = Referral.create!(
        transitioned_by: 'user1',
        transitioned_to: 'user2',
        record: @case_b,
        service_record_id: @case_b.services_section[0]['unique_id']
      )
      sign_in(@user2)
      params = {
        data: {
          success_status: Referral::REFERRAL_SUCCESSFUL,
          service_implemented: Serviceable::SERVICE_IMPLEMENTED
        }
      }
      delete("/api/v2/cases/#{@case_b.id}/referrals/#{referral_service.id}", params:)

      @case_b.reload

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_SUCCESSFUL)
      expect(@case_b.services_section[0]['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
    end

    it 'sets the rejection_note when revoking' do
      sign_in(@user2)
      rejection_note = 'Revocation note from provider'
      params = {
        data: {
          success_status: Referral::REFERRAL_SUCCESSFUL,
          rejection_note: rejection_note
        }
      }
      delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['rejection_note']).to eq(rejection_note)
    end

    it 'revoking an already revoked referral is a noop' do
      @referral1.revoke!(@user2, success_status: Referral::REFERRAL_SUCCESSFUL)
      @referral1.reload
      original_resolved_at = @referral1.resolved_at

      login_for_test
      params = {
        data: { success_status: Referral::REFERRAL_NOT_SUCCESSFUL, reason_not_successful: "client_refused_services" }
      }
      delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_SUCCESSFUL)
      expect(json['data']['data']).not_to have_key('reason_not_successful')

      @referral1.reload
      expect(@referral1.resolved_at.to_i).to eq(original_resolved_at.to_i)
    end

    describe 'validates params for revoke' do
      it 'returns 422 if success_status is blank' do
        sign_in(@user2)
        params = { data: { rejection_note: 'test' } }
        delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['message']).to include('errors.models.referral.success_status_present')
      end

      it 'returns 422 if success_status is invalid' do
        sign_in(@user2)
        params = { data: { success_status: 'maybe' } }
        delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/success_status')
      end

      it 'returns 422 if reason_not_successful is invalid' do
        sign_in(@user2)
        params = {
          data: {
            success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
            reason_not_successful: 'unknown_reason'
          }
        }
        delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/reason_not_successful')
      end

      it 'returns 422 if service_implemented is not in the allowed enum' do
        sign_in(@user2)
        params = {
          data: {
            success_status: Referral::REFERRAL_SUCCESSFUL,
            service_implemented: 'unknown_value'
          }
        }
        delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/service_implemented')
      end

      it 'returns 422 if an unknown field is provided' do
        sign_in(@user2)
        params = { data: { rejection_note: 'test', unknown_field: 'value' } }
        delete("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
      end
    end
  end

  describe 'PATCH /api/v2/cases/:id/referrals/:referral_id' do
    before :each do
      @now = DateTime.parse('2020-10-05T04:05:06')
      DateTime.stub(:now).and_return(@now)
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_a)
    end

    it 'accepts this referral' do
      sign_in(@user2)
      params = { data: { status: Transition::STATUS_ACCEPTED } }

      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_ACCEPTED)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['responded_at']).to eq(@now.in_time_zone.as_json)

      expect(audit_params['action']).to eq('refer_accepted')

      @case_a.reload
      expect(@case_a.assigned_user_names).to include('user2')
    end

    it 'returns the updated pending referral users of the record when accepting' do
      sign_in(@user2)
      params = { data: { status: Transition::STATUS_ACCEPTED } }

      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['record']['referred_users_pending']).to eq([])
      expect(json['data']['record']['referred_users_accepted']).to eq(['user2'])
    end

    it 'rejects this referral' do
      sign_in(@user2)
      params = { data: { status: Transition::STATUS_REJECTED } }

      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REJECTED)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['responded_at']).to eq(@now.in_time_zone.as_json)

      expect(audit_params['action']).to eq('refer_rejected')

      @case_a.reload
      expect(@case_a.assigned_user_names).to_not include('user2')
    end

    it 'rejects this referral and sets a rejected_reason' do
      sign_in(@user2)
      rejected_reason = 'Some reason to reject'
      params = { data: { status: Transition::STATUS_REJECTED, rejected_reason: } }

      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REJECTED)
      expect(json['data']['rejected_reason']).to eq(rejected_reason)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['responded_at']).to eq(@now.in_time_zone.as_json)

      expect(audit_params['action']).to eq('refer_rejected')

      @case_a.reload
      expect(@case_a.assigned_user_names).to_not include('user2')
    end

    it 'completes this referral and returns the notes from provider' do
      sign_in(@user2)
      @referral1.status = Transition::STATUS_ACCEPTED
      @referral1.save!

      rejection_note = 'Sample notes from provider'
      params = {
        data: { status: Transition::STATUS_DONE, rejection_note:, success_status: Referral::REFERRAL_SUCCESSFUL }
      }
      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_DONE)
      expect(json['data']['record_id']).to eq(@case_a.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['rejection_note']).to eq(rejection_note)

      expect(audit_params['action']).to eq('refer_done')

      @case_a.reload
      expect(@case_a.assigned_user_names).to_not include('user2')
    end

    it 'cant accept a referral for a record a user cannot access' do
      hacker = User.new(user_name: 'hacker', role: @role_receive, user_groups: [@group2])
      hacker.save(validate: false)
      case_owned_by_hacker = Child.create(
        data: {
          name: 'Test', owned_by: 'hacker',
          disclosure_other_orgs: true, consent_for_services: true,
          module_id: @primero_module.unique_id
        }
      )
      referral_for_a_different_case = Referral.create!(transitioned_by: 'user3', transitioned_to: 'user2',
                                                       record: @case_c)

      sign_in(hacker)
      params = { data: { status: Transition::STATUS_ACCEPTED } }

      patch("/api/v2/cases/#{case_owned_by_hacker.id}/referrals/#{referral_for_a_different_case.id}", params:)

      expect(response).to have_http_status(403)
    end

    describe 'validate params to transition a referral to done' do
      before :each do
        @referral1.status = Transition::STATUS_ACCEPTED
        @referral1.save!
      end

      it 'returns 422 if status is invalid' do
        sign_in(@user2)
        params = { data: { status: 'invalid_status' } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/status')
      end

      it 'returns 422 if success_status is not in the allowed enum' do
        sign_in(@user2)
        params = { data: { status: Transition::STATUS_DONE, success_status: 'maybe' } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/success_status')
      end

      it 'returns 422 if reason_not_successful is not in the allowed enum' do
        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
            reason_not_successful: 'unknown_reason'
          }
        }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/reason_not_successful')
      end

      it 'returns 422 if service_implemented is not in the allowed enum' do
        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_SUCCESSFUL,
            service_implemented: 'unknown_value'
          }
        }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/service_implemented')
      end

      it 'returns 422 if an unknown field is provided' do
        sign_in(@user2)
        params = { data: { status: Transition::STATUS_DONE, unknown_field: 'value' } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
      end
    end

    describe 'validates a done referral' do
      before :each do
        @referral1.status = Transition::STATUS_ACCEPTED
        @referral1.save!
      end

      it 'returns 422 if success_status is blank' do
        sign_in(@user2)
        params = { data: { status: Transition::STATUS_DONE } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to eq('base')
      end

      it 'returns 422 if reason_not_successful is blank when success_status is not_successful' do
        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_NOT_SUCCESSFUL
          }
        }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['message'][0]).to eq('errors.models.referral.reason_not_successful_present')
      end

      it 'returns 422 if service_implemented is blank when there is a service record' do
        @referral_service = Referral.create!(
          transitioned_by: 'user1', transitioned_to: 'user2', record: @case_b,
          service_record_id: @case_b.data['services_section'][0]['unique_id']
        )
        @referral_service.status = Transition::STATUS_ACCEPTED
        @referral_service.save!

        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_SUCCESSFUL
          }
        }

        patch("/api/v2/cases/#{@case_b.id}/referrals/#{@referral_service.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['message'][0]).to eq('errors.models.referral.service_implemented_present')
      end

      it 'successfully marks done with success_status successful and no service record' do
        sign_in(@user2)
        params = { data: { status: Transition::STATUS_DONE, success_status: Referral::REFERRAL_SUCCESSFUL } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Transition::STATUS_DONE)
      end

      it 'successfully marks done with success_status not_successful and reason_not_successful' do
        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
            reason_not_successful: 'client_refused_services'
          }
        }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Transition::STATUS_DONE)
      end

      it 'successfully marks done with service_implemented when service record exists' do
        @referral_service = Referral.create!(
          transitioned_by: 'user1', transitioned_to: 'user2', record: @case_b,
          service_record_id: @case_b.data['services_section'][0]['unique_id']
        )
        @referral_service.status = Transition::STATUS_ACCEPTED
        @referral_service.save!

        sign_in(@user2)
        params = {
          data: {
            status: Transition::STATUS_DONE,
            success_status: Referral::REFERRAL_SUCCESSFUL,
            service_implemented: Serviceable::SERVICE_IMPLEMENTED
          }
        }

        patch("/api/v2/cases/#{@case_b.id}/referrals/#{@referral_service.id}", params:)

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Transition::STATUS_DONE)
      end
    end

    after :each do
      clean_data(Referral)
    end
  end

  after do
    clear_enqueued_jobs
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Referral)
  end
end
