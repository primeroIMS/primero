require 'rails_helper'

describe Api::V2::TransfersController, type: :request do

  before :each do
    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_transfer_case = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::TRANSFER, Permission::RECEIVE_TRANSFER
      ]
    )
    @role = Role.new(permissions: [@permission_transfer_case])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1], modules: [@primero_module])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2], modules: [@primero_module])
    @user2.save(validate: false)
    @case = Child.create(
      data: {
        name: 'Test', owned_by: 'user1',
        disclosure_other_orgs: true, consent_for_services: true,
        module_id: @primero_module.unique_id,
      }
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/case/:id/transfers' do

    before :each do
      @transfer1 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
    end

    it 'lists the transfers for a case' do
      sign_in(@user2)
      get "/api/v2/cases/#{@case.id}/transfers"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq(@case.id.to_s)
      expect(json['data'][0]['transitioned_to']).to eq('user2')
      expect(json['data'][0]['transitioned_by']).to eq('user1')
    end

    it "get a forbidden message if the user doesn't have view permission" do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case.id}/transfers"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/transfers")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

  end

  describe 'POST /api/v2/case/:id/transfers' do

    it 'initiates a transfer of a the record to the target user' do
      sign_in(@user1)
      params = {data: {transitioned_to: 'user2', notes: 'Test Notes'}}
      post "/api/v2/cases/#{@case.id}/transfers", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['status']).to eq(Transition::STATUS_INPROGRESS)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')
      expect(json['data']['notes']).to eq('Test Notes')
    end

    it "get a forbidden message if the user doesn't have transfer permission" do
      login_for_test
      params = {data: {transitioned_to: 'user2', notes: 'Test Notes'}}
      post "/api/v2/cases/#{@case.id}/transfers", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/transfers")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/case/transfers' do

    before :each do
      @case2 = Child.create(
        data: {
          name: 'Test2', owned_by: 'user1',
          disclosure_other_orgs: true, consent_for_services: true,
          module_id: @primero_module.unique_id
        }
      )
    end

    it 'transfer multiple records to the target user' do
      sign_in(@user1)
      params = {data: {ids: [@case.id, @case2.id], transitioned_to: 'user2', notes: 'Test Notes'}}
      post "/api/v2/cases/transfers", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['record_id']).to eq(@case.id.to_s)
      expect(json['data'][0]['transitioned_to']).to eq('user2')
      expect(json['data'][0]['transitioned_by']).to eq('user1')
      expect(json['data'][0]['status']).to eq(Transition::STATUS_INPROGRESS)
      expect(json['data'][1]['record_id']).to eq(@case2.id.to_s)
      expect(json['data'][1]['transitioned_to']).to eq('user2')
      expect(json['data'][1]['transitioned_by']).to eq('user1')
      expect(json['data'][1]['status']).to eq(Transition::STATUS_INPROGRESS)
    end

  end

  describe 'PATCH /api/v2/cases/:id/transfers/:transfer_id' do

    before :each do
      @transfer1 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
    end

    it 'accepts this transfer' do
      sign_in(@user2)
      params = {
        data: {
          status: 'accepted'
        }
      }
      patch "/api/v2/cases/#{@case.id}/transfers/#{@transfer1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_ACCEPTED)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')

      @case.reload
      expect(@case.owned_by).to eq('user2')
    end

    it 'rejects this transfer' do
      sign_in(@user2)
      params = {
        data: {
          status: 'rejected'
        }
      }
      patch "/api/v2/cases/#{@case.id}/transfers/#{@transfer1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REJECTED)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user2')
      expect(json['data']['transitioned_by']).to eq('user1')

      @case.reload
      expect(@case.owned_by).to eq('user1')
      expect(@case.assigned_user_names).not_to include('user2')
    end

  end

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end



end