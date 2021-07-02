# frozen_string_literal: true

require 'rails_helper'

describe Transitionable do
  before :each do
    clean_data(
      PrimeroModule, Role, UserGroup, User,
      Child, Referral
    )
    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)

    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::REFERRAL, Permission::RECEIVE_REFERRAL,
        Permission::ASSIGN, Permission::TRANSFER, Permission::RECEIVE_TRANSFER
      ]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @group3 = UserGroup.create!(name: 'Group3')
    @user3 = User.new(user_name: 'user3', role: @role, user_groups: [@group3])
    @user3.save(validate: false)
    @group4 = UserGroup.create!(name: 'Group4')
    @user4 = User.new(user_name: 'user4', role: @role, user_groups: [@group4])
    @user4.save(validate: false)
    @case = Child.create(data: {
                           name: 'Test', owned_by: 'user1',
                           module_id: @module_cp.unique_id,
                           consent_for_services: true, disclosure_other_orgs: true
                         })
  end

  describe 'transitions_for_user' do
    before :each do
      @assign1 = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @assign2 = Assign.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral2 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
    end

    it 'lists all transitions' do
      transitions = @case.transitions_for_user(@user1)
      expect(transitions.size).to eq(5)
      expect(transitions.map(&:id)).to include(@assign1.id, @assign2.id, @transfer.id, @referral1.id, @referral2.id)
    end

    it 'lists select transitions' do
      transitions = @case.transitions_for_user(@user1, [Assign.name])
      expect(transitions.size).to eq(2)
      expect(transitions.map(&:id)).to include(@assign1.id, @assign2.id)
    end

    it "excludes referrals that aren't yours" do
      transitions = @case.transitions_for_user(@user2)
      expect(transitions.size).to eq(4)
      expect(transitions.map(&:id)).to include(@assign1.id, @assign2.id, @transfer.id, @referral1.id)
      expect(transitions.map(&:id)).not_to include(@referral2.id)
    end
  end

  describe 'transferred_to_users' do
    before :each do
      @transfer1 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @transfer2 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user4', record: @case)
      @transfer3 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      @transfer4 = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      @transfer1.status = Transition::STATUS_INPROGRESS
      @transfer2.status = Transition::STATUS_ACCEPTED
      @transfer3.status = Transition::STATUS_REJECTED
      @transfer4.status = Transition::STATUS_DONE
      [@transfer1, @transfer2, @transfer3, @transfer4].each(&:save!)
    end

    it 'should return the users with transfers' do
      expect(@case.transferred_to_users).to match_array(%w[user2])
    end
  end

  describe 'referred_users' do
    before :each do
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral2 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      @referral3 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user4', record: @case)
      @referral4 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user4', record: @case)
      @referral1.status = Transition::STATUS_INPROGRESS
      @referral2.status = Transition::STATUS_ACCEPTED
      @referral3.status = Transition::STATUS_REJECTED
      @referral4.status = Transition::STATUS_DONE
      [@referral1, @referral2, @referral3, @referral4].each(&:save!)
    end

    it 'should return the users with transfers' do
      expect(@case.referred_users).to match_array(%w[user2 user3])
    end
  end

  describe 'referrals_for_user' do
    before :each do
      clean_data(Role, User, Referral, Agency)
      permissions = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE, Permission::CREATE,
          Permission::REFERRAL, Permission::RECEIVE_REFERRAL
        ]
      )

      @agency = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @role_self = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::SELF)
      @role_self.save(validate: false)
      @role_group = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::GROUP)
      @role_group.save(validate: false)
      @role_agency = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::AGENCY)
      @role_agency.save(validate: false)
      @role_all = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::ALL)
      @role_all.save(validate: false)

      @user_self = User.new(user_name: 'user1', role: @role_self, user_groups: [@group1])
      @user_self.save(validate: false)
      @user_group = User.create(user_name: 'user2', role: @role_group, user_groups: [@group2, @group1], agency: @agency)
      @user_group.save(validate: false)
      @user_all = User.new(user_name: 'user3', role: @role_all, user_groups: [@group3])
      @user_all.save(validate: false)
      @user_agency = User.create(user_name: 'user4', role: @role_agency, agency: @agency)
      @user_agency.save(validate: false)

      @case2 = Child.create(data: {
                              name: 'Test', owned_by: 'user2',
                              module_id: @module_cp.unique_id,
                              consent_for_services: true, disclosure_other_orgs: true
                            })

      @case3 = Child.create(data: {
                              name: 'Test', owned_by: 'user3',
                              module_id: @module_cp.unique_id,
                              consent_for_services: true, disclosure_other_orgs: true
                            })
      @referral1 = Referral.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      @referral2 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral3 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      @referral4 = Referral.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case2)
      @referral5 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case2)
      @referral6 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case2)
      @referral7 = Referral.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case3)
      @referral8 = Referral.create!(transitioned_by: 'user2', transitioned_to: 'user1', transitioned_to_agency: @agency.unique_id, record: @case3)
      @referral9 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user4', transitioned_to_agency: @agency.unique_id, record: @case3)
    end

    describe 'when group permission for the user is "self"' do
      it 'and is the record_owner' do
        transitions = @case.referrals_for_user(@user_self)
        expect(transitions.size).to eq(3)
        expect(transitions.ids).to include(@referral1.id, @referral2.id, @referral3.id)
      end

      it 'is not the record owner' do
        transitions = @case2.referrals_for_user(@user_self)
        expect(transitions.size).to eq(1)
        expect(transitions.ids).to include(@referral4.id)
      end
    end

    describe 'when group permission for the user is "group"' do
      it 'and the record owner is in one of my groups' do
        transitions = @case.referrals_for_user(@user_group)
        expect(transitions.size).to eq(3)
        expect(transitions.ids).to include(@referral1.id, @referral2.id, @referral3.id)
      end

      it 'record owner is NOT in one of my groups see only transitions where recipient is in one of my groups.' do
        transitions = @case3.referrals_for_user(@user_group)
        expect(transitions.size).to eq(2)
        expect(transitions.ids).to include(@referral7.id, @referral8.id)
      end
    end

    describe 'when group permission for the user is "agency"' do
      it 'and the record owner is in my agency' do
        transitions = @case2.referrals_for_user(@user_agency)
        expect(transitions.size).to eq(3)
        expect(transitions.ids).to include(@referral4.id, @referral5.id, @referral6.id)
      end

      it 'record owner is NOT in my agency I see only transitions where recipient is in one of my agency.' do
        transitions = @case3.referrals_for_user(@user_agency)
        expect(transitions.size).to eq(2)
        expect(transitions.ids).to include(@referral8.id, @referral9.id)
      end
    end

    describe 'when group permission for the user is "all"' do
      it 'should see all the referrals' do
        transitions = @case.referrals_for_user(@user_all)
        expect(transitions.size).to eq(3)
        expect(transitions.ids).to include(@referral1.id, @referral2.id, @referral3.id)
      end
    end
  end

  after :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition, Agency)
  end
end
