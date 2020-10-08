require 'rails_helper'

describe Api::V2::FlagsController, type: :request do
  include ActiveJob::TestHelper

  before do
    clean_data(Flag, User, Child, TracingRequest, Incident, PrimeroModule, UserGroup, Agency)

    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    permission_case = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
    permission_read_flags = Permission.new(resource: Permission::DASHBOARD, actions: [Permission::DASH_FLAGS])
    @role = Role.new(permissions: [permission_case, permission_read_flags], modules: [@primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @agency1 = Agency.create!(name: 'Agency One', agency_code: 'agency1')
    @user1 = User.new(user_name: 'user1', full_name: 'Test User One', location: 'loc012345', role: @role,
                      user_groups: [@group1], agency_id: @agency1.id)
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @agency2 = Agency.create!(name: 'Agency Two', agency_code: 'agency2')
    @user2 = User.new(user_name: 'user2', full_name: 'Test User Two', location: 'loc8675309', role: @role,
                      user_groups: [@group1], agency_id: @agency2.id)
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', full_name: 'Test User Three', location: 'loc8675309', role: @role,
                      user_groups: [@group2], agency_id: @agency2.id)
    @user3.save(validate: false)
    @manager1 = User.new(user_name: 'manager1', full_name: 'Test Manager One', location: 'loc8675309', role: @role,
                      user_groups: [@group1], agency_id: @agency2.id)
    @manager1.save(validate: false)

    @case1 = Child.create!(data: { name: "Test1", age: 5, sex: 'male', owned_by: 'user1' })
    @case2 = Child.create!(data: { name: "Test2", age: 7, sex: 'female', owned_by: 'user1' })
    @case3 = Child.create!(data: { name: "Test3", age: 9, sex: 'female', owned_by: 'user2' })
    @case4 = Child.create!(data: { name: "Test4", age: 9, sex: 'female', owned_by: 'user2' })

    @tracing_request1 = TracingRequest.create!(data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1', owned_by: 'user1' })
    @tracing_request2 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 2', owned_by: 'user2' })

    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1', owned_by: 'user1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2', owned_by: 'user2' })

    @case1.add_flag('This is a flag', Date.today, 'faketest')
    @case3.add_flag('This is a flag', Date.today, 'faketest')
    @tracing_request1.add_flag('This is a flag TR', Date.today, 'faketest')
    @incident1.add_flag('This is a flag IN', Date.today, 'faketest')
    @incident2.add_flag('This is a flag IN', Date.today, 'faketest')
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.select { |job| job.values.first == AuditLogJob }.first[:args].first }

  describe 'GET /api/v2/flags' do
    context 'when the user does not have permission to index flags' do
      before do
        login_for_test(user_name: 'user2', permissions: permission_flag_record, group_permission: Permission::SELF,
                       modules: [@primero_module])
      end

      it 'returns unauthorized' do
        get "/api/v2/flags"

        expect(response).to have_http_status(403)
      end
    end

    context 'when the user does have permission to index flags' do
      context 'and user is a case worker' do
        before do
          login_for_test(user_name: 'user1', permissions: @role.permissions, group_permission: Permission::SELF,
                         modules: [@primero_module])
        end

        it 'lists flags owned by or asssociated with the current user' do
          get "/api/v2/flags"

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(3)
          expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['message']).to eq( 'This is a flag')
          expect(json['data'][0]['removed']).to be_falsey
        end

        context 'and record_type cases is passed in' do
          it 'lists case flags owned by or asssociated with the current user' do
            get "/api/v2/flags?record_type=cases"

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('cases')
            expect(json['data'][0]['message']).to eq( 'This is a flag')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end

        context 'and record_type incidents is passed in' do
          it 'lists incident flags owned by or asssociated with the current user' do
            get "/api/v2/flags?record_type=incidents"

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq( @incident1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('incidents')
            expect(json['data'][0]['message']).to eq( 'This is a flag IN')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end

        context 'and record_type tracing_requests is passed in' do
          it 'lists tracing_request flags owned by or asssociated with the current user' do
            get "/api/v2/flags?record_type=tracing_requests"

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq( @tracing_request1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('tracing_requests')
            expect(json['data'][0]['message']).to eq( 'This is a flag TR')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end
      end

      context 'and user is a manager' do
        before do
          login_for_test(user_name: 'manager1', permissions: @role.permissions, group_permission: Permission::GROUP,
                         modules: [@primero_module], user_group_ids: [@group1.id])
        end

        it 'lists flags owned by or associated with users in current users groups' do
          get "/api/v2/flags"

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(5)
          expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['message']).to eq( 'This is a flag')
          expect(json['data'][0]['removed']).to be_falsey
        end
      end
    end
  end

  describe 'GET /api/v2/:recordType/:recordId/flags' do
    before :each do
      login_for_test(permissions: permission_flag_record)
    end
    it 'list flags of a case' do
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('cases')
      expect(json['data'][0]['message']).to eq( 'This is a flag')
      expect(json['data'][0]['removed']).to be_falsey
    end

    it 'list flags of a tracing request' do
      get "/api/v2/tracing_requests/#{@tracing_request1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @tracing_request1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('tracing_requests')
      expect(json['data'][0]['message']).to eq( 'This is a flag TR')
      expect(json['data'][0]['removed']).to be_falsey
    end

    it 'list flags of an incident' do
      get "/api/v2/incidents/#{@incident1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @incident1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('incidents')
      expect(json['data'][0]['message']).to eq( 'This is a flag IN')
      expect(json['data'][0]['removed']).to be_falsey
    end
    it 'list include removed flag' do
      @case1.add_flag('This is a second flag', Date.today, 'faketest')
      @case1.remove_flag(@case1.flags.first.id, 'faketest', 'Resolved Flag')
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['removed']).to be_truthy
      expect(json['data'][1]['removed']).to be_falsey
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/:recordType/:recordId/flags' do
    it 'creates a new flag to a case' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq( @case1.id.to_s)
      expect(json['data']['record_type']).to eq('cases')
      expect(json['data']['message']).to eq( 'This is another flag')
      expect(json['data']['removed']).to be_falsey
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])

      expect(audit_params['action']).to eq('flag')
    end

    it 'creates a new flag to a tracing_request' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/tracing_requests/#{@tracing_request1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq( @tracing_request1.id.to_s)
      expect(json['data']['record_type']).to eq('tracing_requests')
      expect(json['data']['message']).to eq( 'This is another flag TR')
      expect(json['data']['removed']).to be_falsey
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])
    end

    it 'creates a new flag to an incident' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag IN' } }
      post "/api/v2/incidents/#{@incident1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq( @incident1.id.to_s)
      expect(json['data']['record_type']).to eq('incidents')
      expect(json['data']['message']).to eq( 'This is another flag IN')
      expect(json['data']['removed']).to be_falsey
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'enqueues an audit log job that records the flag attempt' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(AuditLogJob).to have_been_enqueued
        .with(record_type: 'Child',
          record_id: @case1.id,
          action: 'flag',
          user_id: fake_user_id, #This is technically wrong, but an artifact of the way we do tests
          resource_url: request.url,
          metadata: {user_name: fake_user_name})
    end
  end

  describe 'PATCH /api/v2/:recordType/:recordId/flags/:id' do
    it 'unflags a case' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['removed']).to be_truthy
      expect(json['data']['unflag_message']).to eq('This is unflag message')
      expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
      expect(json['data']['unflagged_by']).to eq('faketest')
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])

      expect(audit_params['action']).to eq('unflag')
    end

    it 'unflags a tracing_request' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message TR' } }
      patch "/api/v2/tracing_requests/#{@tracing_request1.id}/flags/#{@tracing_request1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['removed']).to be_truthy
      expect(json['data']['unflag_message']).to eq('This is unflag message TR')
      expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
      expect(json['data']['unflagged_by']).to eq('faketest')
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])
    end

    it 'unflags an incident' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message IN' } }
      patch "/api/v2/incidents/#{@incident1.id}/flags/#{@incident1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['removed']).to be_truthy
      expect(json['data']['unflag_message']).to eq('This is unflag message IN')
      expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
      expect(json['data']['unflagged_by']).to eq('faketest')
      expect(json['data']['record_id']).to eq( json['data']['record']['id'])
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/:recordType/flags' do
    it 'flagging cases in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@case1.flag_count).to eq(1)
      expect(@case2.flag_count).to eq(0)

      params = { data: { ids: [@case1.id, @case2.id], record_type: 'case', date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/flags", params: params

      expect(response).to have_http_status(204)
      @case1.reload
      @case2.reload
      expect(@case1.flag_count).to eq(2)
      expect(@case2.flag_count).to eq(1)

      expect(audit_params['action']).to eq('bulk_flag')
    end

    it 'flagging tracing_request in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@tracing_request1.flag_count).to eq(1)
      expect(@tracing_request2.flag_count).to eq(0)

      params = { data: { ids: [@tracing_request1.id, @tracing_request2.id], record_type: 'tracing_request', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/tracing_requests/flags", params: params

      expect(response).to have_http_status(204)
      @tracing_request1.reload
      @tracing_request2.reload
      expect(@tracing_request1.flag_count).to eq(2)
      expect(@tracing_request2.flag_count).to eq(1)
    end

    it 'flagging incindet in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@incident1.flag_count).to eq(1)
      expect(@incident2.flag_count).to eq(0)

      params = { data: { ids: [@incident1.id, @incident2.id], record_type: 'incident', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/incidents/flags", params: params

      expect(response).to have_http_status(204)
      @incident1.reload
      @incident2.reload
      expect(@incident1.flag_count).to eq(2)
      expect(@incident2.flag_count).to eq(1)
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { ids: [@case1.id, @case2.id], record_type: 'case', date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/flags", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it "get a 404 error if one of the ids on the requests isn't exists" do
      login_for_test(permissions: permission_flag_record)

      params = { data: { ids: [@incident1.id, '12345'], record_type: 'incident', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/incidents/flags", params: params

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['message']).to eq('Not Found')
    end
  end

  describe 'verification the ids' do
    it 'verifying the id of the cases' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(request.path.split('/')[4]).to eq( @case1.id.to_s)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
    end

    it 'verifying the id of the flags' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      @case1.reload
      expect(json['data']['id']).to eq(@case1.flags.first.id)
    end
  end

  after :each do
    clear_performed_jobs
    clear_enqueued_jobs
  end

  after do
    clear_enqueued_jobs
    clean_data(Flag, User, Child, TracingRequest, Incident, PrimeroModule, UserGroup, Agency)
  end

end
