require 'rails_helper'

describe Api::V2::LocationsController, type: :request do

  before :each do
    Location.destroy_all
    @locations_CT01 = Location.create!(
        location_code: 'CT01',
        type: 'country',
        admin_level: '0',
        placename_i18n: { en: 'Country01_en', es: 'Country01_es' }
    )
    @locations_D01 = Location.create!(
        location_code: 'D01',
        type: 'departament',
        placename_i18n: { en: 'Departament01_en', es: 'Departament01_es' },
        hierarchy_path: 'CT01.D01'
    )
    @locations_D02 = Location.create!(
        location_code: 'D02',
        type: 'departament',
        placename_i18n: { en: 'Departament02_en', es: 'Departament02_es' },
        hierarchy_path: 'CT01.D02'
    )

  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/locations' do

    it 'lists locations without hierarchy param' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get '/api/v2/locations'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map{|c| c['code']}).to include(@locations_CT01.location_code, @locations_D01.location_code, @locations_D02.location_code)
      expect(json['data'].map{|c| c['type']}).to include(@locations_CT01.type, @locations_D01.type, @locations_D02.type)
      expect(json['data'].map{|c| c['name']}[0]).to include(FieldI18nService.strip_i18n_suffix(@locations_CT01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[1]).to include(FieldI18nService.strip_i18n_suffix(@locations_D01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[2]).to include(FieldI18nService.strip_i18n_suffix(@locations_D02.slice(:name_i18n))['name'])
    end

    it 'lists locations with hierarchy param false' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get '/api/v2/locations?hierarchy=false'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map{|c| c['code']}).to include(@locations_CT01.location_code, @locations_D01.location_code, @locations_D02.location_code)
      expect(json['data'].map{|c| c['type']}).to include(@locations_CT01.type, @locations_D01.type, @locations_D02.type)
      expect(json['data'].map{|c| c['name']}[0]).to include(FieldI18nService.strip_i18n_suffix(@locations_CT01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[1]).to include(FieldI18nService.strip_i18n_suffix(@locations_D01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[2]).to include(FieldI18nService.strip_i18n_suffix(@locations_D02.slice(:name_i18n))['name'])
    end

    it 'lists locations with hierarchy param true' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get '/api/v2/locations?hierarchy=true'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map{|c| c['code']}).to include(@locations_CT01.location_code, @locations_D01.location_code, @locations_D02.location_code)
      expect(json['data'].map{|c| c['type']}).to include(@locations_CT01.type, @locations_D01.type, @locations_D02.type)
      expect(json['data'].map{|c| c['admin_level']}).to include(@locations_CT01.admin_level, @locations_D01.admin_level, @locations_D02.admin_level)
      expect(json['data'].map{|c| c['name']}[0]).to include(FieldI18nService.strip_i18n_suffix(@locations_CT01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[1]).to include(FieldI18nService.strip_i18n_suffix(@locations_D01.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['name']}[2]).to include(FieldI18nService.strip_i18n_suffix(@locations_D02.slice(:name_i18n))['name'])
      expect(json['data'].map{|c| c['placename']}[2]).to include(FieldI18nService.strip_i18n_suffix(@locations_D02.slice(:placename_i18n))['placename'])
      expect(json['data'][0]['hierarchy']).to be_empty
      expect(json['data'][1]['hierarchy']).to eq([@locations_CT01.location_code])
      expect(json['data'][2]['hierarchy']).to eq([@locations_CT01.location_code])
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get '/api/v2/locations'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/locations')
    end

  end

  describe 'POST /api/v2/locations' do

    it 'creates a new location and returns 200 and json' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'CI01',
          type: 'city',
          placename: { en: 'city01_en', es: 'city01_es'},
          parent_code: 'D02'}
      }
      post '/api/v2/locations', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(json['data']['code']).to eq(params[:data][:code])
      expect(json['data']['type']).to eq(params[:data][:type])
      expect(json['data']['hierarchy']).to eq(['CT01', 'D02'])
      expect(json['data']['placename']['en']).to eq(params[:data][:placename][:en])
      expect(json['data']['placename']['es']).to eq(params[:data][:placename][:es])
    end

    it 'creates a new record parent with 200 and returns it as JSON' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'CT02',
          type: 'country',
          admin_level: '0',
          placename: { en: 'country02_en', es: 'country02_en'},
          parent_code: ''
        }
      }
      post '/api/v2/locations', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(json['data']['code']).to eq(params[:data][:code])
      expect(json['data']['type']).to eq(params[:data][:type])
      expect(json['data']['hierarchy']).to be_empty
      expect(json['data']['placename']['en']).to eq(params[:data][:placename][:en])
      expect(json['data']['placename']['es']).to eq(params[:data][:placename][:es])
    end

    it 'returns a 422 if admin_level is blank and record is a top level' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'CT02',
          type: 'country',
          placename: { en: 'country02_en', es: 'country02_es'},
          parent_code: ''
        }
      }
      post "/api/v2/locations", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations")
      expect(json['errors'][0]['detail']).to eq("admin_level")
      expect(json['errors'][0]['message']).to eq(["must not be blank"])
    end

    it 'returns a 422 if location_code is blank' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          type: 'departament',
          placename: { en: 'departament03_en', es: 'departament03_es'},
          parent_code: 'CT01'
        }
      }
      post "/api/v2/locations", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eql('/api/v2/locations')
      expect(json['errors'][0]['detail']).to eql('location_code')
      expect(json['errors'][0]['message']).to eql(["must not be blank"])
    end

    it 'returns a 422 if location_code is repeated' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'D01',
          type: 'departament',
          placename: { en: 'Departament01_en', es: 'Departament01_es' },
          parent_code: 'CT01'
        }
      }
      post "/api/v2/locations", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations")
      expect(json['errors'][0]['detail']).to eq("location_code")
      expect(json['errors'][0]['message']).to eq(["A Location with that location code already exists, please enter a different location code"])
    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test(permissions: [])
      id = SecureRandom.uuid
      params = {
        id: id, data: {location_code: 'CI01', type: 'city',
        placename: { en: 'city01_en', es: 'city01_es'}, hierarchy_path: 'CT01.D02.CI01'}
      }
      post "/api/v2/locations", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations")
      expect(Location.find_by(id: id)).to be_nil
    end

  end

  describe 'GET /api/v2/locations/:id' do

    it 'fetches the correct parent record' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get "/api/v2/locations/#{@locations_CT01.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@locations_CT01.id)
      expect(json['data']['hierarchy']).to eq(@locations_CT01.hierarchy)
    end

    it 'fetches the correct child record' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get "/api/v2/locations/#{@locations_D01.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@locations_D01.id)
      expect(json['data']['hierarchy']).to eq(@locations_D01.hierarchy)
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test(group_permission: Permission::SELF)
      get "/api/v2/locations/#{@locations_D02.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations/#{@locations_D02.id}")
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      get '/api/v2/locations/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/locations/thisdoesntexist')
    end

  end

  describe 'DELETE /api/v2/locations/:id' do

    it 'successfully deletes a record with a code of 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      delete "/api/v2/locations/#{@locations_D01.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@locations_D01.id)

      location1 = Location.find_by(id: @locations_D01.id)
      expect(location1).to be nil
    end

    it "returns 403 if user isn't authorized to disable records" do
      login_for_test(permissions: [])
      delete "/api/v2/locations/#{@locations_D02.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations/#{@locations_D02.id}")
    end

    it 'returns a 404 when trying to disable a record with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      delete '/api/v2/locations/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/locations/thisdoesntexist')
    end
  end

  describe 'PATCH /api/v2/locations/:id' do
    it 'updates an existing child record with 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'D03',
          type: 'departament3',
          placename: { en: 'Departament03_en', es: 'Departament03_es' },
          parent_code: 'CT01'}
      }
      patch "/api/v2/locations/#{@locations_D02.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['code']).to eq(params[:data][:code])
      expect(json['data']['type']).to eq(params[:data][:type])
      expect(json['data']['hierarchy']).to eq(['CT01'])
      expect(json['data']['placename']['en']).to eq(params[:data][:placename][:en])
      expect(json['data']['placename']['es']).to eq(params[:data][:placename][:es])
    end

    it 'updates an existing parent record and observe changes in children' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          code: 'CT02',
          type: 'country',
          admin_level: '0',
          placename: { en: 'Country02_en', es: 'Country02_es' }
        }
      }
      patch "/api/v2/locations/#{@locations_CT01.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['code']).to eq(params[:data][:code])
      expect(json['data']['hierarchy']).to be_empty
      expect(json['data']['placename']['en']).to eq(params[:data][:placename][:en])
      expect(json['data']['placename']['es']).to eq(params[:data][:placename][:es])

      child = Location.find(@locations_D02.id)
      expect(child.hierarchy).to eq(["CT02"])
      expect(child.name_es).to eq("Country02_es::Departament02_es")
      expect(child.name_en).to eq("Country02_en::Departament02_en")
    end

    it 'updates an existing parent record without admin_level and get a 422' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          location_code: 'CT02',
          type: 'country',
          placename: { en: 'Country02_en', es: 'Country02_es' },
          parent_code: ''
        }
      }
      patch "/api/v2/locations/#{@locations_CT01.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations/#{@locations_CT01.id}")
      expect(json['errors'][0]['detail']).to eq("admin_level")
      expect(json['errors'][0]['message']).to eq(["must not be blank"])
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test(permissions: [])
      params = {
        data: {
          location_code: 'CT02',
          type: 'country',
          admin_level: '0',
          placename: { en: 'Country02_en', es: 'Country02_es' },
          parent_code: ''
      }
      }
      patch "/api/v2/locations/#{@locations_CT01.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/locations/#{@locations_CT01.id}")
    end

    it 'returns a 404 when trying to update a record with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA)
        ]
      })
      params = {
        data: {
          location_code: 'CT02',
          type: 'country',
          admin_level: '0',
          placename: { en: 'Country02_en', es: 'Country02_es' },
          parent_code: 'CT02'
        }
      }
      patch '/api/v2/locations/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/locations/thisdoesntexist')
    end

  end

  after :each do
    Location.destroy_all
  end

end