require 'rails_helper'

describe Api::V2::ChildrenController, type: :request, search: true do

  before :each do
    @case1 = Child.create!(data: {name: "Test1", age: 5, sex: 'male'})
    @case2 = Child.create!(data: {name: "Test2", age: 10, sex: 'female'})
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases' do

    it 'lists cases and accompanying metadata' do
      fake_test_login
      get '/api/v2/cases'

      expect(json['data'].size).to eq(2)
      expect(json['data'].map{|c| c['name']}).to include(@case1.name, @case2.name)
      expect(json['metadata']['total']).to eq(2)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'shows relevant fields' do
      fake_test_login(permitted_field_names: %w(age sex))
      get '/api/v2/cases'

      record = json['data'][0]
      expect(record.keys).to match_array(%w(id age sex))
    end

    it 'refuses unauthorized access' do
      fake_test_login(permissions: [])
      get '/api/v2/cases'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

  end

  after :each do
    Child.destroy_all
    User.destroy_all
  end

end