# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::UsersTransitionsController, type: :request do
  before :each do
    permissions = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::RECEIVE_REFERRAL, Permission::REFERRAL,
        Permission::RECEIVE_TRANSFER, Permission::TRANSFER,
        Permission::ASSIGN
      ]
    )
    role = Role.new(permissions: [permissions])
    role.save(validate: false)

    agency = Agency.new(unique_id: 'fake-agency', agency_code: 'fkagency')
    agency.save(validate: false)

    @user1 = User.new(user_name: 'user1', role: role, agency: agency)
    @user1.save(validate: false)
    @user2 = User.new(user_name: 'user2', role: role, agency: agency)
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: role, agency: agency)
    @user3.save(validate: false)
    @user4 = User.new(user_name: 'user4', role: role, agency: agency, services: %w[test_service])
    @user4.save(validate: false)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/users/assign-to' do
    it 'lists the users that can be assigned to' do
      sign_in(@user1)
      get '/api/v2/users/assign-to', params: { record_type: 'case' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
    end
  end

  describe 'GET /api/v2/users/refer-to' do
    it 'lists the users that can be referred to' do
      sign_in(@user1)
      get '/api/v2/users/refer-to', params: { record_type: 'case' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
    end
    it 'lists the users that can be referred to, filter by services ' do
      sign_in(@user1)
      get '/api/v2/users/refer-to', params: { record_type: 'case', service: 'test_service' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user4])
    end
    it 'lists the users that can be referred to if the user has the referral_from_service permission' do
      login_for_test(permissions:
        [
          Permission.new(resource: Permission::CASE, actions: [Permission::REFERRAL_FROM_SERVICE])
        ])
      get '/api/v2/users/refer-to', params: { record_type: 'case' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user1 user2 user3 user4])
    end
  end

  describe 'GET /api/v2/users/transfer-to' do
    it 'lists the users that can be transferred to' do
      sign_in(@user1)
      get '/api/v2/users/transfer-to', params: { record_type: 'case' }

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |u| u['user_name'] }).to match_array(%w[user2 user3 user4])
    end
  end

  after :each do
    [User, Role, Agency].each(&:destroy_all)
  end
end
