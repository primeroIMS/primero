# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Assign do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, PrimeroModule, UserGroup, Agency, Transition, Incident, Child, Incident)

    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN]
    )
    @role = Role.new(permissions: [permission_case], modules: [@primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @agency1 = Agency.create!(name: 'Agency One', agency_code: 'agency1')
    @user1 = User.new(user_name: 'user1', full_name: 'Test User One', location: 'loc012345', role: @role,
                      user_groups: [@group1], agency_id: @agency1.id)
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @agency2 = Agency.create!(name: 'Agency Two', agency_code: 'agency2')
    @user2 = User.new(user_name: 'user2', full_name: 'Test User Two', location: 'loc8675309', role: @role,
                      user_groups: [@group2], agency_id: @agency2.id)
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', full_name: 'Test User Three', location: 'loc8675309', role: @role,
                      user_groups: [@group2], agency_id: @agency2.id)
    @user3.save(validate: false)
  end

  context 'and the user has permission' do
    before do
      @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1',
                                   module_id: @primero_module.unique_id })
      Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
    end

    it 'changes owned_by' do
      expect(@case.owned_by).to eq('user2')
      expect(@case.previously_owned_by).to eq('user1')
    end

    it 'changes owned_by_full_name' do
      expect(@case.owned_by_full_name).to eq('Test User Two')
      expect(@case.previously_owned_by_full_name).to eq('Test User One')
    end

    it 'changes owned_by_location' do
      expect(@case.owned_by_location).to eq('loc8675309')
      expect(@case.previously_owned_by_location).to eq('loc012345')
    end

    it 'changes owned_by_agency' do
      expect(@case.owned_by_agency).to eq(@agency2.unique_id)
      expect(@case.previously_owned_by_agency).to eq(@agency1.unique_id)
    end

    describe 'record history' do
      before do
        @record_histories = @case.record_histories
      end

      it 'is updated' do
        expect(@record_histories.size).to eq(2)
        expect(@record_histories.map(&:action)).to match_array(%w[update create])
        expect(@record_histories.map(&:record_type)).to match_array(%w[Child Child])
      end

      describe 'owned_by' do
        before do
          @update_action = @record_histories.select { |h| h.action == 'update' }.first
        end

        it 'is updated' do
          expect(@update_action.record_changes['owned_by']).to be
          expect(@update_action.record_changes['owned_by']['to']).to eq('user2')
          expect(@update_action.record_changes['owned_by']['from']).to eq('user1')
        end
      end
    end

    context 'and the case has incidents' do
      before do
        case_with_incidents = Child.new(data: { 'name' => 'Test Incidents', 'owned_by' => 'user1',
                                                module_id: @primero_module.unique_id })
        incident1 = IncidentCreationService.incident_from_case(case_with_incidents, {}, nil)
        incident2 = IncidentCreationService.incident_from_case(case_with_incidents, {}, nil)
        case_with_incidents.incidents << incident1
        case_with_incidents.incidents << incident2
        case_with_incidents.save!
        Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: case_with_incidents)
        @incident1 = case_with_incidents.incidents.first
        @incident2 = case_with_incidents.incidents.last
      end

      describe 'on the incidents' do
        it 'changes owned_by' do
          expect(@incident1.owned_by).to eq('user2')
          expect(@incident1.previously_owned_by).to eq('user1')
          expect(@incident2.owned_by).to eq('user2')
          expect(@incident2.previously_owned_by).to eq('user1')
        end

        it 'changes owned_by_full_name' do
          expect(@incident1.owned_by_full_name).to eq('Test User Two')
          expect(@incident1.previously_owned_by_full_name).to eq('Test User One')
          expect(@incident2.owned_by_full_name).to eq('Test User Two')
          expect(@incident2.previously_owned_by_full_name).to eq('Test User One')
        end

        it 'changes owned_by_location' do
          expect(@incident1.owned_by_location).to eq('loc8675309')
          expect(@incident1.previously_owned_by_location).to eq('loc012345')
          expect(@incident2.owned_by_location).to eq('loc8675309')
          expect(@incident2.previously_owned_by_location).to eq('loc012345')
        end

        it 'changes owned_by_agency' do
          expect(@incident1.owned_by_agency).to eq(@agency2.unique_id)
          expect(@incident1.previously_owned_by_agency).to eq(@agency1.unique_id)
          expect(@incident2.owned_by_agency).to eq(@agency2.unique_id)
          expect(@incident2.previously_owned_by_agency).to eq(@agency1.unique_id)
        end

        describe 'record history' do
          before do
            @record_histories = @incident1.record_histories
          end

          it 'is updated' do
            expect(@record_histories.size).to eq(2)
            expect(@record_histories.map(&:action)).to match_array(%w[update create])
            expect(@record_histories.map(&:record_type)).to match_array(%w[Incident Incident])
          end

          describe 'owned_by' do
            before do
              @update_action = @record_histories.select { |h| h.action == 'update' }.first
            end

            it 'is updated' do
              expect(@update_action.record_changes['owned_by']).to be
              expect(@update_action.record_changes['owned_by']['to']).to eq('user2')
              expect(@update_action.record_changes['owned_by']['from']).to eq('user1')
            end
          end
        end
      end
    end

    describe '.notify' do
      context 'when should_notify? is true' do
        it 'should enqueue a TransitionNotifyJob' do
          expect(
            ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == TransitionNotifyJob }.size
          ).to eq(1)
        end
      end
      context 'when should_notify? is false' do
        before do
          clear_enqueued_jobs
          Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case, from_bulk_export: true)
        end

        it 'should enqueue a TransitionNotifyJob' do
          expect(
            ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == TransitionNotifyJob }.size
          ).to eq(0)
        end
      end
    end
  end

  context 'and the user has permission within the user group' do
    before do
      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN_WITHIN_USER_GROUP]
      )
      @role.permissions = [permission_case]
      @role.save(validate: false)
    end

    context 'and the to user is in the same user group' do
      before do
        @user2.user_groups = [@group1]
        @user2.save(validate: false)
        @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
        Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'changes owned_by' do
        expect(@case.owned_by).to eq('user2')
        expect(@case.previously_owned_by).to eq('user1')
      end

      it 'changes owned_by_full_name' do
        expect(@case.owned_by_full_name).to eq('Test User Two')
        expect(@case.previously_owned_by_full_name).to eq('Test User One')
      end

      it 'changes owned_by_location' do
        expect(@case.owned_by_location).to eq('loc8675309')
        expect(@case.previously_owned_by_location).to eq('loc012345')
      end

      it 'changes owned_by_agency' do
        expect(@case.owned_by_agency).to eq(@agency2.unique_id)
        expect(@case.previously_owned_by_agency).to eq(@agency1.unique_id)
      end
    end

    context 'and the to user is in a different user group' do
      before do
        @user2.user_groups = [@group2]
        @user2.save(validate: false)
        @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
      end

      it 'does not assign this record' do
        assign = Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(assign.valid?).to be_falsey
        expect(@case.owned_by).to eq('user1')
      end
    end
  end

  context 'and the user has permission within the agency' do
    before do
      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN_WITHIN_AGENCY]
      )
      @role.permissions = [permission_case]
      @role.save(validate: false)
    end

    context 'and the to user is in the same agency' do
      before do
        @user2.agency_id = @agency1.id
        @user2.save(validate: false)
        @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
        Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'changes owned_by' do
        expect(@case.owned_by).to eq('user2')
        expect(@case.previously_owned_by).to eq('user1')
      end

      it 'changes owned_by_full_name' do
        expect(@case.owned_by_full_name).to eq('Test User Two')
        expect(@case.previously_owned_by_full_name).to eq('Test User One')
      end

      it 'changes owned_by_location' do
        expect(@case.owned_by_location).to eq('loc8675309')
        expect(@case.previously_owned_by_location).to eq('loc012345')
      end

      it 'does not change owned_by_agency' do
        expect(@case.owned_by_agency).to eq(@agency1.unique_id)
        expect(@case.previously_owned_by_agency).to eq(@agency1.unique_id)
      end
    end

    context 'and the to user is in a different agency' do
      before do
        @user2.agency_id = @agency2.id
        @user2.save(validate: false)
        @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
      end

      it 'does not assign this record' do
        assign = Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(assign.valid?).to be_falsey
        expect(@case.owned_by).to eq('user1')
      end
    end
  end

  context 'and the user does not have permission' do
    before do
      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      @role.permissions = [permission_case]
      @role.save(validate: false)
      @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
    end

    it "doesn't assign this record to a user outside of the user group if the role forbids it" do
      assign = Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(assign.valid?).to be_falsey
      expect(@case.owned_by).to eq('user1')
    end
  end

  context 'the change logs show the right user' do
    before do
      @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1',
                                   module_id: @primero_module.unique_id })
      @case.update_last_updated_by(@user2)
      @case.save!
      @case.reload
      Assign.create!(transitioned_by: 'user3', transitioned_to: 'user2', record: @case)
    end

    it 'should create a record history with a specific user' do
      expect(@case.ordered_histories.first.user_name).to eq(@user3.user_name)
    end
  end

  context 'and record is Incident' do
    before do
      permission_incident_assign = Permission.new(
        resource: Permission::INCIDENT, actions: [Permission::ASSIGN]
      )
      permission_incident = Permission.new(
        resource: Permission::INCIDENT,
        actions: [
          Permission::READ
        ]
      )
      @role_case_incident = Role.new(
        permissions: [permission_case, permission_incident_assign], modules: [@primero_module]
      )
      @role_case_incident.save(validate: false)
      @role_incident = Role.new(permissions: [permission_incident], modules: [@primero_module])
      @role_incident.save(validate: false)
      @user4 = User.new(user_name: 'user4', role: @role_case_incident, user_groups: [@group1])
      @user4.save(validate: false)
      @user5 = User.new(user_name: 'user5', role: @role_incident, user_groups: [@group2])
      @user5.save(validate: false)
      @incident = Incident.create(
        data: {
          age: 3,
          status: 'open',
          owned_by: 'user4',
          short_id: '6a7013f',
          module_id: @primero_module.unique_id
        }
      )
      Assign.create!(transitioned_by: 'user4', transitioned_to: 'user5', record: @incident)
    end

    it 'create assign for incident' do
      assign = Assign.first
      expect(assign.record_id).to eq(@incident.id)
    end

    it 'changes owned_by' do
      expect(@incident.owned_by).to eq('user5')
      expect(@incident.previously_owned_by).to eq('user4')
    end
  end

  after do
    clean_data(User, Role, PrimeroModule, UserGroup, Agency, Transition, Incident, Child, Incident)
  end
end
