require 'rails_helper'

describe Api::V2::TransferRequestsController, type: :request do

  before :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition)
    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    @permission_transfer_case = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::REQUEST_TRANSFER, Permission::RECEIVE_TRANSFER
      ]
    )
    @role = Role.new(permissions: [@permission_transfer_case], modules: [@primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
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

  describe 'GET /api/v2/case/:id/transfer_requests' do

    before :each do
      @transfer1 = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
    end

    it 'lists the transfer requests for a case' do
      sign_in(@user1)
      get "/api/v2/cases/#{@case.id}/transfer_requests"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq(@case.id.to_s)
      expect(json['data'][0]['transitioned_to']).to eq('user1')
      expect(json['data'][0]['transitioned_by']).to eq('user2')
    end

    it "get a forbidden message if the user doesn't have view permission" do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case.id}/transfer_requests"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/transfer_requests")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

  end

  describe 'POST /api/v2/case/:id/transfer_requests' do

    it 'makes a transfer request for the record to the record owner' do
      sign_in(@user2)
      params = {data: {notes: 'Test Notes'}}
      post "/api/v2/cases/#{@case.id}/transfer_requests", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['status']).to eq(Transition::STATUS_INPROGRESS)
      expect(json['data']['transitioned_to']).to eq('user1')
      expect(json['data']['transitioned_by']).to eq('user2')
      expect(json['data']['notes']).to eq('Test Notes')
    end

    it "get a forbidden message if the user doesn't have transfer permission" do
      login_for_test
      params = {data: {notes: 'Test Notes'}}
      post "/api/v2/cases/#{@case.id}/transfer_requests", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/transfer_requests")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'PATCH /api/v2/cases/:id/transfer_requests/:transfer_request_id' do

    before :each do
      @transfer1 = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
    end

    it 'accepts this transfer request' do
      sign_in(@user1)
      params = {
        data: {
          status: 'accepted'
        }
      }
      patch "/api/v2/cases/#{@case.id}/transfer_requests/#{@transfer1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_ACCEPTED)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user1')
      expect(json['data']['transitioned_by']).to eq('user2')

      @case.reload
      expect(@case.assigned_user_names).to include('user2')
    end

    it 'rejects this transfer' do
      sign_in(@user1)
      params = {
        data: {
          status: 'rejected'
        }
      }
      patch "/api/v2/cases/#{@case.id}/transfer_requests/#{@transfer1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq(Transition::STATUS_REJECTED)
      expect(json['data']['record_id']).to eq(@case.id.to_s)
      expect(json['data']['transitioned_to']).to eq('user1')
      expect(json['data']['transitioned_by']).to eq('user2')

      @case.reload
      expect(@case.assigned_user_names.present?).to be_falsey
    end

  end

  after :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition)
  end


end