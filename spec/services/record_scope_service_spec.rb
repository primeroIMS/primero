# frozen_string_literal: true

require 'rails_helper'

describe RecordScopeService do
  before do
    clean_data(PrimeroProgram, PrimeroModule, Role, Agency, UserGroup, User, Child)

    @program = PrimeroProgram.create!(unique_id: 'primeroprogram-primero', name: 'Primero',
                                      description: 'Default Primero Program')

    @cp = PrimeroModule.create!(unique_id: PrimeroModule::CP, name: 'CP', description: 'Child Protection',
                                associated_record_types: %w[case tracing_request incident], primero_program: @program)

    @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
    @group1 = UserGroup.create!(name: 'group 1')
    @group2 = UserGroup.create!(name: 'group 2')
    @group3 = UserGroup.create!(name: 'group 3')
    @role1 = Role.create!(name: 'role1', unique_id: 'role1', modules: [@cp],
                          group_permission: Permission::GROUP,
                          permissions: [Permission.new(resource: Permission::CASE,
                                                       actions: [Permission::MANAGE])])
    @role2 = Role.create!(name: 'role2', unique_id: 'role2', group_permission: Permission::AGENCY,
                          modules: [@cp],
                          permissions: [Permission.new(resource: Permission::CASE,
                                                       actions: [Permission::MANAGE])])
    @role3 = Role.create!(name: 'role3', unique_id: 'role3', group_permission: Permission::USER,
                          modules: [@cp],
                          permissions: [Permission.new(resource: Permission::CASE,
                                                       actions: [Permission::MANAGE])])
    @role4 = Role.create!(name: 'role4', unique_id: 'role4', group_permission: Permission::ALL,
                          modules: [@cp],
                          permissions: [Permission.new(resource: Permission::CASE,
                                                       actions: [Permission::MANAGE])])
    @role5 = Role.create!(name: 'role5', unique_id: 'role5',
                          modules: [@cp],
                          permissions: [Permission.new(resource: Permission::CASE,
                                                       actions: [Permission::MANAGE])])
    @user1 = User.create!(full_name: 'Admin User', user_name: 'user1', password: 'a12345678',
                          password_confirmation: 'a12345678', email: 'user1@localhost.com',
                          agency_id: @agency1.id, role: @role1, user_groups: [@group1, @group2])
    @user2 = User.create!(full_name: 'User 2', user_name: 'user2', password: 'a12345678',
                          password_confirmation: 'a12345678', email: 'user2@localhost.com',
                          agency_id: @agency1.id, role: @role2, user_groups: [@group1])
    @user3 = User.create!(full_name: 'User 3', user_name: 'user3', password: 'a12345678',
                          password_confirmation: 'a12345678', email: 'user3@localhost.com',
                          agency_id: @agency2.id, role: @role2, user_groups: [@group3])
    @user4 = User.create!(full_name: 'User 4', user_name: 'user4', password: 'a12345678',
                          password_confirmation: 'a12345678', email: 'user4@localhost.com',
                          agency_id: @agency2.id, role: @role4, user_groups: [@group1, @group2, @group3])
    @user5 = User.create!(full_name: 'User 5', user_name: 'user5', password: 'a12345678',
                          password_confirmation: 'a12345678', email: 'user5@localhost.com',
                          agency_id: @agency2.id, role: @role5, user_groups: [@group1, @group2, @group3])

    @child1 = Child.new_with_user(@user1, name: 'Child 1',
                                          owned_by_groups: [@group1.unique_id],
                                          owned_by_agency_id: @agency1.id)
    @child1.save!

    @child2 = Child.new_with_user(@user2, name: 'Child 2',
                                          owned_by_groups: [@group2.unique_id],
                                          owned_by_agency_id: @agency1.id)
    @child2.save!

    @child3 = Child.new_with_user(@user3, name: 'Child 3',
                                          owned_by_groups: [@group3.unique_id],
                                          owned_by_agency_id: @agency2.id)
    @child3.save!
  end

  describe '.scope_with_user' do
    it 'when user has group permission' do
      expect(RecordScopeService.scope_with_user(Child, @user1)).to match_array [@child1, @child2]
    end

    it 'when user has agency permission' do
      expect(RecordScopeService.scope_with_user(Child, @user2)).to match_array [@child1, @child2]
    end

    it 'when user has only user permission' do
      expect(RecordScopeService.scope_with_user(Child, @user3)).to match_array [@child3]
    end

    it 'when user has all permission' do
      expect(RecordScopeService.scope_with_user(Child, @user4)).to match_array [@child1, @child2, @child3]
    end

    it 'when user has all permission' do
      expect(RecordScopeService.scope_with_user(Child, @user5)).to be_empty
    end
  end
end
