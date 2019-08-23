require 'rails_helper'

describe Api::V2::IncidentsController, type: :request do

  before :each do
    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2' })
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/incidents', search: true do
    it 'lists incidents and accompanying metadata' do
      login_for_test
      get '/api/v2/incidents'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{|c| c['description']}).to include(@incident1.description , @incident2.description)
      expect(json['metadata']['total']).to eq(2)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'returns flag_count for the short form ' do
      @incident1.add_flag('This is a flag IN', Date.today, 'faketest')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/incidents?fields=short'

      expect(response).to have_http_status(200)
      expect(json['data'][0]['flag_count']).to eq(1)

    end
  end

  describe 'GET /api/v2/incidents/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/incidents/#{@incident1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)
    end
  end

  describe 'POST /api/v2/incidents' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = {data: {incident_date: '2019-04-01', description: 'Test' }}
      post '/api/v2/incidents', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['incident_date']).to eq(params[:data][:incident_date])
      expect(json['data']['description']).to eq(params[:data][:description])
      expect(Incident.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'PATCH /api/v2/incidents/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = {data: {incident_date: '2019-04-01', description: 'Tester' }}
      patch "/api/v2/incidents/#{@incident1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)

      incident1 = Incident.find_by(id: @incident1.id)
      expect(incident1.data['incident_date'].iso8601).to eq(params[:data][:incident_date])
      expect(incident1.data['description']).to eq(params[:data][:description])
    end
  end

  describe 'DELETE /api/v2/incidents/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::INCIDENT, actions: [Permission::ENABLE_DISABLE_RECORD])])
      delete "/api/v2/incidents/#{@incident1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)

      incident1 = Incident.find_by(id: @incident1.id)
      expect(incident1.record_state).to be false
    end
  end

end
