# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::FlagsOwnersController, type: :request do
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
    @manager2 = User.new(user_name: 'manager2', full_name: 'Test Manager Two', location: 'loc8675309', role: @role,
                         user_groups: [@group1], agency_id: @agency2.id)
    @manager2.save(validate: false)

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
    @flag_to_remove = @case1.add_flag('This is test flag 3', Date.today, 'faketest')
    @case1.remove_flag(@flag_to_remove.id, 'faketest', 'Resolved Flag')
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
          expect(json['data'].size).to eq(4)
          expect(json['data'].map { |d| d['removed'] }.uniq).to match_array([true, false])
          expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['date']).to eq(Date.today.strftime('%Y-%m-%d'))
          expect(json['data'][0]['flagged_by']).to eq('faketest')
          expect(json['data'][0]['short_id']).to eq(@case1.short_id)
          expect(json['data'][0]['name']).to eq('*******')
          expect(json['data'][0]['hidden_name']).to be
          expect(json['data'][0]['owned_by']).to eq('user1')
          expect(json['data'][0]['owned_by_agency_id']).to eq(@agency1.unique_id)
        end

        context 'and active_only is passed in' do
          it 'lists flags owned by or asssociated with the current user' do
            get '/api/v2/flags?active_only=true'

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(3)
            expect(json['data'].map { |d| d['removed'] }.uniq).to match_array([false])
            expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('cases')
            expect(json['data'][0]['date']).to eq(Date.today.strftime('%Y-%m-%d'))
            expect(json['data'][0]['message']).to eq('This is a flag')
            expect(json['data'][0]['flagged_by']).to eq('faketest')
            expect(json['data'][0]['removed']).to be_falsey
            expect(json['data'][0]['unflag_message']).to be_nil
            expect(json['data'][0]['system_generated_followup']).to be_falsey
            expect(json['data'][0]['unflagged_by']).to be_nil
            expect(json['data'][0]['unflagged_date']).to be_nil
            expect(json['data'][0]['short_id']).to eq(@case1.short_id)
            expect(json['data'][0]['name']).to eq('*******')
            expect(json['data'][0]['hidden_name']).to be
            expect(json['data'][0]['owned_by']).to eq('user1')
            expect(json['data'][0]['owned_by_agency_id']).to eq(@agency1.unique_id)
          end
        end

        context 'and record_type cases is passed in' do
          it 'lists case flags owned by or asssociated with the current user' do
            get '/api/v2/flags?record_type=cases'

            expect(response).to have_http_status(200)
            expect(json['data'].size).to eq(2)
            expect(json['data'][0]['record_id']).to eq(@case1.id.to_s)
            expect(json['data'][0]['record_type']).to eq('cases')
            expect(json['data'][0]['message']).to eq('This is a flag')
            expect(json['data'][0]['name']).to eq('*******')
            expect(json['data'][0]['hidden_name']).to be
            expect(json['data'][0]['owned_by']).to eq('user1')
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
      end

      context 'and user is a manager' do
        before do
          login_for_test(user_name: 'manager1', permissions: @role.permissions, group_permission: Permission::GROUP,
                         modules: [@primero_module], user_group_ids: [@group1.id])
        end

        it 'lists flags owned by or associated with users in current users groups' do
          get '/api/v2/flags'

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(8)
          flag_data = json['data'].find { |flag| flag['record_id'] == @case1.id && flag['message'] == 'This is a flag' }

          expect(flag_data['record_id']).to eq(@case1.id)
          expect(flag_data['record_type']).to eq('cases')
          expect(flag_data['message']).to eq('This is a flag')
          expect(flag_data['name']).to eq('*******')
          expect(flag_data['hidden_name']).to be
          expect(flag_data['owned_by']).to eq('user1')
          expect(flag_data['removed']).to be_falsey
        end
      end

      context 'and user has Agency permissions' do
        before do
          login_for_test(user_name: 'manager2', permissions: @role.permissions, group_permission: Permission::AGENCY,
                         modules: [@primero_module], agency_id: @manager2.agency_id)
        end

        it 'lists flags owned by or associated with users in current users agency' do
          get '/api/v2/flags'

          expect(response).to have_http_status(200)
          expect(json['data'].size).to eq(4)
          expect(json['data'][0]['record_id']).to eq(@case3.id.to_s)
          expect(json['data'][0]['record_type']).to eq('cases')
          expect(json['data'][0]['message']).to eq('This is a flag')
          expect(json['data'][0]['name']).to eq('Test3')
          expect(json['data'][0]['hidden_name']).not_to be
          expect(json['data'][0]['owned_by']).to eq('user2')
          expect(json['data'][0]['removed']).to be_falsey
        end
      end
    end
  end

  after do
    clean_data(Flag, User, Child, TracingRequest, Incident, PrimeroModule, UserGroup, Agency)
  end
end
