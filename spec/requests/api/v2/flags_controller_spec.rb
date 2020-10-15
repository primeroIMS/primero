# frozen_string_literal: true

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

    @case1 = Child.create!(data: { name: 'Test1', hidden_name: true, age: 5, sex: 'male', owned_by: 'user1' })
    @case2 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user1' })
    @case3 = Child.create!(data: { name: 'Test3', age: 9, sex: 'female', owned_by: 'user2' })
    @case4 = Child.create!(data: { name: 'Test4', age: 9, sex: 'female', owned_by: 'user2' })

    @tracing_request1 = TracingRequest.create!(data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1',
                                                       owned_by: 'user1' })
    @tracing_request2 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 2',
                                                       owned_by: 'user2' })

    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1',
                                          owned_by: 'user1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2',
                                          owned_by: 'user2' })

    @case1.add_flag('This is a flag', Date.today, 'faketest')
    @case3.add_flag('This is a flag', Date.today, 'faketest')
    @tracing_request1.add_flag('This is a flag TR', Date.today, 'faketest')
    @incident1.add_flag('This is a flag IN', Date.today, 'faketest')
    @incident2.add_flag('This is a flag IN', Date.today, 'faketest')
    @incident2.add_flag('This is a second flag IN', Date.today, 'faketest')
    @incident2.add_flag('This is a third flag IN', Date.today, 'faketest')
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
        get '/api/v2/flags'

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
          get '/api/v2/flags'

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(3)
          expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['message']).to eq('This is a flag')
          expect(json['data'][0]['r_short_id']).to eq(@case1.short_id)
          expect(json['data'][0]['r_name']).to eq('*******')
          expect(json['data'][0]['r_hidden_name']).to be
          expect(json['data'][0]['r_owned_by']).to eq('user1')
          expect(json['data'][0]['removed']).to be_falsey
        end

        context 'and record_type cases is passed in' do
          it 'lists case flags owned by or asssociated with the current user' do
            get '/api/v2/flags?record_type=cases'

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('cases')
            expect(json['data'][0]['message']).to eq('This is a flag')
            expect(json['data'][0]['r_name']).to eq('*******')
            expect(json['data'][0]['r_hidden_name']).to be
            expect(json['data'][0]['r_owned_by']).to eq('user1')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end

        context 'and record_type incidents is passed in' do
          it 'lists incident flags owned by or asssociated with the current user' do
            get '/api/v2/flags?record_type=incidents'

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq(@incident1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('incidents')
            expect(json['data'][0]['message']).to eq('This is a flag IN')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end

        context 'and record_type tracing_requests is passed in' do
          it 'lists tracing_request flags owned by or asssociated with the current user' do
            get '/api/v2/flags?record_type=tracing_requests'

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(1)
            expect(json['data'][0]['record_id']).to eq(@tracing_request1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('tracing_requests')
            expect(json['data'][0]['message']).to eq('This is a flag TR')
            expect(json['data'][0]['removed']).to be_falsey
          end
        end

        context 'and record_id is passed in' do
          context 'and the record is a case' do
            context 'and the record has flags' do
              it 'lists all flags for this case' do
                get "/api/v2/flags?record_type=cases&record_id=#{@case3.id}"

                expect(response).to have_http_status(200)
                expect(json['data'].size).to eq(1)
                expect(json['data'][0]['record_id']).to eq(@case3.id.to_s)
                expect(json['data'][0]['record_type']).to eq('cases')
                expect(json['data'][0]['message']).to eq('This is a flag')
                expect(json['data'][0]['r_name']).to eq('Test3')
                expect(json['data'][0]['r_hidden_name']).not_to be
                expect(json['data'][0]['r_owned_by']).to eq('user2')
                expect(json['data'][0]['removed']).to be_falsey
              end
            end

            context 'and the record has no flags' do
              it 'returns an empty list' do
                get "/api/v2/flags?record_type=cases&record_id=#{@case4.id}"

                expect(response).to have_http_status(200)
                expect(json['data']).to be_empty
              end
            end
          end

          context 'and the record is an incident' do
            it 'lists all flags for this incident' do
              get "/api/v2/flags?record_type=incidents&record_id=#{@incident2.id}"

              expect(response).to have_http_status(200)
              expect(json['data'].size).to eq(3)
              expect(json['data'][0]['record_id']).to eq(@incident2.id.to_s)
              expect(json['data'][0]['record_type']).to eq('incidents')
              expect(json['data'][0]['message']).to eq('This is a flag IN')
              expect(json['data'][0]['r_name']).not_to be
              expect(json['data'][0]['r_hidden_name']).not_to be
              expect(json['data'][0]['r_owned_by']).to eq('user2')
              expect(json['data'][0]['removed']).to be_falsey
            end
          end

          context 'and the record is a tracing_request' do
            it 'lists all flags for this incident' do
              get "/api/v2/flags?record_type=tracing_requests&record_id=#{@tracing_request1.id}"

              expect(response).to have_http_status(200)
              expect(json['data'].size).to eq(1)
              expect(json['data'][0]['record_id']).to eq(@tracing_request1.id.to_s)
              expect(json['data'][0]['record_type']).to eq('tracing_requests')
              expect(json['data'][0]['message']).to eq('This is a flag TR')
              expect(json['data'][0]['r_name']).not_to be
              expect(json['data'][0]['r_hidden_name']).not_to be
              expect(json['data'][0]['r_owned_by']).to eq('user1')
              expect(json['data'][0]['removed']).to be_falsey
            end
          end
        end
      end

      context 'and user is a manager' do
        before do
          login_for_test(user_name: 'manager1', permissions: @role.permissions, group_permission: Permission::GROUP,
                         modules: [@primero_module], user_group_ids: [@group1.id])
        end

        it 'lists flags owned by or associated with users in current users groups' do
          get '/api/v2/flags'

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(7)
          expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['message']).to eq('This is a flag')
          expect(json['data'][0]['r_name']).to eq('*******')
          expect(json['data'][0]['r_hidden_name']).to be
          expect(json['data'][0]['r_owned_by']).to eq('user1')
          expect(json['data'][0]['removed']).to be_falsey
        end
      end
    end
  end

  # TODO: remove these
  describe 'GET /api/v2/:recordType/:recordId/flags' do
    before :each do
      login_for_test(permissions: permission_flag_record)
    end

    xit 'list include removed flag' do
      @case1.add_flag('This is a second flag', Date.today, 'faketest')
      @case1.remove_flag(@case1.flags.first.id, 'faketest', 'Resolved Flag')
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['removed']).to be_truthy
      expect(json['data'][1]['removed']).to be_falsey
    end
  end

  describe 'POST /api/v2/flags' do
    context 'when user has permission to flag' do
      before do
        login_for_test(permissions: permission_flag_record)
      end

      context 'and record is a case' do
        before do
          @params = {
            data: { record_type: 'case', record_id: @case1.id, date: Date.today.to_s,
                    message: 'This is a create case flag test' }
          }
        end

        it 'creates a new flag' do
          post '/api/v2/flags', params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['record_id']).to eq(@case1.id.to_s)
          expect(json['data']['record_type']).to eq('cases')
          expect(json['data']['message']).to eq('This is a create case flag test')
          expect(json['data']['removed']).to be_falsey
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('flag')
        end

        # TODO: fix
        xit 'enqueues an audit log job that records the flag attempt' do
          @params[:message] = 'This is a create flag audit log test'
          post '/api/v2/flags', params: @params

          expect(AuditLogJob).to have_been_enqueued
                                   .with(record_type: 'Child',
                                         record_id: @case1.id,
                                         action: 'flag',
                                         user_id: fake_user_id, # This is technically wrong, but an artifact of the way we do tests
                                         resource_url: request.url,
                                         metadata: { user_name: fake_user_name })
        end
      end

      context 'and record is a tracing request' do
        before do
          @params = {
            data: { record_type: 'tracing_request', record_id: @tracing_request1.id, date: Date.today.to_s,
                    message: 'This is a create tracing request flag test' }
          }
        end

        it 'creates a new flag' do
          post '/api/v2/flags', params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['record_id']).to eq(@tracing_request1.id.to_s)
          expect(json['data']['record_type']).to eq('tracing_requests')
          expect(json['data']['message']).to eq('This is a create tracing request flag test')
          expect(json['data']['removed']).to be_falsey
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('flag')
        end
      end

      context 'and record is a tracing request' do
        before do
          @params = {
            data: { record_type: 'incident', record_id: @incident1.id, date: Date.today.to_s,
                    message: 'This is a create incident flag test' }
          }
        end

        it 'creates a new flag' do
          post '/api/v2/flags', params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['record_id']).to eq(@incident1.id.to_s)
          expect(json['data']['record_type']).to eq('incidents')
          expect(json['data']['message']).to eq('This is a create incident flag test')
          expect(json['data']['removed']).to be_falsey
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('flag')
        end
      end
    end

    context 'when user does not have permission to flag' do
      before do
        login_for_test
        @params = {
          data: { record_type: 'case', record_id: @case1.id, date: Date.today.to_s,
                  message: 'This is a create case flag test' }
        }
      end

      it 'returns a forbidden message' do
        post '/api/v2/flags', params: @params

        expect(response).to have_http_status(403)
        expect(json['errors'][0]['status']).to eq(403)
        expect(json['errors'][0]['resource']).to eq('/api/v2/flags')
        expect(json['errors'][0]['message']).to eq('Forbidden')
      end
    end
  end

  describe 'PATCH /api/v2/flags/:id' do
    context 'when user has permission to flag' do
      before do
        login_for_test(permissions: permission_flag_record)
      end

      context 'and record is a case' do
        before do
          @params = {
            data: { record_type: 'case', record_id: @case1.id, unflag_message: 'This is an unflag case test' }
          }
        end

        it 'unflags a case' do
          patch "/api/v2/flags/#{@case1.flags.first.id}", params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['removed']).to be_truthy
          expect(json['data']['unflag_message']).to eq('This is an unflag case test')
          expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
          expect(json['data']['unflagged_by']).to eq('faketest')
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('unflag')
        end
      end

      context 'and record is a tracing request' do
        before do
          @params = {
            data: { record_type: 'tracing_request', record_id: @tracing_request1.id,
                    unflag_message: 'This is an unflag tracing request test' }
          }
        end

        it 'unflags a tracing_request' do
          patch "/api/v2/flags/#{@tracing_request1.flags.first.id}", params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['removed']).to be_truthy
          expect(json['data']['unflag_message']).to eq('This is an unflag tracing request test')
          expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
          expect(json['data']['unflagged_by']).to eq('faketest')
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('unflag')
        end
      end

      context 'and record is an incident' do
        before do
          @params = {
            data: { record_type: 'incident', record_id: @incident1.id,
                    unflag_message: 'This is an unflag incident test' }
          }
        end

        it 'unflags an incident' do
          patch "/api/v2/flags/#{@incident1.flags.first.id}", params: @params

          expect(response).to have_http_status(200)
          expect(json['data']['removed']).to be_truthy
          expect(json['data']['unflag_message']).to eq('This is an unflag incident test')
          expect(json['data']['unflagged_date']).to eq(Date.today.to_s)
          expect(json['data']['unflagged_by']).to eq('faketest')
          expect(json['data']['record_id']).to eq(json['data']['record']['id'])

          expect(audit_params['action']).to eq('unflag')
        end
      end
    end

    context 'when user does not have permission to flag' do
      before do
        login_for_test
        @params = {
          data: { record_type: 'case', record_id: @case3.id, unflag_message: 'This is an unauthorized unflag test' }
        }
      end

      it 'returns a forbidden message' do
        patch "/api/v2/flags/#{@case3.flags.first.id}", params: @params

        expect(response).to have_http_status(403)
        expect(json['errors'][0]['status']).to eq(403)
        expect(json['errors'][0]['resource']).to eq("/api/v2/flags/#{@case3.flags.first.id}")
        expect(json['errors'][0]['message']).to eq('Forbidden')
      end
    end
  end

  # TODO:  what is this?
  describe 'verification the ids' do
    xit 'verifying the id of the cases' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(request.path.split('/')[4]).to eq(@case1.id.to_s)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
    end

    xit 'verifying the id of the flags' do
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
