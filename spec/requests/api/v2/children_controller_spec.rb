# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::ChildrenController, type: :request do
  include ActiveJob::TestHelper

  before :each do
    clean_data(
      Alert, Flag, Attachment, Trace, Incident, Child, User, Agency, Role, Lookup, PrimeroModule, RegistryRecord,
      Family, Field, FormSection, Location
    )

    @agency = Agency.create!(name: 'Test Agency', agency_code: 'TA', services: ['Test type'])
    @cp = PrimeroModule.create!(unique_id: PrimeroModule::CP, name: 'CP', description: 'Child Protection',
                                associated_record_types: %w[case tracing_request incident])
    @form_a = FormSection.create!(
      unique_id: 'form_a', name: 'A', parent_form: 'case', form_group_id: 'm', fields: [
        Field.create!(name: 'field_a', display_name: 'Field A', type: Field::TEXT_FIELD)
      ]
    )

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
    @role_restricted = Role.new_with_properties(
      name: 'Role restricted',
      unique_id: 'role-restricted',
      group_permission: Permission::SELF,
      modules: [@cp],
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::CREATE,
            Permission::REFERRAL,
            Permission::RECEIVE_REFERRAL
          ]
        )
      ],
      form_section_read_write: { @form_a.unique_id => 'rw' }
    )
    @role_restricted.save!

    @cp.form_sections = [@form_a]
    @cp.roles = [@role_restricted]
    @cp.save!

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

    @user_referral = User.create!(
      full_name: 'User referral',
      user_name: 'user_referral',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'user_referral@localhost.com',
      agency_id: @agency.id,
      role: @role_restricted
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
    Location.create!(placename: 'Country', type: 'country', location_code: 'LOC')
    Location.create!(placename: 'State', type: 'state', location_code: 'LOC01', hierarchy_path: 'LOC.LOC01')
    Location.create!(placename: 'City', type: 'city', location_code: 'LOC0102', hierarchy_path: 'LOC.LOC01.LOC0102')

    Lookup.create!(
      unique_id: 'lookup-service-type',
      name_en: 'Service Type',
      lookup_values_en: [
        { id: 'Test type', display_text: 'Safehouse Service' }.with_indifferent_access
      ]
    )
    @registry_record1 = RegistryRecord.create!(
      registry_type: 'farmer', name: 'Jones', registry_no: 'GH123.ABC123'
    )
    @case1 = Child.create!(
      data: { name: 'Test1', age: 5, sex: 'male', urgent_protection_concern: false, location_current: 'LOC0102' },
      registry_record: @registry_record1
    )
    Attachment.new(
      record: @case1, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
    ).attach!
    @case2 = Child.create!(
      data: { name: 'Test2', age: 10, sex: 'female', urgent_protection_concern: true, location_current: 'LOC0102' },
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
        name: 'Test3', age: 6, sex: 'male', location_current: 'LOC0101',
        family_details_section: [
          { unique_id: @unique_id_mother, relation_type: 'mother', relation_age: 33 },
          { unique_id: @unique_id_father, relation_type: 'father', relation_age: 32 }
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
    @member_unique_id1 = SecureRandom.uuid
    @member_unique_id2 = SecureRandom.uuid
    @member_unique_id3 = SecureRandom.uuid
    @member_unique_id4 = SecureRandom.uuid
    @member_unique_id5 = SecureRandom.uuid
    @member_unique_id6 = SecureRandom.uuid
    @member_unique_id7 = SecureRandom.uuid
    @case6 = Child.new(
      data: { name: 'Member 1', age: 5, sex: 'male', family_member_id: @member_unique_id1 }
    )
    @family1 = Family.create!(
      data: {
        family_number: '001',
        family_members: [
          { unique_id: @member_unique_id1, relation_name: 'Member 1', relation_sex: 'male', relation_age: 5 },
          { unique_id: @member_unique_id6, relation_name: 'Member 2', relation_sex: 'male', relation_age: 8 }
        ]
      }
    )
    @family2 = Family.create!(
      data: {
        family_number: '001',
        family_members: [
          { unique_id: @member_unique_id2, relation_name: 'Test8 - Member1', relation_sex: 'female', relation_age: 9 },
          { unique_id: @member_unique_id4, relation_name: 'Test8 - Member2', relation_sex: 'male', relation_age: 10 },
          { unique_id: @member_unique_id5, relation_name: 'Test8 - Member3', relation_sex: 'male', relation_age: 4 }
        ]
      }
    )
    @family3 = Family.create!(data: { family_number: '003', family_name: 'FamilyTest' })
    @family4 = Family.create!(
      data: { family_number: '004', family_size: 2, family_notes: 'NotesFamilyTest2', family_name: 'FamilyTest2' }
    )
    @family5 = Family.create!(
      data: {
        family_number: '005',
        family_name: 'FamilyTest3',
        family_members: [
          { unique_id: @member_unique_id7, relation_name: 'Member1', relation_sex: 'female', relation_age: 9 }
        ]
      }
    )
    @case6.family = @family1
    @case6.save!
    @case7 = Child.create!(
      data: {
        name: 'Test7',
        age: 12,
        sex: 'male',
        family_details_section: [{ unique_id: @member_unique_id3, relation_sex: 'male', relation_age: 5 }]
      }
    )
    @case8 = Child.create!(
      family: @family2, data: { name: 'Test8', age: 9, sex: 'female', family_member_id: @member_unique_id2 }
    )
    @case9 = Child.create!(data: { name: 'Test9', age: 10, sex: 'male' })
    @case10 = Child.create!(data: { name: 'Test10', age: 18, sex: 'female' })
    @case11 = Child.create!(
      data: {
        name: 'Test11', age: 17, sex: 'female', owned_by: 'user_cp', module_id: @cp.unique_id,
        disclosure_other_orgs: true, consent_for_services: true, field_a: 'value for field_a'
      }
    )
    @referral1 = Referral.create!(
      transitioned_by: 'user_cp', transitioned_to: 'user_referral', record: @case11,
      authorized_role_unique_id: 'role-restricted'
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases', search: true do
    it 'lists cases and accompanying metadata' do
      login_for_test
      get '/api/v2/cases'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(11)
      expect(json['data'].map { |c| c['name'] }).to include(@case1.name, @case2.name)
      expect(json['metadata']['total']).to eq(11)
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

    it_behaves_like 'a paginated resource' do
      let(:action) { { resource: 'cases' } }
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
      @case_flagged = Child.create!(data: { name: 'Case Flagged', age: 5, sex: 'male' })
      @case_flagged.add_flag!('This is a flag', Date.today, 'faketest')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/cases?flagged=true'

      expect(response).to have_http_status(200)
      expect(json['data'][0]['flag_count']).to eq(1)
      expect(json['data'][0]['id']).to eq(@case_flagged.id)
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

      expect(json['data'].count).to eq(10)
      expect(json['data'].map { |elem| elem['id'] }).to match_array(
        [@case1.id, @case3.id, @case4.id, @case5.id, @case6.id, @case7.id, @case8.id, @case9.id, @case10.id, @case11.id]
      )
      expect(json['data'].map { |elem| elem['urgent_protection_concern'] }).to all(be_falsey)
      expect(response).to have_http_status(200)
    end

    it 'returns an empty response for an invalid filter and logs the error' do
      allow(Rails.logger).to receive(:error).and_return(nil)
      login_for_test

      get '/api/v2/cases?associated_user_names=List["user1"]'
      expect(response).to have_http_status(200)
      expect(json['metadata']['total']).to eq(0)
      expect(json['data']).to be_empty
      expect(Rails.logger).to have_received(:error)
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

        expect(json['data'].count).to eq(11)
        expect(response).to have_http_status(200)
      end
    end

    it 'return records sort by age' do
      login_for_test
      get '/api/v2/cases?fields=short&order=asc&order_by=age'
      expect(json['data'].count).to eq(11)
      expect(json['data'].map { |rr| rr['age'] }).to eq([2, 5, 5, 6, 9, 10, 10, 12, 16, 17, 18])
    end

    it 'return records by location_current' do
      login_for_test
      get '/api/v2/cases?fields=short&loc:location_current[0]=LOC0102'
      expect(json['data'].count).to eq(2)
      expect(json['data'].map { |c| c['id'] }).to match_array([@case1.id, @case2.id])
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

    describe 'registry_record_id' do
      context 'when user does not have registry_record_permission' do
        before do
          login_for_test(
            permissions: [
              Permission.new(resource: Permission::CASE, actions: [Permission::READ])
            ]
          )
        end

        it 'does not return registry_id' do
          get "/api/v2/cases/#{@case1.id}"

          expect(response).to have_http_status(200)
          expect(json['data']['registry_record_id']).to be_nil
        end
      end

      context 'when user has view registry permission' do
        before do
          login_for_test(
            permissions: [
              Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::VIEW_REGISTRY_RECORD])
            ]
          )
        end

        it 'returns registry_id' do
          get "/api/v2/cases/#{@case1.id}"

          expect(response).to have_http_status(200)
          expect(json['data']['registry_record_id']).to eq(@registry_record1.id)
        end
      end

      context 'when user has add registry permission' do
        before do
          login_for_test(
            permissions: [
              Permission.new(
                resource: Permission::CASE,
                actions: [Permission::READ, Permission::WRITE, Permission::ADD_REGISTRY_RECORD]
              )
            ]
          )
        end

        it 'returns registry_id' do
          get "/api/v2/cases/#{@case1.id}"

          expect(response).to have_http_status(200)
          expect(json['data']['registry_record_id']).to eq(@registry_record1.id)
        end

        it 'associates a registry record' do
          params = { data: { registry_record_id: @registry_record1.id } }
          patch "/api/v2/cases/#{@case2.id}", params:, as: :json

          expect(response).to have_http_status(200)
          expect(json['data']['registry_record_id']).to eq(@registry_record1.id)
          expect(json['data']['registry_name']).to eq(@registry_record1.name)
          expect(json['data']['registry_no']).to eq(@registry_record1.registry_no)
          expect(json['data']['registry_id_display']).to eq(@registry_record1.registry_id_display)
        end
      end
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
              metadata: { user_name: fake_user_name, remote_ip: '127.0.0.1', agency_id: nil, role_id: nil,
                          http_method: 'GET', record_ids: [@case1.id] })
    end

    it 'obfuscates the case name when hidden' do
      @case1.hidden_name = true
      @case1.save!

      login_for_test(permitted_field_names: %w[name])
      get "/api/v2/cases/#{@case1.id}"

      expect(json['data']['name']).to eq('*******')
      expect(json['data']['hidden_name']).to be true
    end

    describe 'family' do
      context 'when a record is linked to family' do
        it 'returns the family members of the family not including itself' do
          login_for_test(
            permissions: [
              Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::VIEW_FAMILY_RECORD])
            ]
          )

          get "/api/v2/cases/#{@case6.id}"

          expect(json['data']['family_details_section'].size).to eq(1)
          expect(json['data']['family_details_section'][0]['unique_id']).to eq(@member_unique_id6)
          expect(json['data']['family_details_section'][0]['relation_name']).to eq('Member 2')
          expect(json['data']['family_details_section'][0]['relation_sex']).to eq('male')
          expect(json['data']['family_details_section'][0]['relation_age']).to eq(8)
        end
      end
    end

    describe 'referral authorizations' do
      context 'when a record was referred' do
        it 'returns the permitted_form for the current_user' do
          sign_in(@user_referral)

          get "/api/v2/cases/#{@case11.id}"

          expect(json['data']['permitted_forms']).to eq({ 'form_a' => 'rw' })
        end

        it 'returns the fields of the authorized role' do
          sign_in(@user_referral)

          get "/api/v2/cases/#{@case11.id}"

          expect(json['data']['field_a']).to eq('value for field_a')
        end
      end
    end
  end

  describe 'POST /api/v2/cases' do
    let(:params) { { data: { name: 'Test', age: 12, sex: 'female' } } }

    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test

      post '/api/v2/cases', params:, as: :json

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

      post '/api/v2/cases', params:, as: :json

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
          data: { id:, name: 'Test', age: 12, sex: 'female' }
        }
        post '/api/v2/cases', params:, as: :json

        expect(response).to have_http_status(204)
        expect(Child.find_by(id:)).not_to be_nil
      end
    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test(permissions: [])
      id = SecureRandom.uuid
      params = {
        data: { id:, name: 'Test', age: 12, sex: 'female' }
      }
      post '/api/v2/cases', params:, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
      expect(Child.find_by(id:)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test
      params = {
        data: { id: @case1.id, name: 'Test', age: 12, sex: 'female' }
      }
      post '/api/v2/cases', params:, as: :json

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
        data: { name: 'Test', age: 12, sex: 'female', date_of_birth: 'is invalid' }
      }
      post '/api/v2/cases', params:, as: :json

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases')
    end

    describe 'family' do
      it 'links a new case to a family' do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::CREATE, Permission::LINK_FAMILY_RECORD])
          ]
        )
        params = { data: { name: 'New With Family', age: 10, sex: 'male', family_id: @family3.id } }

        post '/api/v2/cases', params:, as: :json

        @family3.reload

        expect(response).to have_http_status(200)
        expect(json['data']['id']).not_to be_empty
        expect(json['data']['name']).to eq(params[:data][:name])
        expect(json['data']['age']).to eq(params[:data][:age])
        expect(json['data']['sex']).to eq(params[:data][:sex])
        expect(json['data']['family_id']).to eq(@family3.id)
        expect(json['data']['family_member_id']).to eq(@family3.family_members[0]['unique_id'])
        expect(@family3.family_members[0]['unique_id']).not_to be_empty
        expect(@family3.family_members[0]['relation_name']).to eq(params[:data][:name])
        expect(@family3.family_members[0]['relation_age']).to eq(params[:data][:age])
        expect(@family3.family_members[0]['relation_sex']).to eq(params[:data][:sex])
        expect(@family3.family_members[0]['case_id']).to eq(json['data']['id'])
        expect(@family3.family_members[0]['case_id_display']).to eq(json['data']['case_id_display'])
      end
    end
  end

  describe 'PATCH /api/v2/cases/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
      expect(json['data']['age']).to eq(10)
      expect(json['data']['sex']).to eq('female')
      expect(json['data']['last_updated_at']).to be

      case1 = Child.find_by(id: @case1.id)
      expect(case1.data['age']).to eq(10)
      expect(case1.data['sex']).to eq('female')
    end

    it 'does not update the id of the record and returns 200' do
      login_for_test
      params = { data: { id: '47e3e51c-7049-4aff-bd3e-ded1b1c5477f' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case1.id)
    end

    it 'ignores unauthorized attributes' do
      login_for_test
      params = { data: { name: 'TesterTester', unauthorized_field: '0001' } }

      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq('TesterTester')

      case1 = Child.find_by(id: @case1.id)
      expect(case1.data['unauthorized_field']).to be_nil
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      %w[data].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end

    it 'treats numerically formatted strings wih leading 0s as strings' do
      login_for_test
      params = { data: { national_id_no: '001' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(@case1.reload.data['national_id_no']).to eq('001')
    end

    it 'treats numerically formatted strings as strings' do
      login_for_test
      params = { data: { national_id_no: '155' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(@case1.reload.data['national_id_no']).to eq('155')
    end

    it 'appends to rather than replaces nested forms' do
      login_for_test
      params = {
        data: {
          family_details_section: [
            { unique_id: @unique_id_mother, relation_type: 'mother', relation_age: 35 },
            { unique_id: @unique_id_uncle, relation_type: 'uncle', relation_age: 50 }
          ]
        }
      }
      patch "/api/v2/cases/#{@case3.id}", params:, as: :json

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details_section']
      uncle = family_details.select { |f| f['unique_id'] == @unique_id_uncle && f['relation_type'] == 'uncle' }
      expect(family_details.size).to eq(3)
      expect(uncle.present?).to be true
    end

    it 'removes nested forms marked for deletion' do
      login_for_test
      params = {
        data: {
          family_details_section: [
            { unique_id: @unique_id_mother, _destroy: true },
            { unique_id: @unique_id_uncle, relation_type: 'uncle', relation_age: 50 }
          ]
        }
      }
      patch "/api/v2/cases/#{@case3.id}", params:, as: :json

      expect(response).to have_http_status(200)

      case3 = Child.find_by(id: @case3.id)
      family_details = case3.data['family_details_section']
      mother = family_details.select { |f| f['unique_id'] == @unique_id_mother && f['relation_type'] == 'mother' }
      expect(family_details.size).to eq(2)
      expect(mother.present?).to be false
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test(permissions: [])
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'returns a 404 when trying to update a record with a non-existant id' do
      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'female' } }
      patch '/api/v2/cases/thisdoesntexist', params:, as: :json

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/thisdoesntexist')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test
      params = {
        data: { name: 'Test', age: 12, sex: 'female', date_of_birth: 'is invalid' }
      }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
    end

    it 'sets the case name to be hidden' do
      login_for_test
      params = { data: { hidden_name: true } }
      patch "/api/v2/cases/#{@case1.id}", params:, as: :json

      expect(response).to have_http_status(200)

      case1 = Child.find_by(id: @case1.id)
      expect(case1.hidden_name).to be true
    end

    describe 'when a user adds a service subform' do
      it 'updates the subforms if cannot update the record' do
        login_for_test(
          permitted_fields: [],
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

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['services_section'].first['service_type']).to eq('Test type')
        expect(json['data']['name']).to be_nil
        @case1.reload
        expect(@case1.name).to eq('Test1')
      end

      it 'updates the subforms if cannot read/write cases' do
        login_for_test(
          permitted_fields: [],
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

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

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
        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

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

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Record::STATUS_CLOSED)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { status: 'closed' }, record_action: Permission::CLOSE }

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

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

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq(Record::STATUS_OPEN)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { status: 'open', case_reopened: true }, record_action: Permission::REOPEN }

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

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

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['record_state']).to eq(false)
      end

      it 'returns 403 if the user is not authorized' do
        login_for_test(group_permission: Permission::SELF)

        params = { data: { record_state: false }, record_action: Permission::ENABLE_DISABLE_RECORD }

        patch "/api/v2/cases/#{@case1.id}", params:, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}")
      end
    end

    describe 'when a user adds a family details subform' do
      context 'when the case is linked to family record' do
        it 'updates the family record global fields' do
          login_for_test

          member2_unique_id = SecureRandom.uuid

          params = {
            data: {
              family_number: '002',
              family_size: 5,
              family_notes: 'Family002Notes',
              family_details_section: [
                {
                  unique_id: member2_unique_id,
                  relation_age: 2,
                  relation: 'relation3',
                  relation_name: 'Member 3',
                  relation_is_caregiver: true
                }
              ]
            }
          }

          patch "/api/v2/cases/#{@case6.id}", params:, as: :json

          family = Family.find_by(id: @case6.family_id)
          @case6.reload

          expect(response).to have_http_status(200)
          expect(json['data']['family_number']).to eq('002')
          expect(json['data']['family_size']).to eq(5)
          expect(json['data']['family_notes']).to eq('Family002Notes')
          expect(json['data']['family_details_section']).to eq(
            [
              {
                'unique_id' => @member_unique_id6,
                'relation_sex' => 'male',
                'relation_name' => 'Member 2',
                'relation_age' => 8
              },
              {
                'unique_id' => member2_unique_id,
                'relation' => 'relation3',
                'relation_name' => 'Member 3',
                'relation_age' => 2,
                'relation_is_caregiver' => true
              }
            ]
          )
          expect(@case6.family_number).to eq('002')
          expect(@case6.family_details_section).to eq(
            [
              {
                'unique_id' => member2_unique_id,
                'relation' => 'relation3',
                'relation_is_caregiver' => true
              }
            ]
          )
          expect(family.family_number).to eq('002')
          expect(family.family_size).to eq(5)
          expect(family.family_notes).to eq('Family002Notes')
          expect(family.family_members).to eq(
            [
              {
                'unique_id' => @member_unique_id1,
                'relation_name' => 'Member 1',
                'relation_sex' => 'male',
                'relation_age' => 5,
                'case_id' => @case6.id,
                'case_id_display' => @case6.case_id_display
              },
              {
                'unique_id' => @member_unique_id6,
                'relation_sex' => 'male',
                'relation_name' => 'Member 2',
                'relation_age' => 8
              },
              {
                'unique_id' => member2_unique_id,
                'relation_name' => 'Member 3',
                'relation_age' => 2,
                'family_relationship' => 'relation3',
                'family_relation_is_caregiver' => true
              }
            ]
          )
        end
      end

      context 'when the case is not linked to a family record' do
        it 'updates the child record' do
          login_for_test

          member2_unique_id = SecureRandom.uuid

          params = {
            data: {
              family_number: '002',
              family_details_section: [
                { unique_id: @member_unique_id1, relation_name: 'Member 001' },
                { unique_id: member2_unique_id, relation_age: 5, relation: 'relation2', relation_name: 'Member 2' }
              ]
            }
          }

          patch "/api/v2/cases/#{@case5.id}", params:, as: :json

          @case5.reload

          expect(response).to have_http_status(200)
          expect(json['data']['family_number']).to eq('002')
          expect(json['data']['family_details_section']).to eq(
            [
              { 'unique_id' => @member_unique_id1, 'relation_name' => 'Member 001' },
              {
                'unique_id' => member2_unique_id,
                'relation_name' => 'Member 2', 'relation_age' => 5, 'relation' => 'relation2'
              }
            ]
          )
          expect(@case5.family_details_section).to eq(
            [
              { 'unique_id' => @member_unique_id1, 'relation_name' => 'Member 001' },
              {
                'unique_id' => member2_unique_id,
                'relation_name' => 'Member 2', 'relation_age' => 5, 'relation' => 'relation2'
              }
            ]
          )
        end
      end
    end

    it 'links an existing record to a family and returns global fields' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::WRITE, Permission::LINK_FAMILY_RECORD])
        ]
      )
      params = { data: { family_id: @family4.id } }

      patch "/api/v2/cases/#{@case9.id}", params:, as: :json

      @family4.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['family_id']).to eq(@family4.id)
      expect(json['data']['family_number']).to eq(@family4.family_number)
      expect(json['data']['family_size']).to eq(@family4.family_size)
      expect(json['data']['family_notes']).to eq(@family4.family_notes)
      expect(json['data']['family_member_id']).to eq(@family4.family_members[0]['unique_id'])
      expect(@family4.family_members[0]['unique_id']).not_to be_empty
      expect(@family4.family_members[0]['relation_name']).to eq(@case9.name)
      expect(@family4.family_members[0]['relation_age']).to eq(@case9.age)
      expect(@family4.family_members[0]['relation_sex']).to eq(@case9.sex)
      expect(@family4.family_members[0]['case_id']).to eq(@case9.id)
      expect(@family4.family_members[0]['case_id_display']).to eq(@case9.case_id_display)
    end

    it 'links an existing record to a family and returns the family members' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::WRITE, Permission::LINK_FAMILY_RECORD])
        ]
      )
      params = { data: { family_id: @family5.id } }

      patch "/api/v2/cases/#{@case10.id}", params:, as: :json

      @family5.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['family_id']).to eq(@family5.id)
      expect(json['data']['family_member_id']).to eq(@family5.family_members[1]['unique_id'])
      expect(json['data']['family_details_section'][0]['unique_id']).to eq(@member_unique_id7)
      expect(json['data']['family_details_section'][0]['relation_name']).to eq('Member1')
      expect(json['data']['family_details_section'][0]['relation_sex']).to eq('female')
      expect(json['data']['family_details_section'][0]['relation_age']).to eq(9)
      expect(@family5.family_members.size).to eq(2)
      expect(@family5.family_members[0]['unique_id']).to eq(@member_unique_id7)
      expect(@family5.family_members[0]['relation_name']).to eq('Member1')
      expect(@family5.family_members[0]['relation_sex']).to eq('female')
      expect(@family5.family_members[0]['relation_age']).to eq(9)
      expect(@family5.family_members[1]['unique_id']).not_to be_empty
      expect(@family5.family_members[1]['relation_name']).to eq(@case10.name)
      expect(@family5.family_members[1]['relation_age']).to eq(@case10.age)
      expect(@family5.family_members[1]['relation_sex']).to eq(@case10.sex)
      expect(@family5.family_members[1]['case_id']).to eq(@case10.id)
      expect(@family5.family_members[1]['case_id_display']).to eq(@case10.case_id_display)
    end

    it 'unlinks a family record from a record' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::WRITE, Permission::LINK_FAMILY_RECORD])
        ]
      )
      params = { data: { family_id: nil } }

      patch "/api/v2/cases/#{@case8.id}", params:, as: :json

      @family2.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['family_id']).to be_nil
      expect(json['data']['family_member_id']).to be_nil
      expect(json['data']['family_details_section']).to be_empty
      expect(@family2.cases).to be_empty
      expect(@family2.family_members.find { |member| member['case_id'] == @case8.id }).to be_nil
    end

    describe 'referral authorizations' do
      context 'when a record was referred' do
        it 'updates permitted fields based on the authorized roles' do
          sign_in(@user_referral)

          params = { data: { field_a: 'new value for field_a' } }

          patch "/api/v2/cases/#{@case11.id}", params:, as: :json

          expect(response).to have_http_status(200)
          expect(json['data']['id']).to eq(@case11.id)
          expect(json['data']['field_a']).to eq('new value for field_a')
          expect(json['data']['permitted_forms']).to eq({ 'form_a' => 'rw' })
        end
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

  describe 'POST /api/v2/cases/:id/family' do
    it 'creates a new child linked to a family when there is no family record' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::CASE_FROM_FAMILY])])

      params = { data: { family_detail_id: @member_unique_id3 } }

      post "/api/v2/cases/#{@case7.id}/family", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case7.id)
      expect(json['data']['record']['id']).not_to be_nil
      expect(json['data']).to have_key('family_id')
      expect(json['data']).to have_key('family_number')
      expect(json['data']).to have_key('family_member_id')
      expect(json['data']['family_details_section'][0]['unique_id']).to eq(@member_unique_id3)
      expect(json['data']['family_details_section'][0]['relation_sex']).to eq('male')
      expect(json['data']['family_details_section'][0]['relation_age']).to eq(5)
      expect(json['data']['family_details_section'][0]['case_id']).not_to be_nil
      expect(json['data']['family_details_section'][0]['case_id_display']).not_to be_nil
      expect(json['data']['family_details_section'][0]['can_read_record']).not_to be_truthy
      expect(json['data']['record']['id']).not_to be_nil
      expect(json['data']['record']['case_id_display']).not_to be_nil
      expect(json['data']['record']['family_member_id']).to eq(@member_unique_id3)
    end

    it 'creates a new child linked to a family when there is a family record' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::CASE_FROM_FAMILY])])

      params = { data: { family_detail_id: @member_unique_id5 } }

      post "/api/v2/cases/#{@case8.id}/family", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case8.id)
      expect(json['data']['family_id']).to eq(@family2.id)
      expect(json['data']['family_number']).to eq(@family2.family_number)
      expect(json['data']['family_member_id']).to eq(@member_unique_id2)
      expect(json['data']['family_details_section'].size).to eq(2)
      expect(json['data']['family_details_section'][1]['unique_id']).to eq(@member_unique_id5)
      expect(json['data']['family_details_section'][1]['relation_name']).to eq('Test8 - Member3')
      expect(json['data']['family_details_section'][1]['relation_sex']).to eq('male')
      expect(json['data']['family_details_section'][1]['relation_age']).to eq(4)
      expect(json['data']['family_details_section'][1]['case_id']).not_to be_nil
      expect(json['data']['family_details_section'][1]['case_id_display']).not_to be_nil
      expect(json['data']['record']['id']).not_to be_nil
      expect(json['data']['record']['case_id_display']).not_to be_nil
      expect(json['data']['record']['family_member_id']).to eq(@member_unique_id5)
    end

    it 'creates a new child and returns the family data if a user has the view_family_record permission' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::CASE_FROM_FAMILY, Permission::VIEW_FAMILY_RECORD]
          )
        ]
      )

      params = { data: { family_detail_id: @member_unique_id4 } }

      post "/api/v2/cases/#{@case8.id}/family", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@case8.id)
      expect(json['data']['family_id']).to eq(@family2.id)
      expect(json['data']['family_number']).to eq(@family2.family_number)
      expect(json['data']['family_member_id']).to eq(@member_unique_id2)
      expect(json['data']['record']['id']).not_to be_nil
      expect(json['data']['record']['case_id_display']).not_to be_nil
      expect(json['data']['record']['family_member_id']).to eq(@member_unique_id4)
    end
  end

  after :each do
    clean_data(
      Trace, Alert, Flag, Attachment, Incident, Child, User, Agency, Role, Lookup, PrimeroModule, RegistryRecord,
      Field, FormSection, Location
    )
    clear_performed_jobs
    clear_enqueued_jobs
  end
end
