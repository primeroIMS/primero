require 'rails_helper'

describe Api::V2::ChildrenController, type: :request do

  before :each do
    @case1 = Child.create!(data: {name: "Test1", age: 5, sex: 'male'})
    @case2 = Child.create!(data: {name: "Test2", age: 10, sex: 'female'})
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases', search: true do

    it 'lists cases and accompanying metadata' do
      login_for_test
      get '/api/v2/cases'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{|c| c['name']}).to include(@case1.name, @case2.name)
      expect(json['metadata']['total']).to eq(2)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w(age sex))
      get '/api/v2/cases'

      record = json['data'][0]
      expect(record.keys).to match_array(%w(id age sex))
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get '/api/v2/cases'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

  end

  describe 'GET /api/v2/cases/:id' do
    it 'fetches the correct record' do
      login_for_test
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['id']).to eq(@case1.id)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w(age sex))
      get "/api/v2/cases/#{@case1.id}"

      expect(json.keys).to match_array(%w(id age sex))
    end

    it 'refuses unauthorized access' do
      login_for_test(group_permission: Permission::SELF)
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'reports that a record cannot be found for a non-existant id' do
      login_for_test
      get '/api/v2/cases/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end
  end

  after :each do
    Child.destroy_all
  end

end