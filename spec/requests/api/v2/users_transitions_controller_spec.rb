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

    @user1 = User.new(user_name: 'user1', role: role)
    @user1.save(validate: false)
    @user2 = User.new(user_name: 'user2', role: role)
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: role)
    @user3.save(validate: false)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/users/assign-to' do
    it 'lists the users that can be assigned to' do
      sign_in(@user1)
      get '/api/v2/users/assign-to', params: {record_type: 'case'}

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{ |u| u['user_name'] }).to match_array(%w[user2 user3])
    end
  end

  describe 'GET /api/v2/users/refer-to' do
    it 'lists the users that can be referred to' do
      sign_in(@user1)
      get '/api/v2/users/refer-to', params: {record_type: 'case'}

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{ |u| u['user_name'] }).to match_array(%w[user2 user3])
    end
  end

  describe 'GET /api/v2/users/transfer-to' do
    it 'lists the users that can be transferred to' do
      sign_in(@user1)
      get '/api/v2/users/transfer-to', params: {record_type: 'case'}

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{ |u| u['user_name'] }).to match_array(%w[user2 user3])
    end
  end

  after :each do
    [User, Role].each(&:destroy_all)
  end


end