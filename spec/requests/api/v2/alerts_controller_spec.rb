require 'rails_helper'

describe Api::V2::AlertsController, type: :request do
  before :each do
    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          :resource => Permission::CASE,
          :actions => [Permission::MANAGE]
        )
      ]
    )
    agency_1 = Agency.create!(name: 'Agency test 1', agency_code: 'agencytest1')
    @user_1 = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: agency_1.id,
      role: role
    )
    @user_2 = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12342078',
      password_confirmation: 'a12342078',
      email: 'test_user_2@localhost.com',
      agency_id: agency_1.id,
      role: role
    )
    @user_3 = User.create!(
      full_name: 'Test User 3',
      user_name: 'test_user_3',
      password: 'a17845678',
      password_confirmation: 'a17845678',
      email: 'test_user_3@localhost.com',
      agency_id: agency_1.id,
      role: role
    )
    @test_child = Child.create(
      name: 'bar',
      owned_by:  @user_1.user_name,
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_2.id)
      ]
    )
    @test_child = Child.create(
      name: 'foo',
      owned_by:  @user_1.user_name,
      alerts: [
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_1.id),
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_1.id),
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_2.id)
      ]
    )
    @test_incident = Incident.create!(
      data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1', owned_by:  @user_1.user_name },
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_2.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_2.id)
      ]
    )
    @test_tracing_request = TracingRequest.create!(
      data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1', owned_by:  @user_1.user_name },
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_1.id)
      ]
    )
    @test_tracing_request = TracingRequest.create!(
      data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1', owned_by:  @user_2.user_name },
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_2.id)
      ]
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/alerts' do

    it 'accept whatever authorization level with User 1' do
      sign_in(@user_1)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(2)
      expect(json['data']['incident']).to eq(1)
      expect(json['data']['tracing_request']).to eq(1)
    end

    it 'accept whatever authorization level with User 2' do
      sign_in(@user_2)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(0)
      expect(json['data']['incident']).to eq(0)
      expect(json['data']['tracing_request']).to eq(1)
    end

    it 'accept whatever authorization level with User 3' do
      sign_in(@user_3)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(0)
      expect(json['data']['incident']).to eq(0)
      expect(json['data']['tracing_request']).to eq(0)
    end

  end

  after :each do
    User.destroy_all
    Alert.destroy_all
    Child.destroy_all
    Incident.destroy_all
    TracingRequest.destroy_all
    Role.destroy_all
    Agency.destroy_all
  end

end