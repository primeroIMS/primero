# frozen_string_literal: true

require 'rails_helper'

describe Flag do
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

    @case1 = Child.create!(data: { short_id: 'abc123', name: 'Test1', hidden_name: true, age: 5, sex: 'male',
                                   owned_by: 'user1' })
    @case2 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female', owned_by: 'user1' })
    @case3 = Child.create!(data: { name: 'Test3', age: 9, sex: 'female', owned_by: 'user2' })
    @case4 = Child.create!(data: { name: 'Test4', age: 9, sex: 'female', owned_by: 'user2' })
    @case5 = Child.create!(data: { name: 'Test5', age: 10, sex: 'male', owned_by: 'user3' })

    @tracing_request1 = TracingRequest.create!(data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1',
                                                       owned_by: 'user1' })
    @tracing_request2 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 2',
                                                       owned_by: 'user2' })
    @tracing_request3 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 3',
                                                       owned_by: 'user2' })

    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1',
                                          owned_by: 'user1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2',
                                          owned_by: 'user2' })

    @flag1 = @case1.add_flag('This is test flag 1', Date.today, 'faketest')
    @case1.add_flag('This is test flag 2', Date.today, 'user1')
    @case3.add_flag('This is test flag 3', Date.today, 'faketest')
    @case5.add_flag('This is test flag 4', Date.today, 'faketest')
    @flag_to_remove = @case1.add_flag('This is test flag 5', Date.today, 'user1')
    @case1.remove_flag(@flag_to_remove.id, 'faketest', 'Resolved Flag')
    @flag_tr1 = @tracing_request1.add_flag('This is a flag TR', Date.today, 'faketest')
    @tracing_request3.add_flag('This is a second flag TR', Date.today, 'faketest')
    @flag_in1 = @incident1.add_flag('This is a flag IN', Date.today, 'faketest')
    @incident1.add_flag('This is a second flag IN', Date.today, 'faketest')
    @incident1.add_flag('This is a third flag IN', Date.today, 'faketest')
    @incident2.add_flag('This is a fourth flag IN', Date.today, 'faketest')
  end

  describe 'by_owner' do
    context 'when the user has query user permissions' do
      before do
        @query_scope = { user: { 'user' => 'user1' }, module: ['primeromodule-cp'] }
      end

      context 'when record_types is passed in' do
        context 'and the record_type is cases' do
          before do
            @record_types = ['cases']
          end

          context 'and active_only is false' do
            before do
              @active_only = false
            end

            it 'returns all case flags owned by or asssociated with the current user' do
              flags = Flag.by_owner(@query_scope, @active_only, @record_types, nil)
              f1 = flags.select { |f| f.id == @flag1.id }.first
              expect(flags.size).to eq(3)
              expect(flags.map(&:removed)).to match_array([false, false, true])
              expect(f1['record_id']).to eq(@case1.id.to_s)
              expect(f1['record_type']).to eq('Child')
              expect(f1['message']).to eq('This is test flag 1')
              expect(f1['short_id']).to eq('abc123')
              expect(f1['name']).to eq('*******')
              expect(f1['hidden_name']).to be
              expect(f1['owned_by']).to eq('user1')
            end
          end

          context 'and active_only is true' do
            before do
              @active_only = true
            end

            it 'returns active case flags owned by or asssociated with the current user' do
              flags = Flag.by_owner(@query_scope, @active_only, @record_types, nil)
              f1 = flags.select { |f| f.id == @flag1.id }.first
              expect(flags.size).to eq(2)
              expect(flags.map(&:removed)).to match_array([false, false])
              expect(f1['record_id']).to eq(@case1.id.to_s)
              expect(f1['record_type']).to eq('Child')
              expect(f1['message']).to eq('This is test flag 1')
              expect(f1['short_id']).to eq('abc123')
              expect(f1['name']).to eq('*******')
              expect(f1['hidden_name']).to be
              expect(f1['owned_by']).to eq('user1')
            end
          end
        end
      end

      context 'when record_types is not passed in' do
        context 'and active_only is false' do
          before do
            active_only = false
            @flags = Flag.by_owner(@query_scope, active_only, nil, nil)
          end

          it 'returns all flags owned by or associated with the current user' do
            expect(@flags.size).to eq(7)
          end

          it 'returns active and inactive flags' do
            expect(@flags.map(&:removed).uniq).to match_array([true, false])
          end

          it 'returns case flags owned by or asssociated with the current user' do
            case_flag = @flags.select { |f| f.id == @flag1.id }.first
            expect(case_flag).to be
            expect(case_flag['record_id']).to eq(@case1.id.to_s)
            expect(case_flag['message']).to eq('This is test flag 1')
            expect(case_flag['short_id']).to eq('abc123')
            expect(case_flag['name']).to eq('*******')
            expect(case_flag['hidden_name']).to be
            expect(case_flag['owned_by']).to eq('user1')
          end

          it 'returns incident flags owned by or asssociated with the current user' do
            incident_flag = @flags.select { |f| f.id == @flag_in1.id }.first
            expect(incident_flag).to be
            expect(incident_flag['record_id']).to eq(@incident1.id.to_s)
            expect(incident_flag['message']).to eq('This is a flag IN')
            expect(incident_flag['short_id']).to eq(@incident1.short_id)
            expect(incident_flag['name']).to be_nil
            expect(incident_flag['hidden_name']).to be_nil
            expect(incident_flag['owned_by']).to eq('user1')
          end

          it 'returns tracing_request flags owned by or asssociated with the current user' do
            tr_flag = @flags.select { |f| f.id == @flag_tr1.id }.first
            expect(tr_flag).to be
            expect(tr_flag['record_id']).to eq(@tracing_request1.id.to_s)
            expect(tr_flag['message']).to eq('This is a flag TR')
            expect(tr_flag['short_id']).to eq(@tracing_request1.short_id)
            expect(tr_flag['name']).to be_nil
            expect(tr_flag['hidden_name']).to be_nil
            expect(tr_flag['owned_by']).to eq('user1')
          end
        end

        context 'and active_only is true' do
          before do
            active_only = true
            @flags = Flag.by_owner(@query_scope, active_only, nil, nil)
          end

          it 'returns all flags owned by or associated with the current user' do
            expect(@flags.size).to eq(6)
          end

          it 'returns active flags' do
            expect(@flags.map(&:removed).uniq).to match_array([false])
          end

          it 'returns case flags owned by or asssociated with the current user' do
            case_flag = @flags.select { |f| f.id == @flag1.id }.first
            expect(case_flag).to be
            expect(case_flag['record_id']).to eq(@case1.id.to_s)
            expect(case_flag['message']).to eq('This is test flag 1')
            expect(case_flag['short_id']).to eq('abc123')
            expect(case_flag['name']).to eq('*******')
            expect(case_flag['hidden_name']).to be
            expect(case_flag['owned_by']).to eq('user1')
          end

          it 'returns incident flags owned by or asssociated with the current user' do
            incident_flag = @flags.select { |f| f.id == @flag_in1.id }.first
            expect(incident_flag).to be
            expect(incident_flag['record_id']).to eq(@incident1.id.to_s)
            expect(incident_flag['message']).to eq('This is a flag IN')
            expect(incident_flag['short_id']).to eq(@incident1.short_id)
            expect(incident_flag['name']).to be_nil
            expect(incident_flag['hidden_name']).to be_nil
            expect(incident_flag['owned_by']).to eq('user1')
          end

          it 'returns tracing_request flags owned by or asssociated with the current user' do
            tr_flag = @flags.select { |f| f.id == @flag_tr1.id }.first
            expect(tr_flag).to be
            expect(tr_flag['record_id']).to eq(@tracing_request1.id.to_s)
            expect(tr_flag['message']).to eq('This is a flag TR')
            expect(tr_flag['short_id']).to eq(@tracing_request1.short_id)
            expect(tr_flag['name']).to be_nil
            expect(tr_flag['hidden_name']).to be_nil
            expect(tr_flag['owned_by']).to eq('user1')
          end
        end
      end

      context 'when flagged_by is passed in' do
        context 'and active_only is false' do
          before do
            active_only = false
            @flags = Flag.by_owner(@query_scope, active_only, nil, 'user1')
          end

          it 'returns flags owned by the current user and flagged by the current user' do
            expect(@flags.size).to eq(2)
            expect(@flags.map(&:removed).uniq).to match_array([true, false])
          end
        end

        context 'and active_only is true' do
          before do
            active_only = true
            @flags = Flag.by_owner(@query_scope, active_only, nil, 'user1')
          end

          it 'returns flags owned by the current user and flagged by the current user' do
            expect(@flags.size).to eq(1)
            expect(@flags.map(&:removed)).to match_array([false])
          end
        end
      end
    end

    context 'when the user has query group permissions' do
      context 'and the user has 1 user_group' do
        before do
          @query_scope = { user: { 'group' => [@group1.unique_id] }, module: ['primeromodule-cp'] }
        end

        context 'and record_types is passed in' do
          context 'and the record_type is cases' do
            before do
              @record_types = ['cases']
            end

            it 'returns case flags owned by or associated with users in current users groups' do
              flags = Flag.by_owner(@query_scope, false, @record_types, nil)
              f1 = flags.select { |f| f.id == @flag1.id }.first
              expect(flags.size).to eq(4)
              expect(flags.map(&:removed).uniq).to match_array([true, false])
              expect(flags.map(&:record_id)).to match_array([@case1.id, @case1.id, @case3.id, @case1.id])
              expect(f1['record_id']).to eq(@case1.id.to_s)
              expect(f1['record_type']).to eq('Child')
              expect(f1['message']).to eq('This is test flag 1')
              expect(f1['short_id']).to eq('abc123')
              expect(f1['name']).to eq('*******')
              expect(f1['hidden_name']).to be
              expect(f1['owned_by']).to eq('user1')

              # expect(flags.first['removed']).to be_falsey
            end
          end

          context 'and the record_type is incidents' do
            before do
              @record_types = ['incidents']
            end

            it 'returns incident flags owned by or associated with users in current users groups' do
              flags = Flag.by_owner(@query_scope, false, @record_types, nil)
              f1 = flags.select { |f| f.id == @flag_in1.id }.first
              expect(flags.size).to eq(4)
              expect(f1['record_id']).to eq(@incident1.id.to_s)
              expect(f1['record_type']).to eq('Incident')
              expect(f1['message']).to eq('This is a flag IN')
              expect(f1['short_id']).to eq(@incident1.short_id)
              expect(f1['name']).to be_nil
              expect(f1['hidden_name']).to be_nil
              expect(f1['owned_by']).to eq('user1')

              # expect(flags.first['removed']).to be_falsey
            end
          end

          context 'and the record_type is tracing_requests' do
            before do
              @record_types = ['tracing_requests']
            end

            it 'returns tracing_request flags owned by or associated with users in current users groups' do
              flags = Flag.by_owner(@query_scope, false, @record_types, nil)
              f1 = flags.select { |f| f.id == @flag_tr1.id }.first
              expect(flags.size).to eq(2)
              expect(f1['record_id']).to eq(@tracing_request1.id.to_s)
              expect(f1['record_type']).to eq('TracingRequest')
              expect(f1['message']).to eq('This is a flag TR')
              expect(f1['short_id']).to eq(@tracing_request1.short_id)
              expect(f1['name']).to be_nil
              expect(f1['hidden_name']).to be_nil
              expect(f1['owned_by']).to eq('user1')

              # expect(flags.first['removed']).to be_falsey
            end
          end
        end

        context 'and record_types is not passed in' do
          before do
            @flags = Flag.by_owner(@query_scope, false, nil, nil)
          end

          it 'returns flags owned by or associated with users in current users groups' do
            expect(@flags.size).to eq(10)
            expect(@flags.map(&:removed).uniq).to match_array([true, false])
          end
        end
      end

      context 'and the user has multiple user_groups' do
        before do
          @query_scope = { user: { 'group' => [@group1.unique_id, @group2.unique_id] }, module: ['primeromodule-cp'] }
        end

        context 'and record_types is not passed in' do
          before do
            @flags = Flag.by_owner(@query_scope, false, nil, nil)
          end

          it 'returns flags owned by or associated with users in current users groups' do
            expect(@flags.size).to eq(11)
            expect(@flags.map(&:removed).uniq).to match_array([true, false])
          end
        end
      end
    end

    context 'when the user has query agency permissions' do
      before do
        @query_scope = { user: { 'agency' => @agency2.unique_id }, module: ['primeromodule-cp'] }
      end

      context 'when record_types is passed in' do
        context 'and the record_type is cases' do
          before do
            @record_types = ['cases']
          end

          it 'returns case flags owned by or associated with users in current users agency' do
            flags = Flag.by_owner(@query_scope, false, @record_types, nil)
            expect(flags.size).to eq(2)
            expect(flags.map(&:record_id)).to match_array([@case3.id, @case5.id])
            expect(flags.map(&:record_type)).to match_array(%w[Child Child])
            expect(flags.map(&:message)).to match_array(['This is test flag 3', 'This is test flag 4'])
            expect(flags.map(&:short_id)).to match_array([@case3.short_id, @case5.short_id])
            expect(flags.map(&:name)).to match_array(%w[Test3 Test5])
            expect(flags.first['hidden_name']).not_to be
            expect(flags.map(&:owned_by)).to match_array(%w[user2 user3])
          end
        end

        context 'and the record_type is incidents' do
          before do
            @record_types = ['incidents']
          end

          it 'returns incident flags owned by or associated with users in current users agency' do
            flags = Flag.by_owner(@query_scope, false, @record_types, nil)
            f1 = flags.first
            expect(flags.size).to eq(1)
            expect(f1['record_id']).to eq(@incident2.id.to_s)
            expect(f1['record_type']).to eq('Incident')
            expect(f1['message']).to eq('This is a fourth flag IN')
            expect(f1['short_id']).to eq(@incident2.short_id)
            expect(f1['name']).to be_nil
            expect(f1['hidden_name']).to be_nil
            expect(f1['owned_by']).to eq('user2')
          end
        end

        context 'and the record_type is tracing_requests' do
          before do
            @record_types = ['tracing_requests']
          end

          it 'returns tracing_request flags owned by or associated with users in current users agency' do
            flags = Flag.by_owner(@query_scope, false, @record_types, nil)
            f1 = flags.first
            expect(flags.size).to eq(1)
            expect(f1['record_id']).to eq(@tracing_request3.id.to_s)
            expect(f1['record_type']).to eq('TracingRequest')
            expect(f1['message']).to eq('This is a second flag TR')
            expect(f1['short_id']).to eq(@tracing_request3.short_id)
            expect(f1['name']).to be_nil
            expect(f1['hidden_name']).to be_nil
            expect(f1['owned_by']).to eq('user2')
          end
        end
      end

      context 'when record_types is not passed in' do
        before do
          @flags = Flag.by_owner(@query_scope, false, nil, nil)
        end

        it 'returns flags owned by or associated with users in current users groups' do
          expect(@flags.size).to eq(4)
        end
      end
    end
  end

  after do
    clean_data(Flag, User, Child, TracingRequest, Incident, PrimeroModule, UserGroup, Agency)
  end
end
