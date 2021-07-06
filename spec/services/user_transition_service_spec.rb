# frozen_string_literal: true

require 'rails_helper'

describe UserTransitionService do
  describe 'assign' do
    before :each do
      [UserGroup, User, Agency, Role, PrimeroModule, PrimeroProgram].each(&:destroy_all)
      @program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: 'Default Primero Program'
      )

      @form1 = FormSection.create!(name: 'form1')

      @cp = PrimeroModule.create!(
        unique_id: 'primeromodule-cp',
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form1]
      )

      @group1 = UserGroup.create!(name: 'Group1')
      @group2 = UserGroup.create!(name: 'Group2')
      @group3 = UserGroup.create!(name: 'Group3')
      @agency1 = Agency.create!(name: 'Agency1', agency_code: 'A1')
      @agency2 = Agency.create!(name: 'Agency2', agency_code: 'A2')
      @user1 = User.new(user_name: 'user1', user_groups: [@group1, @group2], agency: @agency1)
      @user2 = User.new(user_name: 'user2', user_groups: [@group1], agency: @agency1)
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', user_groups: [@group2], agency: @agency1)
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', user_groups: [@group3], agency: @agency2)
      @user4.save(validate: false)
    end

    it 'returns all users for a user with the :assign permission' do
      permission = Permission.new(
        resource: Permission::CASE, actions: [Permission::ASSIGN]
      )
      role = Role.new(permissions: [permission], primero_modules: [@cp])
      role.save(validate: false)
      @user1.role = role
      @user1.save(validate: false)

      users = UserTransitionService.assign(@user1, Child, @cp.unique_id).transition_users

      expect(users.map(&:user_name)).to match_array(%w[user2 user3 user4])
    end

    it 'shoreturnsws only users in the agency for a user with the :assign_within_agency permission' do
      permission = Permission.new(
        resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_AGENCY]
      )
      role = Role.new(permissions: [permission], primero_modules: [@cp])
      role.save(validate: false)
      @user1.role = role
      @user1.save(validate: false)

      users = UserTransitionService.assign(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3])
    end

    it 'returns only users in the user groups for a user with the :assign_within_user_group permission' do
      permission = Permission.new(
        resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_USER_GROUP]
      )
      role = Role.new(permissions: [permission], primero_modules: [@cp])
      role.save(validate: false)
      @user1.role = role
      @user1.save(validate: false)

      users = UserTransitionService.assign(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3])
    end
  end

  describe 'referral' do
    before :each do
      @program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: 'Default Primero Program'
      )

      @form1 = FormSection.create!(name: 'form1')

      @cp = PrimeroModule.create!(
        unique_id: 'primeromodule-cp',
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form1]
      )

      @other = PrimeroModule.create!(
        unique_id: 'primeromodule-other',
        name: 'OTHER',
        description: 'Other Module',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form1]
      )

      permission_receive = Permission.new(
        resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL]
      )
      permission_receive_different_module = Permission.new(
        resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE]
      )
      role_receive = Role.new(permissions: [permission_receive], primero_modules: [@cp])
      role_receive.save(validate: false)

      role_receive_other_module = Role.new(permissions: [permission_receive], primero_modules: [@other])
      role_receive_other_module.save(validate: false)

      role_receive_different_module = Role.new(permissions: [permission_receive_different_module], primero_modules: [@other])
      role_receive_different_module.save(validate: false)

      permission_cannot = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role_cannot = Role.new(permissions: [permission_cannot], primero_modules: [@cp])
      role_cannot.save(validate: false)
      agency = Agency.new(unique_id: 'fake-agency', agency_code: 'fkagency')
      agency.save(validate: false)

      Location.create(
        placename_en: 'Country',
        location_code: 'CNT',
        type: 'country',
        admin_level: 0,
        hierarchy_path: 'CNT'
      )
      Location.create(
        placename_en: 'State',
        location_code: 'ST',
        type: 'state', admin_level: 1, hierarchy_path: 'CNT.ST'
      )
      Location.create(
        placename_en: 'City',
        location_code: 'CT',
        type: 'city',
        admin_level: 2,
        hierarchy_path: 'CNT.ST.CT'
      )

      SystemSettings.stub(:current).and_return(
        SystemSettings.new(reporting_location_config: { admin_level: 1 })
      )

      @user1 = User.new(user_name: 'user1', role: role_receive, agency: agency)
      @user1.save(validate: false)
      @user2 = User.new(user_name: 'user2', role: role_receive, services: %w[safehouse_service], agency: agency,  location: 'CT')
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', role: role_receive, agency: agency, location: 'CT')
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', role: role_cannot, agency: agency)
      @user4.save(validate: false)
      @user5 = User.new(user_name: 'user5', role: role_receive_other_module, agency: agency)
      @user5.save(validate: false)
      @user6 = User.new(user_name: 'user6', role: role_receive_different_module, agency: agency)
      @user6.save(validate: false)
    end

    it 'returns all users that can be referred to based on permission and module CP' do
      users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3 user6])
    end

    it 'returns all users that can be referred to based on permission and module OTHER' do
      users = UserTransitionService.referral(@user1, Child, @other.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user5 user6])
    end

    it 'filters users based on service' do
      users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users(
        'service' => 'safehouse_service'
      )
      expect(users.map(&:user_name)).to match_array(%w[user2])
    end

    it 'filters users based on the reporting location' do
      users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users(
        'location' => 'ST'
      )
      expect(users.map(&:user_name)).to match_array(%w[user2 user3])
    end
  end

  describe 'transfer' do
    before :each do
      @program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: 'Default Primero Program'
      )

      @form1 = FormSection.create!(name: 'form1')

      @cp = PrimeroModule.create!(
        unique_id: 'primeromodule-cp',
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form1]
      )

      permission_receive = Permission.new(
        resource: Permission::CASE, actions: [Permission::RECEIVE_TRANSFER]
      )
      role_receive = Role.new(permissions: [permission_receive], primero_modules: [@cp])
      role_receive.save(validate: false)

      permission_cannot = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role_cannot = Role.new(permissions: [permission_cannot], primero_modules: [@cp])
      role_cannot.save(validate: false)

      @user1 = User.new(user_name: 'user1', role: role_receive)
      @user1.save(validate: false)
      @user2 = User.new(user_name: 'user2', role: role_receive)
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', role: role_receive)
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', role: role_cannot)
      @user4.save(validate: false)
    end

    it 'returns all users that can be referred to based on permission' do
      users = UserTransitionService.transfer(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3])
    end
  end

  after :each do
    [UserGroup, User, Agency, Role, PrimeroModule, PrimeroProgram].each(&:destroy_all)
  end
end
