# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::UsersTransitionsController, type: :request do
  before :each do
    @program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )

    @form1 = FormSection.create!(name: 'form1')

    @cp = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [@form1]
    )

    permissions = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::RECEIVE_REFERRAL, Permission::REFERRAL,
        Permission::RECEIVE_TRANSFER, Permission::TRANSFER,
        Permission::ASSIGN
      ]
    )
    role = Role.new(permissions: [permissions], primero_modules: [@cp])
    role.save(validate: false)

    agency = Agency.new(unique_id: 'fake-agency', agency_code: 'fkagency')
    agency.save(validate: false)
    agency2 = Agency.new(unique_id: 'fake-agency2', agency_code: 'fkagency2')
    agency2.save(validate: false)

    group1 = UserGroup.create!(name: 'Group1')
    group2 = UserGroup.create!(name: 'Group2')
    group3 = UserGroup.create!(name: 'Group3')

    @user1 = User.new(user_name: 'user1', role: role, agency: agency, user_groups: [group1, group3])
    @user1.save(validate: false)
    @user2 = User.new(user_name: 'user2', role: role, agency: agency, user_groups: [group1])
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: role, agency: agency, user_groups: [group2])
    @user3.save(validate: false)
    @user4 = User.new(user_name: 'user4', role: role, agency: agency2, user_groups: [group3], services: %w[test_service])
    @user4.save(validate: false)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/users/assign-to' do
    context 'when user has assign permission' do
      before do
        sign_in(@user1)
      end

      it 'lists the users that can be assigned to' do
        get '/api/v2/users/assign-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(3)
        expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
      end
    end

    context 'when user has assign within agency permission' do
      before do
        permission = Permission.new(
          resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_AGENCY]
        )
        role = Role.new(permissions: [permission])
        role.save(validate: false)
        @user1.role = role
        @user1.save(validate: false)
        sign_in(@user1)
      end
      it 'lists the users that can be assigned to' do
        sign_in(@user1)
        get '/api/v2/users/assign-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(2)
        expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3])
      end
    end

    context 'when user has assign within group permission' do
      before do
        permission = Permission.new(
          resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_USER_GROUP]
        )
        role = Role.new(permissions: [permission])
        role.save(validate: false)
        @user1.role = role
        @user1.save(validate: false)
        sign_in(@user1)
      end
      it 'lists the users that can be assigned to' do
        sign_in(@user1)
        get '/api/v2/users/assign-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(2)
        expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user4])
      end
    end
  end

  describe 'GET /api/v2/users/refer-to' do
    it 'lists the users that can be referred to' do
      sign_in(@user1)
      get '/api/v2/users/refer-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
    end
    it 'lists the users that can be referred to, filter by services ' do
      sign_in(@user1)
      get '/api/v2/users/refer-to', params: { record_type: 'case', record_module_id: @cp.unique_id, service: 'test_service' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user4])
    end
    it 'lists the users that can be referred to if the user has the referral_from_service permission' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [Permission::REFERRAL_FROM_SERVICE])
        ])
      get '/api/v2/users/refer-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user1 user2 user3 user4])
    end
  end

  describe 'GET /api/v2/users/transfer-to' do
    it 'lists the users that can be transferred to' do
      sign_in(@user1)
      get '/api/v2/users/transfer-to', params: { record_type: 'case', record_module_id: @cp.unique_id }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
    end
  end

  after :each do
    [User, Role, Agency, PrimeroModule, PrimeroProgram].each(&:destroy_all)
  end
end
