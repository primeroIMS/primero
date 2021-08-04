# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ChildrenController, type: :request do
  include ActiveJob::TestHelper

  before :each do
    clean_data(Alert, Flag, Attachment, Incident, Child, Agency, User, Role, Lookup, PrimeroModule)

    @agency = Agency.create!(name: 'Test Agency', agency_code: 'TA', services: ['Test type'])
    @cp = PrimeroModule.create!(unique_id: PrimeroModule::CP, name: 'CP', description: 'Child Protection',
                                associated_record_types: %w[case tracing_request incident])
    role_self = Role.create!(
      name: 'Test Role 3',
      unique_id: 'test-role-3',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )
    @group1 = UserGroup.create!(name: 'Group1')
    @user = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_2@localhost.com',
      agency_id: @agency.id,
      role: role_self,
      services: ['Test type']
    )
    @role_owned_others = Role.create!(
      name: 'Test Role Owned Others',
      unique_id: 'test-role-owned-others',
      group_permission: Permission::SELF,
      modules: [@cp],
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::CREATE,
            Permission::SEARCH_OWNED_BY_OTHERS
          ]
        )
      ]
    )
    @role1 = Role.create!(name: 'Role self permission', unique_id: 'role_self_permission', modules: [@cp],
                          referral: true, transfer: true, group_permission: 'self',
                          permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])])

    @user_owned_others = User.create!(
      full_name: 'Test User with Owned by Others',
      user_name: 'test_user_owned_others',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_owned_others@localhost.com',
      agency_id: @agency.id,
      role: @role_owned_others
    )

    @user_cp = User.create!(
      full_name: 'Test User with Owned by Others',
      user_name: 'user_cp',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'user_cp@localhost.com',
      agency_id: @agency.id,
      user_group_ids: [@group1.id],

      role: @role1
    )

    Lookup.create!(
      unique_id: 'lookup-service-type',
      name_en: 'Service Type',
      lookup_values_en: [
        { id: 'Test type', display_text: 'Safehouse Service' }.with_indifferent_access
      ]
    )
    @case1 = Child.create!(
      data: { name: 'Test1', age: 5, sex: 'male', urgent_protection_concern: false }
    )
    Attachment.new(
      record: @case1, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
    ).attach!
    @case2 = Child.create!(
      data: { name: 'Test2', age: 10, sex: 'female', urgent_protection_concern: true },
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request'),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request')
      ]
    )
    @unique_id_mother = SecureRandom.uuid
    @unique_id_father = SecureRandom.uuid
    @unique_id_uncle = SecureRandom.uuid
    @case3 = Child.create!(
      data: {
        name: 'Test3', age: 6, sex: 'male',
        family_details: [
          { unique_id: @unique_id_mother, relation_type: 'mother', age: 33 },
          { unique_id: @unique_id_father, relation_type: 'father', age: 32 }
        ]
      },
      alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request')]
    )
    @case4 = Child.new_with_user(
      @user_owned_others,
      name: 'Test4', age: 2, sex: 'male'
    )
    @case4.save!
    @case5 = Child.new_with_user(
      @user_owned_others,
      name: 'Test5', age: 16, sex: 'female',
      module_id: 'primeromodule-gbv',
      assigned_user_names: [@user_cp.user_name]
    )
    @case5.save!
    @tracing_request1 = TracingRequest.create!(data: { relation_name: 'Tracing Request 5' })
    @trace1 = Trace.create!(
      data: { name: 'Trace Test 1' },
      matched_case: @case4,
      tracing_request: @tracing_request1
    )
    @trace2 = Trace.create!(
      data: { name: 'Trace Test 2' },
      matched_case: @case4,
      tracing_request: @tracing_request1
    )
    @incident1 = Incident.create!(
      case: @case1,
      data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' }
    )
    # This is legitimate. The cases are implicitly reloaded in the attachments & flagging api
    reloaded_cases = [@case1, @case2, @case3, @case4, @case5].map(&:reload)
    Sunspot.index(*reloaded_cases)
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases', search: true do
    it 'lists cases and accompanying metadata' do
      login_for_test
      get '/api/v2/cases'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(5)
      expect(json['data'].map { |c| c['name'] }).to include(@case1.name, @case2.name)
      expect(json['metadata']['total']).to eq(5)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
      case1_data = json['data'].find { |r| r['id'] == @case1.id }
      expect(case1_data['alert_count']).to eq(0)
      case2_data = json['data'].find { |r| r['id'] == @case2.id }
      expect(case2_data['alert_count']).to eq(2)
      case3_data = json['data'].find { |r| r['id'] == @case3.id }
      expect(case3_data['alert_count']).to eq(1)
      case4_data = json['data'].find { |r| r['id'] == @case4.id }
      expect(case4_data['alert_count']).to eq(0)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w[age sex])
      get '/api/v2/cases'

      record = json['data'][0]
      expect(record.keys).to include('id', 'age', 'sex', 'workflow')
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get '/api/v2/cases'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

    it 'returns photos for the short form' do
      login_for_test(permitted_field_names: (common_permitted_field_names << 'photos'))
      get '/api/v2/cases?fields=short'

      expect(response).to have_http_status(200)
      photo = json['data'].select { |child| child['name'] == 'Test1' }.first['photo']
      expect(photo).to match(/.+jorge\.jpg$/)
    end

    it 'returns flag_count for the short form ' do
      @case1.add_flag('This is a flag', Date.today, 'faketest')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/cases?fields=short'

      expect(response).to have_http_status(200)
      expect(json['data'].find { |r| r['name'] == @case1.name }['flag_count']).to eq(1)
    end

    it 'returns alert_count for the short form ' do
      @case1.add_alert(alert_for: 'transfer_request', date: Date.today, form_sidebar_id: 'transfer_request')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/cases?fields=short'

      expect(response).to have_http_status(200)
      expect(json['data'].find { |r| r['name'] == @case1.name }['alert_count']).to eq(1)
      expect(json['data'].find { |r| r['name'] == @case2.name }['alert_count']).to eq(2)
      expect(json['data'].find { |r| r['name'] == @case3.name }['alert_count']).to eq(1)
    end

    it 'Search flagged children' do
      @case1.add_flag('This is a flag', Date.today, 'faketest')
      Sunspot.index(@case1.reload)
      Sunspot.commit

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/cases?flagged=true'

      expect(response).to have_http_status(200)
      expect(json['data'][0]['flag_count']).to eq(1)
      expect(json['data'][0]['id']).to eq(@case1.id)
    end

    it 'Search through photo' do
      login_for_test(permissions: permission_flag_record)

      get '/api/v2/cases?has_photo=true'
      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(1)
      expect(json['data'][0]['id']).to eq(@case1.id)
    end

    it 'Filter by urgent_protection_concern true' do
      login_for_test(permitted_field_names: ['urgent_protection_concern'])
      get '/api/v2/cases?urgent_protection_concern=true'

      expect(json['data'].count).to eq(1)
      expect(json['data'][0]['id']).to eq(@case2.id)
      expect(json['data'][0]['urgent_protection_concern']).to be_truthy
      expect(response).to have_http_status(200)
    end

    it 'Filter by urgent_protection_concern false' do
      login_for_test(permitted_field_names: ['urgent_protection_concern'])
      get '/api/v2/cases?urgent_protection_concern=false'

      expect(json['data'].count).to eq(1)
      expect(json['data'][0]['id']).to eq(@case1.id)
      expect(json['data'][0]['urgent_protection_concern']).to be_falsey
      expect(response).to have_http_status(200)
    end

    context 'when a user can only see his own records but has search_owned_by_others' do
      it 'lists only those cases a user has permission to see' do
        sign_in(@user_owned_others)

        get '/api/v2/cases'

        expect(json['data'].count).to eq(2)
        expect(response).to have_http_status(200)
      end

      it 'list all cases if the param id_search=true' do
        sign_in(@user_owned_others)

        get '/api/v2/cases?id_search=true'

        expect(json['data'].count).to eq(5)
        expect(response).to have_http_status(200)
      end
    end

    it 'return records sort by age' do
      login_for_test
      get '/api/v2/cases?fields=short&order=asc&order_by=age'
      expect(json['data'].count).to eq(5)
      expect(json['data'].map { |rr| rr['age'] }).to eq([2, 5, 6, 10, 16])
    end

    context 'when a gbv case has in the associated_user_names a cp user' do

      it 'should be part of the response' do
        login_for_test(
          user_name: 'user_cp',
          permissions: @role1.permissions,
          group_permission: Permission::SELF,
          modules: [@cp],
          user_group_ids: [@group1.id]
        )
        get '/api/v2/cases'

        expect(response).to have_http_status(200)
        expect(json['data'].map { |c| c['id'] }).to include(@case5.id)
      end
    end
  end

  describe 'GET /api/v2/cases/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
    end

    it 'fetches the correct record with code 200 and verify flag count' do
      login_for_test

      @case1.add_alert(alert_for: 'transfer_request', date: Date.today, form_sidebar_id: 'transfer_request')
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
      expect(json['data']['alert_count']).to eq(1)
    end

    it 'shows relevant fields' do
      login_for_test(permitted_field_names: %w[age sex])
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data'].keys).to include('id', 'age', 'sex', 'workflow')
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test(group_permission: Permission::SELF)
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test
      get '/api/v2/cases/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end

    it 'returns the photos for the case' do
      login_for_test(permitted_field_names: (common_permitted_field_names << 'photos'))
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      photo = json['data']['photo']
      expect(photo).to match(/.+jorge\.jpg$/)
    end

    it 'contains incidents embedded in the incident_details hash array' do
      login_for_test(permitted_field_names: (common_permitted_field_names << 'incident_details'))
      get "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['incident_details'].size).to eq(1)
      expect(json['data']['incident_details'][0]['unique_id']).to eq(@incident1.id)
      expect(json['data']['incident_details'][0]['description']).to eq(@incident1.data['description'])
    end

    it 'enqueues an audit log job that records the case read attempt' do
      login_for_test
      get "/api/v2/cases/#{@case1.id}"

      expect(AuditLogJob).to have_been_enqueued
        .with(record_type: 'Child',
              record_id: @case1.id,
              action: 'show',
              user_id: fake_user_id, # This is technically wrong, but an artifact of the way we do tests
              resource_url: request.url,
              metadata: { user_name: fake_user_name })
    end

    it 'obfuscates the case name when hidden' do
      @case1.hidden_name = true
      @case1.save!

      login_for_test(permitted_field_names: %w[name])
      get "/api/v2/cases/#{@case1.id}"

      expect(json['data']['name']).to eq('*******')
      expect(json['data']['hidden_name']).to be true
    end
  end

  describe 'POST /api/v2/cases' do
    let(:params) { { data: { name: 'Test', age: 12, sex: 'female' } } }

    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test

      post '/api/v2/cases', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['name']).to eq(params[:data][:name])
      expect(json['data']['age']).to eq(params[:data][:age])
      expect(json['data']['sex']).to eq(params[:data][:sex])
      expect(Child.find_by(id: json['data']['id'])).not_to be_nil
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)

      login_for_test

      post '/api/v2/cases', params: params, as: :json

      %w[data].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end

    describe 'empty response' do
      let(:json) { nil }

      it 'creates a new record with 204 and returns no JSON if the client generated the id' do
        login_for_test
        id = SecureRandom.uuid
        params = {
          data: { id: id, name: 'Test', age: 12, sex: 'female' }
        }
        post '/api/v2/cases', params: params, as: :json

        expect(response).to have_http_status(204)
        expect(Child.find_by(id: id)).not_to be_nil
      end
    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test(permissions: [])
      id = SecureRandom.uuid
      params = {
        data: { id: id, name: 'Test', age: 12, sex: 'female' }
      }
      post '/api/v2/cases', params: params, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
      expect(Child.find_by(id: id)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test
      params = {
        data: { id: @case1.id, name: 'Test', age: 12, sex: 'female' }
      }
      post '/api/v2/cases', params: params, as: :json

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
        data: { name: 'Test', age: 12, sex: 'female', date_of_birth: 'is invalid' }
      }
      post '/api/v2/cases', params: params, as: :json

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end
  end

  describe 'PATCH /api/v2/cases/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
      expect(json['data']['age']).to eq(10)
      expect(json['data']['sex']).to eq('female')
      expect(json['data']['last_updated_at']).to be

      case1 = Child.find_by(id: @case1.id)
      expect(case1.data['age']).to eq(10)
      expect(case1.data['sex']).to eq('female')
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      %w[data].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end

    it 'treats numerically formatted strings wih leading 0s as strings' do
      login_for_test
      params = { data: { national_id_no: '001' } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(@case1.reload.data['national_id_no']).to eq('001')
    end

    it 'treats numerically formatted strings as strings' do
      login_for_test
      params = { data: { national_id_no: '155' } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(@case1.reload.data['national_id_no']).to eq('155')
    end

    it 'appends to rather than replaces nested forms' do
      login_for_test
      params = {
        data: {
          family_details: [
            { unique_id: @unique_id_mother, relation_type: 'mother', age: 35 },
            { unique_id: @unique_id_uncle, relation_type: 'uncle', age: 50 }
          ]
        }
      }
      patch "/api/v2/cases/#{@case3.id}", params: params, as: :json

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details']
      uncle = family_details.select { |f| f['unique_id'] == @unique_id_uncle && f['relation_type'] == 'uncle' }
      expect(family_details.size).to eq(3)
      expect(uncle.present?).to be true
    end

    it 'removes nested forms marked for deletion' do
      login_for_test
      params = {
        data: {
          family_details: [
            { unique_id: @unique_id_mother, _destroy: true },
            { unique_id: @unique_id_uncle, relation_type: 'uncle', age: 50 }
          ]
        }
      }
      patch "/api/v2/cases/#{@case3.id}", params: params, as: :json

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details']
      mother = family_details.select { |f| f['unique_id'] == @unique_id_mother && f['relation_type'] == 'mother' }
      expect(family_details.size).to eq(2)
      expect(mother.present?).to be false
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test(permissions: [])
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 404 when trying to update a record with a non-existant id' do
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch '/api/v2/cases/thisdoesntexist', params: params, as: :json

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
        data: { name: 'Test', age: 12, sex: 'female', date_of_birth: 'is invalid' }
      }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'sets the case name to be hidden' do
      login_for_test
      params = { data: { hidden_name: true } }
      patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

      expect(response).to have_http_status(200)

      case1 = Child.find_by(id: @case1.id)
      expect(case1.hidden_name).to be true
    end

    describe 'when a user adds a service subform' do
      it 'updates the subforms if cannot update the record' do
        login_for_test(
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::SERVICES_SECTION_FROM_CASE]
            )
          ]
        )

        params = {
          data: { name: 'Tester 1', services_section: [{ service_type: 'Test type' }] },
          record_action: Permission::SERVICES_SECTION_FROM_CASE
        }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['services_section'].first['service_type']).to eq('Test type')
        expect(json['data']['name']).to be_nil
        @case1.reload
        expect(@case1.name).to eq('Test1')
      end

      it 'updates the subforms if cannot read/write cases' do
        login_for_test(
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [
                Permission::SERVICES_SECTION_FROM_CASE
              ]
            )
          ]
        )

        params = {
          data: { services_section: [{ service_type: 'Test type' }] },
          record_action: Permission::SERVICES_SECTION_FROM_CASE
        }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['services_section'].first['service_type']).to eq('Test type')
        expect(json['data']['name']).to be_nil
        @case1.reload
        expect(@case1.name).to eq('Test1')
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)
        params = {
          data: { services_section: [{ service_type: 'Test type' }] },
          record_action: Permission::SERVICES_SECTION_FROM_CASE
        }
        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      end
    end

    describe 'when a user closes a case that cannot be updated' do
      it 'close the case if he is authorized to close cases' do
        login_for_test(
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::CLOSE]
            )
          ]
        )

        params = { data: { status: 'closed' }, record_action: Permission::CLOSE }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Record::STATUS_CLOSED)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { status: 'closed' }, record_action: Permission::CLOSE }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      end
    end

    describe 'when a user reopens a case that cannot update' do
      before do
        @case1.status = Record::STATUS_CLOSED
        @case1.save!
        @case1.reload
      end

      it 'reopens the case if he is authorized to reopen cases' do
        login_for_test(
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::REOPEN]
            )
          ]
        )

        params = { data: { status: 'open', case_status_reopened: true }, record_action: Permission::REOPEN }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Record::STATUS_OPEN)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { status: 'open', case_reopened: true }, record_action: Permission::REOPEN }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      end
    end

    describe 'when a user disables a case that cannot update' do
      it 'disables the case if he is authorized to disable cases' do
        login_for_test(
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::ENABLE_DISABLE_RECORD]
            )
          ]
        )

        params = { data: { record_state: false }, record_action: Permission::ENABLE_DISABLE_RECORD }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['record_state']).to eq(false)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { record_state: false }, record_action: Permission::ENABLE_DISABLE_RECORD }

        patch "/api/v2/cases/#{@case1.id}", params: params, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      end
    end
  end

  describe 'DELETE /api/v2/cases/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::ENABLE_DISABLE_RECORD])]
      )
      delete "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)

      case1 = Child.find_by(id: @case1.id)
      expect(case1.record_state).to be false
    end

    it "returns 403 if user isn't authorized to disable records" do
      login_for_test(permissions: [])
      delete "/api/v2/cases/#{@case1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 404 when trying to disable a record with a non-existant id' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::ENABLE_DISABLE_RECORD])]
      )
      delete '/api/v2/cases/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end
  end

  describe 'GET /api/v2/cases/:id/traces' do
    it 'successfully returns the traces with a code of 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::READ])])

      get "/api/v2/cases/#{@case4.id}/traces"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map { |c| c['id'] }).to include(@trace1.id, @trace2.id)
    end

    it 'returns 403 if the user is not authorized' do
      login_for_test(permissions: [])

      get "/api/v2/cases/#{@case4.id}/traces"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case4.id}/traces")
    end

    it 'returns 404 if the case does not exist' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::READ])])

      get '/api/v2/cases/thisdoesntexist/traces'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist/traces')
    end
  end

  after :each do
    clean_data(Trace, Alert, Flag, Attachment, Child, Agency, User, Role, Lookup, PrimeroModule)
    clear_performed_jobs
    clear_enqueued_jobs
  end
end
