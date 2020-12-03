# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ChildrenIncidentsController, type: :request do
  before :each do
    clean_data(Incident, Child)
    @case1 = Child.create!(
      data: { name: 'Test1', age: 5, sex: 'male', urgent_protection_concern: false }
    )
    @case2 = Child.create!(
      data: { name: 'Test2', age: 10, sex: 'female', urgent_protection_concern: true }
    )
    @incident1 = Incident.create!(
      case: @case1,
      data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' }
    )
    @incident2 = Incident.create!(
      case: @case1,
      data: { incident_date: Date.new(2019, 8, 1), description: 'Test 2' }
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases/:id/incidents' do
    it 'lists incidents associated with a case' do
      login_for_test
      get "/api/v2/cases/#{@case1.id}/incidents"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map { |c| c['description'] }).to include(@incident1.description, @incident2.description)
    end

    it 'returns an empty list when a case has no incidents' do
      login_for_test
      get "/api/v2/cases/#{@case2.id}/incidents"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(0)
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get "/api/v2/cases/#{@case1.id}/incidents"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/incidents")
    end
  end

  describe 'GET /api/v2/cases/:id/incidents/new' do
    it 'fetches the data of a new incident created from a case' do
      login_for_test(group_permission: Permission::ALL)
      get "/api/v2/cases/#{@case1.id}/incidents/new"

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq('open')
      expect(json['data']['age']).to eq(5)
      expect(json['data']['sex']).to eq('male')
    end
  end
end
