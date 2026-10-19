# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ReferralsController, type: :request do
  include ActiveJob::TestHelper
  before do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Referral, Agency)

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
    @permission_revoke_referral = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::REMOVE_ASSIGNED_USERS]
    )
    @permission_referral_from_service = Permission.new(
      resource: Permission::CASE, actions: [Permission::REFERRAL_FROM_SERVICE]
    )
    @role = Role.new(permissions: [@permission_refer_case], primero_modules: [@primero_module])
    @role.save(validate: false)
    @role_receive = Role.new(permissions: [@permission_receive_referral], primero_modules: [@primero_module])
    @role_receive.save(validate: false)
    @role_revoke = Role.new(permissions: [@permission_revoke_referral], primero_modules: [@primero_module])
    @role_revoke.save(validate: false)
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
      permissions: [@permission_refer_case],
      primero_modules: [@primero_module], user_category: Role::CATEGORY_MAINTENANCE
    )
    @maintenance_role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @group_other = UserGroup.create!(name: 'GroupOther')
    @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1], agency: @agency1)
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role_receive, user_groups: [@group2], agency: @agency1)
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: @role_service, user_groups: [@group1])
    @user3.save(validate: false)
    @user4 = User.new(user_name: 'user4', role: @system_role, user_groups: [@group1])
    @user4.save(validate: false)
    @user5 = User.new(user_name: 'user5', role: @maintenance_role, user_groups: [@group2])
    @user5.save(validate: false)
    @user6 = User.new(user_name: 'user6', role: @role_revoke, user_groups: [@group1], agency: @agency1)
    @user6.save(validate: false)
    @role_accept_or_reject_referral = Role.new(
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ, Permission::REFERRAL, Permission::ACCEPT_OR_REJECT_REFERRAL
          ]
        )
      ],
      primero_modules: [@primero_module],
      group_permission: Permission::ALL
    )
    @role_accept_or_reject_referral.save(validate: false)
    @user_accept_or_reject_referral = User.new(
      user_name: 'user_accept_or_reject_referral',
      role: @role_accept_or_reject_referral,
      user_groups: [@group1]
    )
    @user_accept_or_reject_referral.save(validate: false)
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
    @case_d = Child.create(
      data: {
        name: 'Test', owned_by: 'user6', disclosure_other_orgs: true, consent_for_services: true,
        module_id: @primero_module.unique_id, services_section: [
          {
            service_type: 'Test service',
            service_implementing_agency_individual: @user1.user_name,
            service_provider: true
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

  describe 'POST /api/v2/case/:id/referrals with a pending transition' do
    it 'returns 403 and does not refer the record' do
      @case_a.update_column(:data, @case_a.data.merge('transferred_to_users' => %w[user1]))

      sign_in(@user1)
      post("/api/v2/cases/#{@case_a.id}/referrals", params: { data: { transitioned_to: 'user2' } })

      expect(response).to have_http_status(403)
      expect(@case_a.transitions.where(type: 'Referral')).to be_empty
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

    it 'excludes the records where the user has a pending referral' do
      role_refer_receive = Role.new(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::REFERRAL, Permission::RECEIVE_REFERRAL]
          )
        ],
        primero_modules: [@primero_module], group_permission: Permission::GROUP
      )
      role_refer_receive.save(validate: false)
      user7 = User.new(user_name: 'user7', role: role_refer_receive, user_groups: [@group1])
      user7.save(validate: false)
      Referral.create!(transitioned_by: 'user1', transitioned_to: 'user7', record: @case_a)

      sign_in(user7)
      params = { data: { ids: [@case_a.id, @case_a2.id], transitioned_to: 'user2', notes: 'Test Notes' } }
      post('/api/v2/cases/referrals', params:)

      expect(response).to have_http_status(200)
      expect(json['data'].map { |transition| transition['record_id'] }).to eq([@case_a2.id.to_s])
      expect(@case_a.referrals.where(transitioned_to: 'user2')).to be_empty
    end
  end

  describe 'DELETE /api/v2/cases/:id/referrals/:referral_id' do
    let(:role_revoke_self) do
      role_revoke_self = Role.new(
        permissions: [@permission_revoke_referral],
        primero_modules: [@primero_module],
        group_permission: Permission::SELF
      )
      role_revoke_self.save(validate: false)
      role_revoke_self
    end

    let(:user_revoke_self) do
      user_revoke_self = User.new(user_name: 'user_revoke_self', role: role_revoke_self, user_groups: [@group1])
      user_revoke_self.save(validate: false)
      user_revoke_self
    end

    let(:role_receive_revoke) do
      role_receive_revoke = Role.new(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::RECEIVE_REFERRAL, Permission::REMOVE_ASSIGNED_USERS]
          )
        ],
        primero_modules: [@primero_module],
        group_permission: Permission::ALL
      )
      role_receive_revoke.save(validate: false)
      role_receive_revoke
    end

    let(:user_receive_revoke) do
      user_receive_revoke = User.new(
        user_name: 'user_receive_revoke', role: role_receive_revoke, user_groups: [@group1]
      )
      user_receive_revoke.save(validate: false)
      user_receive_revoke
    end

    let(:role_revoke_agency) do
      role_revoke_agency = Role.new(
        permissions: [@permission_revoke_referral],
        primero_modules: [@primero_module],
        group_permission: Permission::AGENCY
      )
      role_revoke_agency.save(validate: false)
      role_revoke_agency
    end

    let(:user_revoke_agency) do
      user_revoke_agency = User.new(user_name: 'user_revoke_agency', role: role_revoke_agency, agency: @agency2)
      user_revoke_agency.save(validate: false)
      user_revoke_agency
    end

    let(:role_revoke_group) do
      role_revoke_group = Role.new(
        permissions: [@permission_revoke_referral],
        primero_modules: [@primero_module],
        group_permission: Permission::GROUP
      )
      role_revoke_group.save(validate: false)
      role_revoke_group
    end

    let(:user_revoke_group) do
      user_revoke_group = User.new(user_name: 'user_revoke_group', role: role_revoke_group, user_groups: [@group_other])
      user_revoke_group.save(validate: false)
      user_revoke_group
    end

    before :each do
      @referral1 = Referral.create!(transitioned_by: 'user6', transitioned_to: 'user2', record: @case_d)
    end

    it 'completes this referral' do
      sign_in(@user6)
      params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
      delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['record_id']).to eq(@case_d.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user6')

      expect(audit_params['action']).to eq('refer_revoke')

      @case_d.reload
      expect(@case_d.assigned_user_names).to_not include('user2')
    end

    it 'completes the referral with not_successful status and reason_not_successful' do
      sign_in(@user6)
      params = {
        data: {
          success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
          reason_not_successful: 'client_refused_services'
        }
      }
      delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_NOT_SUCCESSFUL)
      expect(json['data']['data']['reason_not_successful']).to eq('client_refused_services')
    end

    it 'completes the referral with service_implemented when a service record exists' do
      referral_service = Referral.create!(
        transitioned_by: 'user6',
        transitioned_to: 'user2',
        record: @case_d,
        service_record_id: @case_d.services_section[0]['unique_id']
      )
      sign_in(@user6)
      params = {
        data: {
          success_status: Referral::REFERRAL_SUCCESSFUL,
          service_implemented: Serviceable::SERVICE_IMPLEMENTED
        }
      }
      delete("/api/v2/cases/#{@case_d.id}/referrals/#{referral_service.id}", params:)

      @case_d.reload

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_SUCCESSFUL)
      expect(@case_d.services_section[0]['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
    end

    it 'sets the rejection_note when revoking' do
      sign_in(@user6)
      rejection_note = 'Revocation note from provider'
      params = {
        data: {
          success_status: Referral::REFERRAL_SUCCESSFUL,
          rejection_note: rejection_note
        }
      }
      delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['rejection_note']).to eq(rejection_note)
    end

    it 'revoking an already revoked referral is a noop' do
      @referral1.revoke!(@user6, success_status: Referral::REFERRAL_SUCCESSFUL)
      @referral1.reload
      original_resolved_at = @referral1.resolved_at

      sign_in(@user6)
      params = {
        data: { success_status: Referral::REFERRAL_NOT_SUCCESSFUL, reason_not_successful: 'client_refused_services' }
      }
      delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REVOKED)
      expect(json['data']['data']['success_status']).to eq(Referral::REFERRAL_SUCCESSFUL)
      expect(json['data']['data']).not_to have_key('reason_not_successful')

      @referral1.reload
      expect(@referral1.resolved_at.to_i).to eq(original_resolved_at.to_i)
    end

    context 'when the record is in the user scope' do
      it 'returns 403 if the referral is not in the user scope' do
        @case_d.assigned_user_names = [user_revoke_self.user_name]
        @case_d.save!

        sign_in(user_revoke_self)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(user_revoke_self.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if the user is the recipient even if the referral is in scope' do
        referral = Referral.create!(
          transitioned_by: 'user6',
          transitioned_to: user_receive_revoke.user_name,
          record: @case_d
        )

        sign_in(user_receive_revoke)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{referral.id}", params:)

        expect(user_receive_revoke.can?(:read, @case_d)).to be(true)
        expect(user_receive_revoke.permitted_to_access_referral?(referral)).to be(true)
        expect(referral.recipient?(user_receive_revoke)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if the referral is not in the agency scope' do
        @case_d.update!(
          associated_user_agencies: [@agency2.unique_id], assigned_user_names: [user_revoke_agency.user_name]
        )

        sign_in(user_revoke_agency)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(user_revoke_agency.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if the referral is not in the group scope' do
        @case_d.update!(
          associated_user_groups: [@group_other.unique_id], assigned_user_names: [user_revoke_group.user_name]
        )

        sign_in(user_revoke_group)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(user_revoke_group.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end
    end

    context 'when is a remote referral and the record is in the user scope' do
      let(:remote_referral) { Referral.create!(transitioned_by: 'user1', record: @case_d, remote: true) }

      it 'returns 200 if the referral is in scope and can read the record' do
        sign_in(user_receive_revoke)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{remote_referral.id}", params:)

        expect(user_receive_revoke.can?(:read, @case_d)).to be(true)
        expect(user_receive_revoke.permitted_to_access_referral?(remote_referral)).to be(true)
        expect(response).to have_http_status(200)
      end

      it 'returns 403 if the referral is not in the user scope' do
        @case_d.assigned_user_names = [user_revoke_self.user_name]
        @case_d.save!

        sign_in(user_revoke_self)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{remote_referral.id}", params:)

        expect(user_revoke_self.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if the referral is not in the agency scope' do
        @case_d.update!(
          associated_user_agencies: [@agency2.unique_id], assigned_user_names: [user_revoke_agency.user_name]
        )

        sign_in(user_revoke_agency)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{remote_referral.id}", params:)

        expect(user_revoke_agency.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if the referral is not in the group scope' do
        @case_d.update!(
          associated_user_groups: [@group_other.unique_id],
          assigned_user_names: [user_revoke_group.user_name]
        )

        sign_in(user_revoke_group)
        params = { data: { success_status: Referral::REFERRAL_SUCCESSFUL } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{remote_referral.id}", params:)

        expect(user_revoke_group.can?(:read, @case_d)).to be(true)
        expect(response).to have_http_status(403)
      end
    end

    describe 'validates params for revoke' do
      it 'returns 422 if success_status is blank' do
        sign_in(@user6)
        params = { data: { rejection_note: 'test' } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['message']).to include('errors.models.referral.success_status_present')
      end

      it 'returns 422 if success_status is invalid' do
        sign_in(@user6)
        params = { data: { success_status: 'maybe' } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/success_status')
      end

      it 'returns 422 if reason_not_successful is invalid' do
        sign_in(@user6)
        params = {
          data: {
            success_status: Referral::REFERRAL_NOT_SUCCESSFUL,
            reason_not_successful: 'unknown_reason'
          }
        }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/reason_not_successful')
      end

      it 'returns 422 if service_implemented is not in the allowed enum' do
        sign_in(@user6)
        params = {
          data: {
            success_status: Referral::REFERRAL_SUCCESSFUL,
            service_implemented: 'unknown_value'
          }
        }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['status']).to eq(422)
        expect(json['errors'][0]['detail']).to include('/service_implemented')
      end

      it 'returns 422 if an unknown field is provided' do
        sign_in(@user6)
        params = { data: { rejection_note: 'test', unknown_field: 'value' } }
        delete("/api/v2/cases/#{@case_d.id}/referrals/#{@referral1.id}", params:)

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
      @remote_referral = Referral.create!(transitioned_by: 'user1', record: @case_a, remote: true)
    end

    context 'when the user has accept_or_reject_referral permission and is a remote referral' do
      it 'accepts a remote referral' do
        sign_in(@user_accept_or_reject_referral)
        params = { data: { status: Transition::STATUS_ACCEPTED } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Transition::STATUS_ACCEPTED)
        expect(@remote_referral.reload.status).to eq(Transition::STATUS_ACCEPTED)
        expect(audit_params['action']).to eq('refer_accepted')
      end

      it 'rejects a remote referral' do
        sign_in(@user_accept_or_reject_referral)
        params = { data: { status: Transition::STATUS_REJECTED } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Transition::STATUS_REJECTED)
        expect(@remote_referral.reload.status).to eq(Transition::STATUS_REJECTED)
        expect(audit_params['action']).to eq('refer_rejected')
      end

      it 'returns 403 if tries to complete an accepted remote referral' do
        @remote_referral.accept!

        sign_in(@user_accept_or_reject_referral)
        params = { data: { status: Transition::STATUS_DONE } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

        expect(response).to have_http_status(403)
      end

      context 'when the record is in the user scope' do
        it 'returns 403 if a referral is not in the user scope' do
          role = Role.new(
            permissions: [
              Permission.new(
                resource: Permission::CASE,
                actions: [
                  Permission::READ, Permission::REFERRAL, Permission::ACCEPT_OR_REJECT_REFERRAL
                ]
              )
            ],
            primero_modules: [@primero_module],
            group_permission: Permission::SELF
          )
          role.save(validate: false)
          user_accept_or_reject_self = User.new(
            user_name: 'user_accept_or_reject_self',
            role: role,
            user_groups: [@group1]
          )
          user_accept_or_reject_self.save(validate: false)

          @case_a.assigned_user_names = [user_accept_or_reject_self.user_name]
          @case_a.save!

          sign_in(user_accept_or_reject_self)
          params = { data: { status: Transition::STATUS_ACCEPTED } }

          patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

          expect(user_accept_or_reject_self.can?(:read, @case_a)).to be(true)
          expect(response).to have_http_status(403)
        end

        it 'returns 403 if the referral is not in the agency scope' do
          role_agency = Role.new(
            permissions: [
              Permission.new(
                resource: Permission::CASE,
                actions: [Permission::READ, Permission::REFERRAL, Permission::ACCEPT_OR_REJECT_REFERRAL]
              )
            ],
            primero_modules: [@primero_module],
            group_permission: Permission::AGENCY
          )
          role_agency.save(validate: false)

          user_agency = User.new(
            user_name: 'user_accept_or_reject_agency',
            role: role_agency,
            agency: @agency2
          )
          user_agency.save(validate: false)

          @case_a.update!(
            associated_user_agencies: [@agency2.unique_id],
            assigned_user_names: [user_agency.user_name]
          )

          sign_in(user_agency)
          params = { data: { status: Transition::STATUS_ACCEPTED } }

          patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

          expect(user_agency.can?(:read, @case_a)).to be(true)
          expect(response).to have_http_status(403)
        end

        it 'returns 403 if the referral is not in the group scope' do
          role_group = Role.new(
            permissions: [
              Permission.new(
                resource: Permission::CASE,
                actions: [Permission::READ, Permission::REFERRAL, Permission::ACCEPT_OR_REJECT_REFERRAL]
              )
            ],
            primero_modules: [@primero_module],
            group_permission: Permission::GROUP
          )
          role_group.save(validate: false)

          user_group = User.new(user_name: 'user_accept_or_reject_group', role: role_group, user_groups: [@group_other])
          user_group.save(validate: false)

          @case_a.update!(
            associated_user_groups: [@group_other.unique_id], assigned_user_names: [user_group.user_name]
          )

          sign_in(user_group)
          params = { data: { status: Transition::STATUS_ACCEPTED } }

          patch("/api/v2/cases/#{@case_a.id}/referrals/#{@remote_referral.id}", params:)

          expect(user_group.can?(:read, @case_a)).to be(true)
          expect(response).to have_http_status(403)
        end
      end
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

    it 'returns 403 if a user who is not the recipient attempts to accept a referral' do
      role_refer_receive = Role.new(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::REFERRAL, Permission::RECEIVE_REFERRAL]
          )
        ],
        primero_modules: [@primero_module], group_permission: Permission::GROUP
      )
      role_refer_receive.save(validate: false)
      user8 = User.new(user_name: 'user8', role: role_refer_receive, user_groups: [@group1])
      user8.save(validate: false)

      sign_in(user8)
      params = { data: { status: Transition::STATUS_ACCEPTED } }

      patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

      expect(response).to have_http_status(403)
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

    it 'returns 404 if the referral belongs to a different record' do
      hacker = User.new(user_name: 'hacker', role: @role_receive, user_groups: [@group2])
      hacker.save(validate: false)

      case_owned_by_hacker = Child.create(
        data: {
          name: 'Test', owned_by: 'hacker',
          disclosure_other_orgs: true, consent_for_services: true,
          module_id: @primero_module.unique_id
        }
      )
      referral_for_a_different_case = Referral.create!(
        transitioned_by: 'user3', transitioned_to: 'user2', record: @case_c
      )

      sign_in(hacker)
      params = { data: { status: Transition::STATUS_ACCEPTED } }

      patch("/api/v2/cases/#{case_owned_by_hacker.id}/referrals/#{referral_for_a_different_case.id}", params:)

      expect(response).to have_http_status(404)
    end

    context 'when the record is in the user scope' do
      it 'returns 403 if not in the user scope' do
        role = Role.new(
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::REFERRAL])
          ],
          primero_modules: [@primero_module],
          group_permission: Permission::SELF
        )
        role.save(validate: false)
        user_referral = User.new(user_name: 'user_referral_self', role: role, user_groups: [@group1])
        user_referral.save(validate: false)

        @case_a.assigned_user_names = [user_referral.user_name]
        @case_a.save!

        sign_in(user_referral)
        params = { data: { status: Transition::STATUS_ACCEPTED } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(user_referral.can?(:read, @case_a)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if not in the agency scope' do
        role_agency = Role.new(
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::REFERRAL])
          ],
          primero_modules: [@primero_module],
          group_permission: Permission::AGENCY
        )
        role_agency.save(validate: false)

        user_agency = User.new(user_name: 'user_agency', role: role_agency, agency: @agency2)
        user_agency.save(validate: false)

        @case_a.update!(associated_user_agencies: [@agency2.unique_id], assigned_user_names: [user_agency.user_name])

        sign_in(user_agency)
        params = { data: { status: Transition::STATUS_ACCEPTED } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(user_agency.can?(:read, @case_a)).to be(true)
        expect(response).to have_http_status(403)
      end

      it 'returns 403 if not in the group scope' do
        group_other2 = UserGroup.create!(name: 'GroupOther2')

        role_group = Role.new(
          permissions: [
            Permission.new(
              resource: Permission::CASE, actions: [Permission::READ, Permission::REFERRAL]
            )
          ],
          primero_modules: [@primero_module],
          group_permission: Permission::GROUP
        )
        role_group.save(validate: false)

        user_referral_group = User.new(user_name: 'user_referral_group', role: role_group, user_groups: [group_other2])
        user_referral_group.save(validate: false)

        @case_a.update!(
          associated_user_groups: [group_other2.unique_id], assigned_user_names: [user_referral_group.user_name]
        )

        sign_in(user_referral_group)
        params = { data: { status: Transition::STATUS_ACCEPTED } }

        patch("/api/v2/cases/#{@case_a.id}/referrals/#{@referral1.id}", params:)

        expect(user_referral_group.can?(:read, @case_a)).to be(true)
        expect(response).to have_http_status(403)
      end
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
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Referral, Agency)
  end
end
