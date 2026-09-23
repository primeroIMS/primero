# frozen_string_literal: true

require 'rails_helper'

describe UserTransitionService do
  before do
    clean_data(UserGroup, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, Location)

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

    @role = Role.new(
      primero_modules: [@cp],
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::RECEIVE_REFERRAL, Permission::REFERRAL,
            Permission::RECEIVE_TRANSFER, Permission::TRANSFER,
            Permission::ASSIGN, Permission::READ
          ]
        )
      ]
    )
    @role.save(validate: false)

    @role_maintenance = Role.new(
      primero_modules: [@cp],
      user_category: Role::CATEGORY_MAINTENANCE,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::RECEIVE_REFERRAL, Permission::REFERRAL,
            Permission::RECEIVE_TRANSFER, Permission::TRANSFER,
            Permission::ASSIGN, Permission::READ
          ]
        )
      ]
    )
    @role_maintenance.save(validate: false)

    @role_system = Role.new(
      primero_modules: [@cp],
      user_category: Role::CATEGORY_SYSTEM,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::RECEIVE_REFERRAL, Permission::REFERRAL,
            Permission::RECEIVE_TRANSFER, Permission::TRANSFER,
            Permission::ASSIGN, Permission::READ
          ]
        )
      ]
    )
    @role_system.save(validate: false)

    @other = PrimeroModule.create!(
      unique_id: 'primeromodule-other',
      name: 'OTHER',
      description: 'Other Module',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [@form1]
    )
  end
  describe 'assign' do
    before do
      @group1 = UserGroup.create!(name: 'Group1')
      @group2 = UserGroup.create!(name: 'Group2')
      @group3 = UserGroup.create!(name: 'Group3')
      @agency1 = Agency.create!(name: 'Agency1', agency_code: 'A1')
      @agency2 = Agency.create!(name: 'Agency2', agency_code: 'A2')
      @user1 = User.new(user_name: 'user1', user_groups: [@group1, @group2], agency: @agency1)
      @user2 = User.new(user_name: 'user2', user_groups: [@group1], agency: @agency1, role: @role)
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', user_groups: [@group2], agency: @agency1, role: @role)
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', user_groups: [@group3], agency: @agency2, role: @role)
      @user4.save(validate: false)
      @user6 = User.new(user_name: 'user6', user_groups: [@group3], agency: @agency2)
      @user6.save(validate: false)
      @user7 = User.new(user_name: 'user7', user_groups: [@group3], agency: @agency2, role: @role_system)
      @user7.save(validate: false)
      @user8 = User.new(user_name: 'user8', user_groups: [@group3], agency: @agency2, role: @role_maintenance)
      @user8.save(validate: false)
      @user9 = User.new(user_name: 'user9', user_groups: [@group3], agency: @agency2, role: @role, unverified: true)
      @user9.save(validate: false)

      role = create(
        :role,
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE]
          )
        ]
      )

      create(
        :user,
        user_name: 'user5',
        email: 'test_user_1@localhost.com',
        agency: @agency1,
        disabled: true,
        role:
      )
    end

    it 'returns verified users for a user with the :assign permission excluding system,maintenance categories' do
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

    it 'returns verified users in the agency for a user with the :assign_within_agency permission' do
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

    it 'returns verified users in the user groups for a user with the :assign_within_user_group permission' do
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
    before do
      permission_receive = Permission.new(
        resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL]
      )
      permission_receive_different_module = Permission.new(
        resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE]
      )
      @role_receive = Role.new(permissions: [permission_receive], primero_modules: [@cp])
      @role_receive.save(validate: false)

      role_receive_other_module = Role.new(permissions: [permission_receive], primero_modules: [@other])
      role_receive_other_module.save(validate: false)

      role_receive_different_module = Role.new(permissions: [permission_receive_different_module],
                                               primero_modules: [@other])
      role_receive_different_module.save(validate: false)

      permission_cannot = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role_cannot = Role.new(permissions: [permission_cannot], primero_modules: [@cp])
      role_cannot.save(validate: false)
      agency = Agency.new(unique_id: 'fake-agency', agency_code: 'fkagency')
      agency.save(validate: false)
      agency2 = Agency.new(unique_id: 'fake-agency-2', agency_code: 'fkagency-2')
      agency2.save(validate: false)

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

      @other_group = UserGroup.create!(name: 'Other group')
      @shared_group = UserGroup.create!(name: 'Shared group')
      @user1 = User.new(user_name: 'user1', role: @role_receive, agency:)
      @user1.user_groups = [@shared_group]
      @user1.save(validate: false)
      @user2 = User.new(user_name: 'user2', role: @role_receive, services: %w[safehouse_service], agency:,
                        location: 'CT')
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', role: @role_receive, agency:, location: 'CT')
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', role: role_cannot, agency:)
      @user4.save(validate: false)
      @user5 = User.new(user_name: 'user5', role: role_receive_other_module, agency:)
      @user5.save(validate: false)
      @user6 = User.new(user_name: 'user6', role: role_receive_different_module, agency:)
      @user6.save(validate: false)
      @user7 = User.new(user_name: 'user7', role: @role_receive, agency: agency2)
      @user7.save(validate: false)
      @user8 = User.new(user_name: 'user8', role: @role_receive, agency: agency2)
      @user8.save(validate: false)
      @user9 = User.new(user_name: 'user9', agency: agency2, role: @role_system)
      @user9.save(validate: false)
      @user10 = User.new(user_name: 'user10', agency: agency2, role: @role_maintenance)
      @user10.save(validate: false)
      @user11 = User.new(user_name: 'user11', role: @role_receive, agency: agency2, unverified: true)
      @user11.save(validate: false)
    end

    it 'returns verified users to refer based on permission and module excluding system,maintenance categories' do
      users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3 user6 user7 user8])
    end

    it 'returns verified users to refer to based on permission and module OTHER' do
      users = UserTransitionService.referral(@user1, Child, @other.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user5 user6])
    end

    context 'when receiver has RECEIVE_REFERRAL and RECEIVE_REFERRAL_WITHIN_USER_GROUP' do
      before do
        role = Role.new(
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::RECEIVE_REFERRAL, Permission::RECEIVE_REFERRAL_WITHIN_USER_GROUP]
            )
          ],
          primero_modules: [@cp]
        )
        role.save(validate: false)

        @shared_group_user = User.new(user_name: 'shared-group-user', role:, user_groups: [@shared_group])
        @shared_group_user.save(validate: false)

        @within_group_user = User.new(
          user_name: 'within-group-user', role: @role_receive, user_groups: [@shared_group]
        )
        @within_group_user.save(validate: false)

        @other_group_user = User.new(user_name: 'other-group-user', role:, user_groups: [@other_group])
        @other_group_user.save(validate: false)
      end

      it 'returns users if they are in the same groups' do
        users = UserTransitionService.referral(@within_group_user, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user1 user2 user3 user6 user7 user8 shared-group-user])
      end

      it 'does not return users if they are in different modules' do
        users = UserTransitionService.referral(@within_group_user, Child, @other.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user5 user6])
      end
    end

    context 'when receiver has RECEIVE_REFERRAL_WITHIN_USER_GROUP and RECEIVE_REFERRAL_DIFFERENT_MODULE' do
      before do
        role = Role.new(
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::RECEIVE_REFERRAL_WITHIN_USER_GROUP, Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE]
            )
          ],
          primero_modules: [@other]
        )
        role.save(validate: false)

        @shared_group_user = User.new(user_name: 'shared-group-user', role:, user_groups: [@shared_group])
        @shared_group_user.save(validate: false)

        @other_group_user = User.new(user_name: 'other-group-user', role: @role_receive, user_groups: [@other_group])
        @other_group_user.save(validate: false)
      end

      it 'returns users when the referrer shares their user group even if they are in different modules' do
        users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(
          %w[user2 user3 user6 user7 user8 shared-group-user other-group-user]
        )
      end

      it 'does not return users when the referrer is outside their user group' do
        users = UserTransitionService.referral(@other_group_user, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user1 user2 user3 user6 user7 user8])
      end
    end

    context 'when receiver has RECEIVE_REFERRAL_WITHIN_USER_GROUP' do
      before do
        role = Role.new(
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL_WITHIN_USER_GROUP])
          ],
          primero_modules: [@cp]
        )
        role.save(validate: false)
        @without_receive_user = User.new(user_name: 'without-receive-user', role:, user_groups: [@shared_group])
        @without_receive_user.save(validate: false)
      end

      it 'does not returns users if receiver does not have the receive_referral permission' do
        users = UserTransitionService.referral(@user1, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user2 user3 user6 user7 user8])
      end
    end

    context 'when sender has REFERRAL and REFERRAL_WITHIN_USER_GROUP permissions' do
      before do
        sender_role = Role.new(
          permissions: [
            Permission.new(
              resource: Permission::CASE, actions: [Permission::REFERRAL, Permission::REFERRAL_WITHIN_USER_GROUP]
            )
          ],
          primero_modules: [@cp]
        )
        sender_role.save(validate: false)

        recipient_role = Role.new(
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::RECEIVE_REFERRAL, Permission::RECEIVE_REFERRAL_WITHIN_USER_GROUP]
            )
          ],
          primero_modules: [@cp]
        )
        recipient_role.save(validate: false)

        @sender = User.new(user_name: 'sender-within-group', role: sender_role, user_groups: [@shared_group])
        @sender.save(validate: false)

        recipient_within_group = User.new(
          user_name: 'recipient-within-group', role: recipient_role, user_groups: [@shared_group]
        )
        recipient_within_group.save(validate: false)

        recipient_within_group_other_group = User.new(
          user_name: 'recipient-within-group-other-group', role: recipient_role, user_groups: [@other_group]
        )
        recipient_within_group_other_group.save(validate: false)

        @recipient_in_shared_group = User.new(
          user_name: 'recipient-shared-group', role: @role_receive, user_groups: [@shared_group]
        )
        @recipient_in_shared_group.save(validate: false)

        @recipient_in_other_group = User.new(
          user_name: 'recipient-other-group', role: @role_receive, user_groups: [@other_group]
        )
        @recipient_in_other_group.save(validate: false)
      end

      it 'returns users within its own user group' do
        users = UserTransitionService.referral(@sender, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user1 recipient-shared-group recipient-within-group])
      end

      it 'does not returns cross-module users even if they are in the same group' do
        role = Role.new(
          permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL])],
          primero_modules: [@other]
        )
        role.save(validate: false)

        diff_module_shared_group_user = User.new(
          user_name: 'diff-module-shared-group-user', role:, user_groups: [@shared_group]
        )
        diff_module_shared_group_user.save(validate: false)

        users = UserTransitionService.referral(@sender, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(%w[user1 recipient-shared-group recipient-within-group])
      end

      it 'returns cross-module users only if they have RECEIVE_REFERRAL_DIFFERENT_MODULE and are in the same group' do
        different_module_role = Role.new(
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE])
          ],
          primero_modules: [@other]
        )
        different_module_role.save(validate: false)

        diff_module_shared_group_user = User.new(
          user_name: 'diff-module-shared-group-user', role: different_module_role, user_groups: [@shared_group]
        )
        diff_module_shared_group_user.save(validate: false)

        diff_module_other_group_user = User.new(
          user_name: 'diff-module-other-group-user', role: different_module_role, user_groups: [@other_group]
        )
        diff_module_other_group_user.save(validate: false)

        users = UserTransitionService.referral(@sender, Child, @cp.unique_id).transition_users

        expect(users.map(&:user_name)).to match_array(
          %w[user1 recipient-shared-group diff-module-shared-group-user recipient-within-group]
        )
      end
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

    it 'filters users based on agency' do
      users = UserTransitionService.referral(@user7, Child, @cp.unique_id).transition_users(
        'agency' => 'fake-agency-2'
      )
      expect(users.map(&:user_name)).to match_array(%w[user8])
    end
  end

  describe 'transfer' do
    before do
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
      @user5 = User.new(user_name: 'user5', role: @role_system)
      @user5.save(validate: false)
      @user6 = User.new(user_name: 'user6', role: @role_maintenance)
      @user6.save(validate: false)
      @user7 = User.new(user_name: 'user7', role: role_receive, unverified: true)
      @user7.save(validate: false)
    end

    it 'returns verified users to transfer based on permission excluding system,maintenance categories' do
      users = UserTransitionService.transfer(@user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3])
    end

    it 'does not require the receive transfer permission for a transfer request' do
      users = UserTransitionService.new(TransferRequest.name, @user1, Child, @cp.unique_id).transition_users
      expect(users.map(&:user_name)).to match_array(%w[user2 user3 user4])
    end
  end

  after do
    clean_data(UserGroup, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection)
  end
end
