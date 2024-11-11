# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'
require 'cancan/matchers'

CRUD = %i[index create view edit update destroy].freeze

describe Ability do
  before do
    clean_data(
      Alert, Role, PrimeroModule, PrimeroProgram,
      User, Incident, Child, Field, FormSection,
      Agency, UserGroup, Referral
    )
    @user1 = create :user
    @user2 = create :user
    @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @permission_case_read_write = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  after do
    clean_data(
      Alert, User, Role, PrimeroModule, PrimeroProgram,
      Incident, Child, Field, FormSection,
      Agency, UserGroup, Referral
    )
  end

  describe 'Records' do
    before :each do
      Child.any_instance.stub(:field_definitions).and_return([])
    end

    it 'allows an owned record to be read given a read permission' do
      role = create :role, permissions: [@permission_case_read]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Child)
      expect(ability).to authorize(:read, case1)
    end

    it 'does not allow an owned record to be written to given only a read permission' do
      role = create :role, permissions: [@permission_case_read]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:write, Child)
      expect(ability).not_to authorize(:write, case1)
    end

    it 'allows a non-owned but associated record to be read' do
      role = create :role, permissions: [@permission_case_read]
      @user1.role = role
      case1 = create :child, owned_by: @user2.user_name, assigned_user_names: [@user1.user_name]

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Child)
      expect(ability).to authorize(:read, case1)
    end

    it 'allows an owned record to be written to given a write permission' do
      role = create :role, permissions: [@permission_case_read_write]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:write, Child)
      expect(ability).to authorize(:write, case1)
    end

    it 'allows an owned record to be flagged given a flag permission' do
      permission_flag = Permission.new(resource: Permission::CASE, actions: [Permission::FLAG])
      role = create :role, permissions: [permission_flag]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:flag, case1)
    end

    it 'allows an owned record to be reassigned' do
      permission_assign = Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN])
      role = create :role, permissions: [permission_assign]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:assign, case1)
    end

    it 'does not allow a record to be written to even if the record can be flagged and assigned' do
      permission_flag_assign = Permission.new(
        resource: Permission::CASE, actions: [Permission::FLAG, Permission::ASSIGN]
      )
      role = create :role, permissions: [permission_flag_assign]
      @user1.role = role
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:write, Child)
      expect(ability).not_to authorize(:write, case1)
    end

    it 'does not allow a record owned by someone else to be managed by a user with no specified scope' do
      role = create :role, permissions: [@permission_case_read_write]
      @user1.role = role
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, case1)
      expect(ability).not_to authorize(:write, case1)
    end

    it 'does not allow a record owned by someone else to be managed by a user with a "self" scope' do
      role = create :role, permissions: [@permission_case_read_write], group_permission: Permission::SELF
      @user1.role = role
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, case1)
      expect(ability).not_to authorize(:write, case1)
    end

    it 'allows a record owned by a fellow group member to be managed by a user with "group" scope' do
      role = create :role, permissions: [@permission_case_read_write], group_permission: Permission::GROUP
      test_user_group = build(:user_group, unique_id: 'test_group')
      @user1.role = role
      @user1.user_groups = [test_user_group]
      @user1.save
      @user2.user_groups = [test_user_group]
      @user2.save
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, case1)
      expect(ability).to authorize(:write, case1)
    end

    it 'allows a record owned by someone else to be read by a user with full "all" scope' do
      role = create :role, permissions: [@permission_case_read_write], group_permission: Permission::ALL
      test_group = build(:user_group, unique_id: 'test_group')
      other_test_group = build(:user_group, unique_id: 'other_test_group')
      @user1.role = role
      @user1.user_groups = [test_group]
      @user1.save
      @user2.user_groups = [other_test_group]
      @user2.save
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, case1)
      expect(ability).to authorize(:write, case1)
    end

    describe '#configure_flags' do
      let(:flag_permissions) do
        Permission.records.map do |resource|
          Permission.new(resource:, actions: [Permission::READ, Permission::FLAG])
        end
      end

      let(:flag_role) { create :role, permissions: flag_permissions }
      let(:flag_user) { create :user, role: flag_role }
      subject(:ability) { Ability.new(flag_user) }

      it 'allows to flag records an user' do
        [Child, TracingRequest, Incident, RegistryRecord, Family].each do |model|
          instance = model.new_with_user(flag_user, {})
          expect(ability).to be_able_to(:flag_record, instance)
        end
      end
    end

    describe '#resolve_flag' do
      let(:flag_permissions) do
        Permission.records.map do |resource|
          Permission.new(resource:, actions: [Permission::READ, Permission::FLAG_RESOLVE_ANY])
        end
      end

      let(:flag_resolve_any_role) { create :role, permissions: flag_permissions }
      let(:flag_resolve_any_user) { create :user, role: flag_resolve_any_role }
      subject(:ability) { Ability.new(flag_resolve_any_user) }

      it 'allows to resolve flag records an user' do
        [Child, TracingRequest, Incident, RegistryRecord, Family].each do |model|
          instance = model.new_with_user(flag_resolve_any_user, {})
          expect(ability).to be_able_to(:flag_resolve, instance)
        end
      end
    end
  end

  describe 'Roles' do
    before :each do
      @permission_role_read = Permission.new(resource: Permission::ROLE, actions: [Permission::READ])
      @permission_role_read_write = Permission.new(
        resource: Permission::ROLE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN]
      )
    end

    context 'super user' do
      before :each do
        super_user_permissions_to_manage = [
          Permission::CASE, Permission::INCIDENT, Permission::REPORT,
          Permission::ROLE, Permission::USER, Permission::USER_GROUP,
          Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
        ]
        @permissions_super_user_list = super_user_permissions_to_manage.map do |p|
          Permission.new(resource: p, actions: [Permission::MANAGE])
        end
        user_admin_permissions_to_manage = [
          Permission::ROLE, Permission::USER, Permission::USER_GROUP,
          Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
        ]
        @permissions_user_admin_list = user_admin_permissions_to_manage.map do |p|
          Permission.new(resource: p, actions: [Permission::MANAGE])
        end
        @super_role = create(
          :role, name: 'super_user_role', permissions: @permissions_super_user_list, group_permission: Permission::ALL
        )
      end

      it 'does not allow a user with super user status to edit another super user role' do
        super_role2 = create(
          :role, name: 'super_user_role2', permissions: @permissions_super_user_list, group_permission: Permission::ALL
        )
        @user1.role = @super_role
        @user1.save

        ability = Ability.new @user1

        expect(@user1.super_user?).to be_truthy
        expect(super_role2.super_user_role?).to be_truthy
        expect(ability).not_to authorize(:write, super_role2)
      end

      # TODO-permission: uncomment when this fucntionality is implemented in ability.rb
      xit 'allow a user with super user status to assign its own role or another super user role' do
        super_role2 = create(
          :role, name: 'super_user_role2', permissions: @permissions_super_user_list, group_permission: Permission::ALL
        )
        @user1.role = @super_role
        @user1.save

        ability = Ability.new @user1

        expect(@user1.super_user?).to be_truthy
        expect(super_role2.super_user_role?).to be_truthy
        expect(ability).to authorize(:assign, @super_role)
        expect(ability).to authorize(:assign, super_role2)
      end

      it 'does not allow a user with super user status to edit its own role' do
        @user1.role = @super_role
        @user1.save

        ability = Ability.new @user1

        expect(@user1.super_user?).to be_truthy
        expect(ability).not_to authorize(:write, @super_role)
      end

      it 'does not allow a user to edit or assign a super user role' do
        user_admin_role = create(
          :role,
          name: 'user_admin_role',
          permissions: @permissions_user_admin_list,
          group_permission: Permission::ADMIN_ONLY
        )
        user_role = create(
          :role, name: 'user_role', permissions: [@permission_role_read_write], group_permission: Permission::ALL
        )

        @user1.role = user_admin_role
        @user1.save
        @user2.role = user_role
        @user2.save

        ability1 = Ability.new @user1
        ability2 = Ability.new @user2

        expect(@user1.super_user?).to be_falsey
        expect(@user2.super_user?).to be_falsey
        expect(@super_role.super_user_role?).to be_truthy
        expect(ability1).not_to authorize(:write, @super_role)
        expect(ability1).not_to authorize(:assign, @super_role)
        expect(ability2).not_to authorize(:write, @super_role)
        expect(ability2).not_to authorize(:assign, @super_role)
      end

      after :each do
        clean_data(User, Role)
      end
    end

    it 'allows a user with read permissions to read but not edit roles' do
      role = create :role, permissions: [@permission_role_read]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Role)
      expect(ability).not_to authorize(:write, Role)
    end

    it 'allows a user with read and write permissions to read and edit roles' do
      role = create :role, permissions: [@permission_role_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Role)
      expect(ability).to authorize(:write, Role)
    end

    it 'does not allow a user with only "role" permission to manage another user' do
      role = create :role, permissions: [@permission_role_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, @user2)
      expect(ability).not_to authorize(:write, @user2)
    end

    it 'does not allow viewing and editing of Groups, and Agencies if only the "role" permission is set' do
      role = create :role, permissions: [@permission_role_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      [UserGroup, Agency].each do |resource|
        expect(ability).not_to authorize(:read, resource)
        expect(ability).not_to authorize(:write, resource)
      end
    end

    context 'when Role Specific permission' do
      before :each do
        clean_data(User, Role)
        @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_case_read = create :role, permissions: [@permission_case_read]
        @permission_tracing_request_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_tracing_request_read = create :role, permissions: [@permission_tracing_request_read]
        @permission_incident_read = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ])
        @role_incident_read = create :role, permissions: [@permission_incident_read]
      end

      context 'is set with read access' do
        before :each do
          @permission_role_specific_read = Permission.new(resource: Permission::ROLE, actions: [Permission::READ],
                                                          role_unique_ids: [@role_case_read.unique_id])
          @role_role_specific_read = create :role, permissions: [@permission_role_specific_read],
                                                   group_permission: Permission::GROUP
          @user1.role = @role_role_specific_read
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read roles assigned to them' do
          expect(@ability).to authorize(:read, @role_case_read)
        end

        it 'does not allow user to read roles not assigned to them' do
          expect(@ability).not_to authorize(:read, @role_tracing_request_read)
          expect(@ability).not_to authorize(:read, @role_incident_read)
        end

        it 'does not allow user to edit roles assigned to them' do
          expect(@ability).not_to authorize(:edit, @role_case_read)
        end
      end

      context 'is set with read write access' do
        before :each do
          @permission_role_specific_read_write = Permission.new(
            resource: Permission::ROLE,
            actions: [Permission::READ, Permission::WRITE, Permission::CREATE],
            role_unique_ids: [@role_case_read.unique_id, @role_incident_read.unique_id]
          )
          @role_role_specific_read_write = create(
            :role, permissions: [@permission_role_specific_read_write], group_permission: Permission::GROUP
          )
          @user1.role = @role_role_specific_read_write
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read roles assigned to them' do
          expect(@ability).to authorize(:read, @role_case_read)
          expect(@ability).to authorize(:read, @role_incident_read)
        end

        it 'does not allow user to read roles not assigned to them' do
          expect(@ability).not_to authorize(:read, @role_tracing_request_read)
        end

        it 'allows user to edit roles assigned to them' do
          expect(@ability).to authorize(:edit, @role_case_read)
          expect(@ability).to authorize(:edit, @role_incident_read)
        end

        it 'does not allow user to edit roles not assigned to them' do
          expect(@ability).not_to authorize(:edit, @role_tracing_request_read)
        end
      end

      context 'is not set' do
        before :each do
          @permission_role_read_write = Permission.new(resource: Permission::ROLE,
                                                       actions: [
                                                         Permission::READ, Permission::WRITE, Permission::CREATE
                                                       ])
          @role_non_role_specific_read_write = create :role, permissions: [@permission_role_read_write]
          @user1.role = @role_non_role_specific_read_write
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read all roles' do
          expect(@ability).to authorize(:read, @role_case_read)
          expect(@ability).to authorize(:read, @role_tracing_request_read)
          expect(@ability).to authorize(:read, @role_incident_read)
        end

        it 'allows user to edit all roles' do
          expect(@ability).to authorize(:edit, @role_case_read)
          expect(@ability).to authorize(:edit, @role_tracing_request_read)
          expect(@ability).to authorize(:edit, @role_incident_read)
        end
      end

      after :each do
        clean_data(User, Role)
      end
    end

    context 'when specifying which ROLES can be assigned' do
      before do
        clean_data(User, Role)
        @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_case_read = create :role, permissions: [@permission_case_read]
        @permission_tracing_request_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_tracing_request_read = create :role, permissions: [@permission_tracing_request_read]
        @permission_incident_read = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ])
        @role_incident_read = create :role, permissions: [@permission_incident_read]
        @permission_user_read_write = Permission.new(resource: Permission::USER,
                                                     actions: [
                                                       Permission::READ, Permission::WRITE, Permission::CREATE
                                                     ])
      end

      context 'and specifies 2 roles' do
        before :each do
          @permission_role_assign2 = Permission.new(
            resource: Permission::ROLE,
            actions: [Permission::ASSIGN],
            role_unique_ids: [@role_case_read.unique_id, @role_incident_read.unique_id]
          )
          @role_role_assign2 = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_assign2],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign2
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign the 2 roles specified' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
        end

        it 'does not allow user to assign the role not specified' do
          expect(@ability).not_to authorize(:assign, @role_tracing_request)
        end

        it 'does not allow user to read any of the roles' do
          expect(@ability).not_to authorize(:read, @role_case_read)
          expect(@ability).not_to authorize(:read, @role_incident_read)
          expect(@ability).not_to authorize(:read, @role_tracing_request_read)
        end

        it 'does not allow user to edit any of the roles' do
          expect(@ability).not_to authorize(:edit, @role_case_read)
          expect(@ability).not_to authorize(:edit, @role_incident_read)
          expect(@ability).not_to authorize(:edit, @role_tracing_request_read)
        end
      end

      context 'and specifies ALL roles' do
        before :each do
          @permission_role_assign_all = Permission.new(resource: Permission::ROLE, actions: [Permission::ASSIGN])
          @role_role_assign_all = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_assign_all],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign_all
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign all of the roles' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
          expect(@ability).to authorize(:assign, @role_tracing_request_read)
          expect(@ability).to authorize(:assign, @role_role_assign_all)
        end
      end

      context 'and specifies no roles' do
        before :each do
          @permission_role_read_write = Permission.new(resource: Permission::ROLE,
                                                       actions: [
                                                         Permission::READ, Permission::WRITE, Permission::CREATE
                                                       ])
          @role_role_assign_none = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_read_write],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign_none
          @user1.save

          @ability = Ability.new @user1
        end

        it 'does not allow user to assign any of the roles' do
          expect(@ability).not_to authorize(:assign, @role_case_read)
          expect(@ability).not_to authorize(:assign, @role_incident_read)
          expect(@ability).not_to authorize(:assign, @role_tracing_request_read)
          expect(@ability).not_to authorize(:assign, @role_role_assign_none)
        end
      end

      context 'and user has MANAGE permission on ROLE' do
        before :each do
          @permission_role_manage = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
          @role_role_manage = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_manage],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_manage
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign all of the roles' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
          expect(@ability).to authorize(:assign, @role_tracing_request_read)
        end

        it 'does not allow user to assign its own role' do
          expect(@ability).not_to authorize(:assign, @role_role_manage)
        end
      end

      after do
        clean_data(User, Role)
      end
    end
  end

  describe 'Users' do
    before :each do
      @permission_user_read = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      @permission_user_read_write = Permission.new(
        resource: Permission::USER, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
    end

    context 'with User READ permissions' do
      before do
        role_user_read = create :role, permissions: [@permission_user_read]
        @user1.role = role_user_read
        @user1.save
        @ability_user_read = Ability.new @user1
      end

      it 'can read all users' do
        expect(@ability_user_read).to authorize(:read, User)
      end

      it 'cannot write all users' do
        expect(@ability_user_read).not_to authorize(:write, User)
      end

      it 'can read their own user' do
        expect(@ability_user_read).to authorize(:read_self, @user1)
      end

      it 'can write their own user' do
        expect(@ability_user_read).to authorize(:write_self, @user1)
      end

      it 'cannot write another user' do
        expect(@ability_user_read).not_to authorize(:write, @user2)
        expect(@ability_user_read).not_to authorize(:write_self, @user2)
      end
    end

    context 'without User READ / WRITE permissions' do
      before do
        role_case_read = create :role, permissions: [@permission_case_read]
        @user1.role = role_case_read
        @user1.save
        @ability_case_read = Ability.new @user1
      end

      it 'cannot read all users' do
        expect(@ability_case_read).not_to authorize(:read, User)
      end

      it 'cannot write all users' do
        expect(@ability_case_read).not_to authorize(:write, User)
      end

      it 'can read their own user' do
        expect(@ability_case_read).to authorize(:read_self, @user1)
      end

      it 'can write their own user' do
        expect(@ability_case_read).to authorize(:write_self, @user1)
      end

      it 'cannot read another user' do
        expect(@ability_case_read).not_to authorize(:read, @user2)
        expect(@ability_case_read).not_to authorize(:read_self, @user2)
      end

      it 'cannot write another user' do
        expect(@ability_case_read).not_to authorize(:write, @user2)
        expect(@ability_case_read).not_to authorize(:write_self, @user2)
      end
    end

    it "doesn't allow a user with no specified scope to edit another user" do
      role = create :role, permissions: [@permission_user_read]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to_not authorize(:read, @user2)
      expect(ability).to_not authorize(:write, @user2)
    end

    it 'allows a user with group scope to only edit another user in that group if the user is specified in the permissions role_unique_ids' do
      role2 = create :role, permissions: [@permission_user_read], group_permission: Permission::GROUP
      @permission_user_read_write_group = Permission.new(
        resource: Permission::USER,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE],
        role_unique_ids: [role2.unique_id]
      )
      role1 = create :role, permissions: [@permission_user_read_write_group], group_permission: Permission::GROUP
      test_group = build(:user_group, unique_id: 'test_group')
      other_test_group = build(:user_group, unique_id: 'other_test_group')
      @user1.role = role1
      @user1.user_groups = [test_group]
      @user1.save
      user2 = create :user, user_groups: [test_group], role: role2
      # user3 = create :user, user_groups: [test_group]
      user4 = create :user, user_groups: [other_test_group], role: role2

      ability = Ability.new @user1

      expect(ability).to authorize(:read, user2)
      expect(ability).to authorize(:write, user2)
      # TODO-permission: Uncomment when user editing based on role ids is implmented
      # expect(ability).to_not authorize(:read, user3)
      # expect(ability).to_not authorize(:write, user3)
      expect(ability).to_not authorize(:read, user4)
      expect(ability).to_not authorize(:write, user4)
    end

    it "does not allow viewing and editing of Roles if the 'user' permission is set along with 'read' and 'write'" do
      role = create :role, permissions: [@permission_user_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, Role)
      expect(ability).not_to authorize(:write, Role)
    end

    context 'when Users role has "all records" group permission' do
      it 'should be able to edit any user in the system' do
        role = create :role, permissions: [@permission_user_read_write], group_permission: Permission::ALL
        test_user_group1 = build(:user_group, unique_id: 'test_user_group_1')
        @user2.user_groups = [test_user_group1]
        @user1.role = role
        @user1.save

        test_user_group2 = build(:user_group, unique_id: 'test_user_group_2')
        @user2.user_groups = [test_user_group2]
        @user2.save

        ability = Ability.new @user1

        expect(ability).to authorize(:read, @user2)
        expect(ability).to authorize(:write, @user2)
      end
    end
  end

  describe 'User Groups' do
    before :each do
      clean_data(UserGroup)

      @user_group1 = UserGroup.create!(unique_id: 'usergroup-1', name: 'User Group 1')
      @user_group2 = UserGroup.create!(unique_id: 'usergroup-2', name: 'User Group 2')
      @permission_user_group_read = Permission.new(resource: Permission::USER_GROUP, actions: [Permission::READ])
      @permission_user_group_read_write = Permission.new(
        resource: Permission::USER_GROUP, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
    end

    it 'allows a user with read permissions to read but not edit user groups' do
      role = create :role, permissions: [@permission_user_group_read]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, UserGroup)
      expect(ability).not_to authorize(:write, UserGroup)
    end

    it 'allows a user with agency scope and read permissions to read its own user groups' do
      role = create :role, permissions: [@permission_user_group_read], group_permission: Permission::AGENCY
      @user1.role = role
      @user1.user_groups = [@user_group1]
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, UserGroup)
      expect(ability).not_to authorize(:write, UserGroup)
      expect(ability).to authorize(:read, @user_group1)
      expect(ability).not_to authorize(:write, @user_group1)
    end

    it 'allows a user with read and write permissions to read and edit user groups' do
      role = create :role, permissions: [@permission_user_group_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, UserGroup)
      expect(ability).to authorize(:write, UserGroup)
    end

    it 'does not allow a user with only "user group" permission to manage another user' do
      role = create :role, permissions: [@permission_user_group_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, @user2)
      expect(ability).not_to authorize(:write, @user2)
    end
  end

  describe 'Agencies' do
    before :each do
      @permission_agency_read = Permission.new(resource: Permission::AGENCY, actions: [Permission::READ])
      @permission_agency_read_write = Permission.new(
        resource: Permission::AGENCY, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
    end

    it 'allows a user with read permissions to read but not edit agencies' do
      role = create :role, permissions: [@permission_agency_read]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Agency)
      expect(ability).not_to authorize(:write, Agency)
    end

    it 'allows a user with read and write permissions to read and edit agencies' do
      role = create :role, permissions: [@permission_agency_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Agency)
      expect(ability).to authorize(:write, Agency)
    end

    it 'does not allow a user with only "agency" permission to manage another user' do
      role = create :role, permissions: [@permission_agency_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, @user2)
      expect(ability).not_to authorize(:write, @user2)
    end

    it 'does not allow viewing and editing of Groups if only the "agency" permission is set' do
      role = create :role, permissions: [@permission_agency_read_write]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, UserGroup)
      expect(ability).not_to authorize(:write, UserGroup)
    end

    context 'when Agency Specific permission' do
      before do
        clean_data(User, Agency)
        @agency1 = Agency.create(name: 'agency one', agency_code: '1111')
        @agency2 = Agency.create(name: 'agency two', agency_code: '2222')
        @agency3 = Agency.create(name: 'agency three', agency_code: '3333')
        @agency4 = Agency.create(name: 'agency four', agency_code: '4444')
      end

      context 'is set with read access' do
        before :each do
          @permission_agency_specific_read = Permission.new(
            resource: Permission::AGENCY, actions: [Permission::READ],
            agency_unique_ids: [@agency1.unique_id]
          )
          @role_agency_specific_read = create(
            :role,
            permissions: [@permission_agency_specific_read],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_agency_specific_read
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read agencies assigned to them' do
          expect(@ability).to authorize(:read, @agency1)
        end

        it 'does not allow user to read agencies not assigned to them' do
          expect(@ability).not_to authorize(:read, @agency2)
          expect(@ability).not_to authorize(:read, @agency3)
          expect(@ability).not_to authorize(:read, @agency4)
        end

        it 'does not allow user to edit agencies assigned to them' do
          expect(@ability).not_to authorize(:edit, @agency1)
        end
      end

      context 'is set with read write access' do
        before :each do
          @permission_agency_specific_read_write = Permission.new(
            resource: Permission::AGENCY,
            actions: [Permission::READ, Permission::WRITE, Permission::CREATE],
            agency_unique_ids: [@agency1.unique_id, @agency3.unique_id]
          )
          @role_agency_specific_read_write = create(
            :role, permissions: [@permission_agency_specific_read_write], group_permission: Permission::GROUP
          )
          @user1.role = @role_agency_specific_read_write
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read agencies assigned to them' do
          expect(@ability).to authorize(:read, @agency1)
          expect(@ability).to authorize(:read, @agency3)
        end

        it 'does not allow user to read agencies not assigned to them' do
          expect(@ability).not_to authorize(:read, @agency2)
          expect(@ability).not_to authorize(:read, @agency4)
        end

        it 'allows user to edit agencies assigned to them' do
          expect(@ability).to authorize(:edit, @agency1)
          expect(@ability).to authorize(:edit, @agency3)
        end

        it 'does not allow user to edit agencies not assigned to them' do
          expect(@ability).not_to authorize(:edit, @agency2)
          expect(@ability).not_to authorize(:edit, @agency4)
        end
      end

      context 'is not set' do
        before :each do
          @permission_agency_read_write = Permission.new(
            resource: Permission::AGENCY, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
          )
          @role_non_agency_specific_read_write = create :role, permissions: [@permission_agency_read_write]
          @user1.role = @role_non_agency_specific_read_write
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to read all agencies' do
          expect(@ability).to authorize(:read, @agency1)
          expect(@ability).to authorize(:read, @agency2)
          expect(@ability).to authorize(:read, @agency3)
          expect(@ability).to authorize(:read, @agency4)
        end

        it 'allows user to edit all agencies' do
          expect(@ability).to authorize(:edit, @agency1)
          expect(@ability).to authorize(:edit, @agency2)
          expect(@ability).to authorize(:edit, @agency3)
          expect(@ability).to authorize(:edit, @agency4)
        end
      end

      after do
        clean_data(User, Agency)
      end
    end

    context 'when specifying which ROLES can be assigned' do
      before do
        clean_data(User, Role)
        @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_case_read = create :role, permissions: [@permission_case_read]
        @permission_tracing_request_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        @role_tracing_request_read = create :role, permissions: [@permission_tracing_request_read]
        @permission_incident_read = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ])
        @role_incident_read = create :role, permissions: [@permission_incident_read]
        @permission_user_read_write = Permission.new(
          resource: Permission::USER,
          actions: [
            Permission::READ, Permission::WRITE, Permission::CREATE
          ]
        )
      end

      context 'and specifies 2 roles' do
        before :each do
          @permission_role_assign2 = Permission.new(
            resource: Permission::ROLE,
            actions: [Permission::ASSIGN],
            role_unique_ids: [@role_case_read.unique_id, @role_incident_read.unique_id]
          )
          @role_role_assign2 = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_assign2],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign2
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign the 2 roles specified' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
        end

        it 'does not allow user to assign the role not specified' do
          expect(@ability).not_to authorize(:assign, @role_tracing_request)
        end

        it 'does not allow user to read any of the roles' do
          expect(@ability).not_to authorize(:read, @role_case_read)
          expect(@ability).not_to authorize(:read, @role_incident_read)
          expect(@ability).not_to authorize(:read, @role_tracing_request_read)
        end

        it 'does not allow user to edit any of the roles' do
          expect(@ability).not_to authorize(:edit, @role_case_read)
          expect(@ability).not_to authorize(:edit, @role_incident_read)
          expect(@ability).not_to authorize(:edit, @role_tracing_request_read)
        end
      end

      context 'and specifies ALL roles' do
        before :each do
          @permission_role_assign_all = Permission.new(resource: Permission::ROLE, actions: [Permission::ASSIGN])
          @role_role_assign_all = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_assign_all],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign_all
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign all of the roles' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
          expect(@ability).to authorize(:assign, @role_tracing_request_read)
          expect(@ability).to authorize(:assign, @role_role_assign_all)
        end
      end

      context 'and specifies no roles' do
        before :each do
          @permission_role_read_write = Permission.new(resource: Permission::ROLE,
                                                       actions: [
                                                         Permission::READ, Permission::WRITE, Permission::CREATE
                                                       ])
          @role_role_assign_none = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_read_write],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_assign_none
          @user1.save

          @ability = Ability.new @user1
        end

        it 'does not allow user to assign any of the roles' do
          expect(@ability).not_to authorize(:assign, @role_case_read)
          expect(@ability).not_to authorize(:assign, @role_incident_read)
          expect(@ability).not_to authorize(:assign, @role_tracing_request_read)
          expect(@ability).not_to authorize(:assign, @role_role_assign_none)
        end
      end

      context 'and user has MANAGE permission on ROLE' do
        before :each do
          @permission_role_manage = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
          @role_role_manage = create(
            :role,
            permissions: [@permission_user_read_write, @permission_role_manage],
            group_permission: Permission::GROUP
          )
          @user1.role = @role_role_manage
          @user1.save

          @ability = Ability.new @user1
        end

        it 'allows user to assign all of the roles' do
          expect(@ability).to authorize(:assign, @role_case_read)
          expect(@ability).to authorize(:assign, @role_incident_read)
          expect(@ability).to authorize(:assign, @role_tracing_request_read)
        end

        it 'does not allow user to assign its own role' do
          expect(@ability).not_to authorize(:assign, @role_role_manage)
        end
      end

      after do
        clean_data(User, Role)
      end
    end
  end

  describe 'Other resources' do
    it 'allows viewing and editing of Metadata resources if that permission is set along with "read" and "write"' do
      permission_metadata = Permission.new(
        resource: Permission::METADATA, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      role = create :role, permissions: [permission_metadata]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      [FormSection, Field, Location, Lookup, PrimeroModule, PrimeroProgram].each do |resource|
        expect(ability).to authorize(:read, resource)
        expect(ability).to authorize(:write, resource)
      end
    end

    it 'allows viewing and editing of System resources if that permission is set along with "read" and "write"' do
      permission_system = Permission.new(
        resource: Permission::SYSTEM, actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      role = create :role, permissions: [permission_system]
      @user1.role = role
      @user1.save

      ability = Ability.new @user1

      [ContactInformation].each do |resource|
        expect(ability).to authorize(:read, resource)
        expect(ability).to authorize(:write, resource)
      end
    end
  end

  describe 'Attachments' do
    let(:attachment_user) { create :user }

    let(:referred_user) { create :user }

    let(:preview_user) { create :user }

    let(:child_other) { create :child }

    let(:child_with_attachment) do
      child_with_attachment = Child.new_with_user(
        attachment_user,
        { name: 'Test', consent_for_services: true, disclosure_other_orgs: true, module_id: PrimeroModule::CP }
      )
      child_with_attachment.save! && child_with_attachment
    end

    let(:image_attachment_other) do
      Attachment.new(
        record: child_other, field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      )
    end

    let(:audio_attachment_other) do
      Attachment.new(
        record: child_other, field_name: Attachable::AUDIOS_FIELD_NAME, attachment_type: Attachment::AUDIO,
        file_name: 'sample.mp3', attachment: attachment_base64('sample.mp3')
      )
    end

    let(:document_attachment_other) do
      Attachment.new(
        record: child_other, field_name: Attachable::DOCUMENTS_FIELD_NAME, file_name: 'dummy.pdf',
        attachment_type: Attachment::DOCUMENT, attachment: attachment_base64('dummy.pdf')
      )
    end

    let(:image_attachment) do
      Attachment.new(
        record: child_with_attachment, field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      )
    end

    let(:audio_attachment) do
      Attachment.new(
        record: child_with_attachment, field_name: Attachable::AUDIOS_FIELD_NAME, attachment_type: Attachment::AUDIO,
        file_name: 'sample.mp3', attachment: attachment_base64('sample.mp3')
      )
    end

    let(:document_attachment) do
      Attachment.new(
        record: child_with_attachment, field_name: Attachable::DOCUMENTS_FIELD_NAME, file_name: 'dummy.pdf',
        attachment_type: Attachment::DOCUMENT, attachment: attachment_base64('dummy.pdf')
      )
    end

    let(:form_sections) do
      [
        FormSection.create!(
          unique_id: 'form1', name: 'Form 1', parent_form: 'case', form_group_id: 'form1', fields: [
            Field.new(name: Attachable::PHOTOS_FIELD_NAME, display_name: 'Photos', type: Field::PHOTO_UPLOAD_BOX),
            Field.new(name: Attachable::AUDIOS_FIELD_NAME, display_name: 'Recorded Audio',
                      type: Field::AUDIO_UPLOAD_BOX),
            Field.new(name: Attachable::DOCUMENTS_FIELD_NAME, display_name: 'Other Documents',
                      type: Field::DOCUMENT_UPLOAD_BOX)
          ]
        ),
        FormSection.create!(
          unique_id: 'form2', name: 'Form 2', parent_form: 'case', form_group_id: 'form2', fields: [
            Field.new(name: Attachable::PHOTOS_FIELD_NAME, display_name: 'Photos', type: Field::PHOTO_UPLOAD_BOX)
          ]
        ),
        FormSection.create!(
          unique_id: 'form3', name: 'Form 3', parent_form: 'case', form_group_id: 'form3', fields: [
            Field.new(name: 'current_photos', display_name: 'Current Photos', type: Field::PHOTO_UPLOAD_BOX)
          ]
        )
      ]
    end

    before { form_sections }

    context 'when a user can access a record' do
      context 'and read access is permitted' do
        before do
          clean_data(PrimeroModule)
          permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
          primero_module = PrimeroModule.new(
            unique_id: PrimeroModule::CP, name: 'Primero Module CP', associated_record_types: %w[case]
          )
          role = Role.new_with_properties(
            name: 'read_attachment', permissions: [permission], form_section_read_write: { form1: 'r' }
          )
          role.save!
          primero_module.form_sections = [form_sections.first]
          primero_module.roles = [role]
          primero_module.save!
          attachment_user.role = role
          attachment_user.save!
        end

        it 'allows viewing attachments' do
          ability = Ability.new attachment_user
          expect(ability).to authorize(:read, image_attachment)
          expect(ability).to authorize(:read, audio_attachment)
          expect(ability).to authorize(:read, document_attachment)
        end

        it 'does not allow deleting attachments' do
          ability = Ability.new attachment_user
          expect(ability).not_to authorize(:destroy, image_attachment)
          expect(ability).not_to authorize(:destroy, audio_attachment)
          expect(ability).not_to authorize(:destroy, document_attachment)
        end
      end

      context 'and write access is permitted' do
        before do
          clean_data(PrimeroModule)
          primero_module = PrimeroModule.new(
            unique_id: PrimeroModule::CP, name: 'Primero Module CP', associated_record_types: %w[case]
          )
          permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
          role = Role.new_with_properties(
            name: 'write_attachment', permissions: [permission], form_section_read_write: { form1: 'rw' }
          )
          role.save!
          primero_module.form_sections = [form_sections.first]
          primero_module.roles = [role]
          primero_module.save!
          attachment_user.role = role
          attachment_user.save!
        end

        it 'allows viewing attachments if he has write access' do
          ability = Ability.new attachment_user
          expect(ability).to authorize(:read, image_attachment)
          expect(ability).to authorize(:read, audio_attachment)
          expect(ability).to authorize(:read, document_attachment)
        end

        it 'allows deleting attachments if he has write access' do
          ability = Ability.new attachment_user
          expect(ability).to authorize(:destroy, image_attachment)
          expect(ability).to authorize(:destroy, audio_attachment)
          expect(ability).to authorize(:destroy, document_attachment)
        end
      end

      context 'and can view audio for potential matches' do
        before do
          clean_data(PrimeroModule)
          primero_module = PrimeroModule.new(
            unique_id: PrimeroModule::CP, name: 'Primero Module CP', associated_record_types: %w[case]
          )
          permission = Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_AUDIO])
          role = Role.new_with_properties(
            name: 'read_audio_potential_match', permissions: [permission], form_section_read_write: {}
          )
          role.save!
          primero_module.form_sections = [form_sections.first]
          primero_module.roles = [role]
          primero_module.save!
          attachment_user.role = role
          attachment_user.save!
        end

        it 'allows viewing audio attachments' do
          ability = Ability.new attachment_user
          expect(ability).to authorize(:read, audio_attachment)
        end

        it 'does not allow viewing image or document attachments' do
          ability = Ability.new attachment_user
          expect(ability).not_to authorize(:read, image_attachment)
          expect(ability).not_to authorize(:read, document_attachment)
        end

        it 'does not allow deleting attachments' do
          ability = Ability.new attachment_user
          expect(ability).not_to authorize(:destroy, image_attachment)
          expect(ability).not_to authorize(:destroy, audio_attachment)
          expect(ability).not_to authorize(:destroy, document_attachment)
        end
      end

      context 'and can view images for potential matches' do
        before do
          permission = Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_PHOTO])
          role = Role.new_with_properties(
            name: 'read_photo_potential_match', permissions: [permission], form_section_read_write: {}
          )
          role.save!
          attachment_user.role = role
          attachment_user.save!
        end

        it 'allows viewing image attachments' do
          ability = Ability.new attachment_user
          expect(ability).to authorize(:read, image_attachment)
        end

        it 'does not allow viewing audio or document attachments' do
          ability = Ability.new attachment_user
          expect(ability).not_to authorize(:read, audio_attachment)
          expect(ability).not_to authorize(:read, document_attachment)
        end

        it 'does not allow deleting attachments' do
          ability = Ability.new attachment_user
          expect(ability).not_to authorize(:destroy, image_attachment)
          expect(ability).not_to authorize(:destroy, audio_attachment)
          expect(ability).not_to authorize(:destroy, document_attachment)
        end
      end

      context 'and is a referred record' do
        context 'and the authorized role permits read access' do
          before do
            clean_data(PrimeroModule)
            primero_module = PrimeroModule.new(
              unique_id: PrimeroModule::CP, name: 'Primero Module CP', associated_record_types: %w[case]
            )
            permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
            role = Role.new_with_properties(
              unique_id: 'referred_read_attachment', name: 'referred_read_attachment', permissions: [permission],
              form_section_read_write: { form1: 'r' }
            )
            primero_module.form_sections = [form_sections.first]
            primero_module.roles = [role]
            primero_module.save!
            role.save!
            Referral.create!(
              transitioned_by_user: attachment_user, transitioned_to_user: referred_user, record: child_with_attachment,
              authorized_role_unique_id: 'referred_read_attachment'
            )
          end

          it 'allows viewing attachments' do
            ability = Ability.new referred_user
            expect(ability).to authorize(:read, image_attachment)
            expect(ability).to authorize(:read, audio_attachment)
            expect(ability).to authorize(:read, document_attachment)
          end

          it 'does not allow deleting attachments' do
            ability = Ability.new referred_user
            expect(ability).not_to authorize(:destroy, image_attachment)
            expect(ability).not_to authorize(:destroy, audio_attachment)
            expect(ability).not_to authorize(:destroy, document_attachment)
          end
        end

        context 'and the authorized role permits write access' do
          before do
            clean_data(PrimeroModule)
            primero_module = PrimeroModule.new(
              unique_id: PrimeroModule::CP, name: 'Primero Module CP', associated_record_types: %w[case]
            )
            permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
            role = Role.new_with_properties(
              unique_id: 'referred_write_attachment', name: 'referred_write_attachment', permissions: [permission],
              form_section_read_write: { form1: 'rw' }
            )
            role.save!
            primero_module.form_sections = [form_sections.first]
            primero_module.roles = [role]
            primero_module.save!
            Referral.create!(
              transitioned_by_user: attachment_user, transitioned_to_user: referred_user, record: child_with_attachment,
              authorized_role_unique_id: 'referred_write_attachment'
            )
          end

          it 'allows viewing attachments if he has write access' do
            ability = Ability.new referred_user
            expect(ability).to authorize(:read, image_attachment)
            expect(ability).to authorize(:read, audio_attachment)
            expect(ability).to authorize(:read, document_attachment)
          end

          it 'allows deleting attachments if he has write access' do
            ability = Ability.new referred_user
            expect(ability).to authorize(:destroy, image_attachment)
            expect(ability).to authorize(:destroy, audio_attachment)
            expect(ability).to authorize(:destroy, document_attachment)
          end
        end
      end
    end

    context 'when a user does not have access to a record' do
      context 'and a user can search records owned by others' do
        context 'and can preview a record' do
          context 'and has access to attachment fields' do
            before do
              permission = Permission.new(resource: Permission::CASE, actions:
                [
                  Permission::DISPLAY_VIEW_PAGE, Permission::SEARCH_OWNED_BY_OTHERS
                ])
              role = Role.new_with_properties(
                unique_id: 'preview_access_attachment', name: 'preview_access_attachment', permissions: [permission],
                form_section_read_write: { form1: 'rw' }
              )
              role.save!
              preview_user.role = role
              preview_user.save!
            end

            it 'allows viewing attached images/audios' do
              ability = Ability.new preview_user

              expect(ability).to authorize(:read, image_attachment_other)
              expect(ability).to authorize(:read, audio_attachment_other)
            end

            it 'does not allow viewing attached documents' do
              ability = Ability.new preview_user
              expect(ability).not_to authorize(:read, document_attachment_other)
            end

            it 'does not allow deleting attachments' do
              ability = Ability.new preview_user
              expect(ability).not_to authorize(:destroy, image_attachment_other)
              expect(ability).not_to authorize(:destroy, audio_attachment_other)
              expect(ability).not_to authorize(:destroy, document_attachment_other)
            end
          end

          context 'and does not have access to attachment fields' do
            before do
              permission = Permission.new(resource: Permission::CASE, actions:
                [
                  Permission::DISPLAY_VIEW_PAGE, Permission::SEARCH_OWNED_BY_OTHERS
                ])
              role = Role.new_with_properties(
                unique_id: 'preview_record', name: 'preview_record', permissions: [permission]
              )
              role.save!
              preview_user.role = role
              preview_user.save!
            end

            it 'allows viewing image/audio attachments' do
              ability = Ability.new preview_user
              expect(ability).to authorize(:read, image_attachment_other)
              expect(ability).to authorize(:read, audio_attachment_other)
            end

            it 'does not allow viewing document attachment' do
              ability = Ability.new preview_user
              expect(ability).not_to authorize(:read, document_attachment_other)
            end

            it 'does not allow deleting attachments' do
              ability = Ability.new preview_user
              expect(ability).not_to authorize(:destroy, image_attachment_other)
              expect(ability).not_to authorize(:destroy, audio_attachment_other)
              expect(ability).not_to authorize(:destroy, document_attachment_other)
            end
          end
        end

        context 'and can view a photo from the list view' do
          before do
            permission = Permission.new(
              resource: Permission::CASE, actions: [Permission::SEARCH_OWNED_BY_OTHERS, Permission::VIEW_PHOTO]
            )
            role = Role.new_with_properties(
              unique_id: 'view_photo_attachment', name: 'view_photo_attachment', permissions: [permission]
            )
            role.save!
            attachment_user.role = role
            attachment_user.save!
          end

          it 'allows viewing attached images' do
            ability = Ability.new attachment_user
            expect(ability).to authorize(:read, image_attachment_other)
          end

          it 'does not allow viewing attached audios/documents' do
            ability = Ability.new attachment_user
            expect(ability).not_to authorize(:read, audio_attachment_other)
            expect(ability).not_to authorize(:read, document_attachment_other)
          end

          it 'does not allow deleting attachments' do
            ability = Ability.new attachment_user
            expect(ability).not_to authorize(:destroy, image_attachment_other)
            expect(ability).not_to authorize(:destroy, audio_attachment_other)
            expect(ability).not_to authorize(:destroy, document_attachment_other)
          end
        end
      end
    end

    context 'when read/write access is not permitted' do
      before do
        permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        role = Role.new_with_properties(
          unique_id: 'view_photo_attachment', name: 'view_photo_attachment', permissions: [permission]
        )
        role.save!
        attachment_user.role = role
        attachment_user.save!
      end

      it 'does not allow viewing attachments' do
        ability = Ability.new attachment_user
        expect(ability).not_to authorize(:read, image_attachment)
        expect(ability).not_to authorize(:read, audio_attachment)
        expect(ability).not_to authorize(:read, document_attachment)
      end

      it 'does not allow deleting attachments' do
        ability = Ability.new attachment_user
        expect(ability).not_to authorize(:destroy, image_attachment)
        expect(ability).not_to authorize(:destroy, audio_attachment)
        expect(ability).not_to authorize(:destroy, document_attachment)
      end
    end
  end
end
