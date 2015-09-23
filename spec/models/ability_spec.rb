require 'spec_helper'

describe Ability do

  CRUD = [:index, :create, :view, :edit, :update, :destroy]

  before do
    @user1 = create :user
    @user2 = create :user
    @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @permission_case_read_write = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
  end

  describe "Records" do

    before :each do
      Child.any_instance.stub(:field_definitions).and_return([])
    end

    it "allows an owned record to be read given a read permission" do
      role = create :role, permissions_list: [@permission_case_read]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Child)
      expect(ability).to authorize(:read, case1)
    end

    it "doesn't allow an owned record to be written to given only a read permission" do
      role = create :role, permissions_list: [@permission_case_read]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:write, Child)
      expect(ability).not_to authorize(:write, case1)
    end

    it "allows a non-owned but associated record to be read" do
      role = create :role, permissions_list: [@permission_case_read]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user2.user_name, assigned_user_names: [@user1.user_name]

      ability = Ability.new @user1

      expect(ability).to authorize(:read, Child)
      expect(ability).to authorize(:read, case1)

    end

    it "allows an owned record to be written to given a write permission" do
      role = create :role, permissions_list: [@permission_case_read_write]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:write, Child)
      expect(ability).to authorize(:write, case1)
    end

    it "allows an owned record to be flagged given a flag permission" do
      permission_flag = Permission.new(resource: Permission::CASE, actions: [Permission::FLAG])
      role = create :role, permissions_list: [permission_flag]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:flag, case1)
    end

    it "allows an owned record to be reassigned" do
      permission_assign = Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN])
      role = create :role, permissions_list: [permission_assign]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:assign, case1)
    end

    it "doesn't allow a record to be written to even if the record can be flagged and assigned" do
      permission_flag_assign = Permission.new(resource: Permission::CASE, actions: [Permission::FLAG, Permission::ASSIGN])
      role = create :role, permissions_list: [permission_flag_assign]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user1.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:write, Child)
      expect(ability).not_to authorize(:write, case1)
    end

    it "doesn't allow a record owned by someone else to be managed by a user with no specified scope" do
      role = create :role, permissions_list: [@permission_case_read_write]
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, case1)
      expect(ability).not_to authorize(:write, case1)
    end

    it "doesn't allow a record owned by someone else to be managed by a user with a 'self' scope" do
      role = create :role, permissions_list: [@permission_case_read_write], group_permission: Permission::SELF
      @user1.role_ids = [role.id]
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, case1)
      expect(ability).not_to authorize(:write, case1)
    end

    it "allows a record owned by a fellow group member to be managed by a user with 'group' scope" do
      role = create :role, permissions_list: [@permission_case_read_write], group_permission: Permission::GROUP
      @user1.role_ids = [role.id]
      @user1.user_group_ids = ['test_group']
      @user1.save
      @user2.user_group_ids = ['test_group']
      @user2.save
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, case1)
      expect(ability).to authorize(:write, case1)
    end

    it "allows a record owned by someone else to be read by a user with full 'all' scope" do
      role = create :role, permissions_list: [@permission_case_read_write], group_permission: Permission::ALL
      @user1.role_ids = [role.id]
      @user1.user_group_ids = ['test_group']
      @user1.save
      @user2.user_group_ids = ['other_test_group']
      @user2.save
      case1 = create :child, owned_by: @user2.user_name

      ability = Ability.new @user1

      expect(ability).to authorize(:read, case1)
      expect(ability).to authorize(:write, case1)
    end

  end

  describe "Users" do
    before :each do
      @permission_user_read = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE])
    end

    it "allows a user with read permissions to manage their own user" do
      role = create :role, permissions_list: [@permission_user_read]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, @user1)
      expect(ability).to authorize(:write, @user1)
    end

    it "allows a user with no user permissions to manage their own user" do
      role = create :role, permissions_list: [@permission_case_read]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      expect(ability).to authorize(:read, @user1)
      expect(ability).to authorize(:write, @user1)
    end

    it "doesn't allow a user with no explicit 'user' permission to manage another user" do
      role = create :role, permissions_list: [@permission_case_read]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      expect(ability).not_to authorize(:read, @user2)
      expect(ability).not_to authorize(:write, @user2)
    end

    it "doesn't allow a user with no specified scope to edit another user" do
      role = create :role, permissions_list: [@permission_user_read]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      expect(ability).to_not authorize(:read, @user2)
      expect(ability).to_not authorize(:write, @user2)
    end

    it "allows a user with group scope to only edit another user in that group" do
      role = create :role, permissions_list: [@permission_user_read_write], group_permission: Permission::GROUP
      @user1.role_ids = [role.id]
      @user1.user_group_ids = ['test_group']
      @user1.save
      @user2.user_group_ids = ['test_group']
      @user2.save
      user3 = create :user, user_group_ids: ['other_test_group']

      ability = Ability.new @user1

      expect(ability).to authorize(:read, @user2)
      expect(ability).to authorize(:write, @user2)
      expect(ability).to_not authorize(:read, user3)
      expect(ability).to_not authorize(:write, user3)
    end

    it "allows viewing and editing of Groups, Roles, and Agencies if the 'user' permission is set along with 'read' and 'write'" do
      role = create :role, permissions_list: [@permission_user_read_write]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      [UserGroup, Role, Agency].each do |resource|
        expect(ability).to authorize(:read, resource)
        expect(ability).to authorize(:write, resource)
      end
    end

  end

  describe "Other resources" do
    it "allows viewing and editing of Metadata resources if that permission is set along with 'read' and 'write'" do
      permission_metadata = Permission.new(resource: Permission::METADATA, actions: [Permission::READ, Permission::WRITE])
      role = create :role, permissions_list: [permission_metadata]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      [FormSection, Field, Location, Lookup, PrimeroModule, PrimeroProgram].each do |resource|
        expect(ability).to authorize(:read, resource)
        expect(ability).to authorize(:write, resource)
      end
    end

    it "allows viewing and editing of System resources if that permission is set along with 'read' and 'write'" do
      permission_system = Permission.new(resource: Permission::SYSTEM, actions: [Permission::READ, Permission::WRITE])
      role = create :role, permissions_list: [permission_system]
      @user1.role_ids = [role.id]
      @user1.save

      ability = Ability.new @user1

      [ContactInformation, Device, Replication, SystemUsers].each do |resource|
        expect(ability).to authorize(:read, resource)
        expect(ability).to authorize(:write, resource)
      end
    end

  end

end
