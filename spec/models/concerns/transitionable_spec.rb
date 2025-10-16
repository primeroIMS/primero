# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Transitionable do
  before :each do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Referral, Agency)
    @module_cp = PrimeroModule.new(name: 'CP', associated_record_types: %w[case incident])
    @module_cp.save(validate: false)

    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE, Permission::CREATE,
        Permission::REFERRAL, Permission::RECEIVE_REFERRAL,
        Permission::ASSIGN, Permission::TRANSFER, Permission::RECEIVE_TRANSFER
      ]
    )
    permission_incident_assign = Permission.new(
      resource: Permission::INCIDENT, actions: [Permission::ASSIGN]
    )
    permission_incident = Permission.new(
      resource: Permission::INCIDENT,
      actions: [
        Permission::READ
      ]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @role_case_incident = Role.new(permissions: [permission_case, permission_incident_assign], modules: [@module_cp])
    @role_case_incident.save(validate: false)
    @role_incident = Role.new(permissions: [permission_incident], modules: [@module_cp])
    @role_incident.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role_case_incident, user_groups: [@group1])
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
    @user5 = User.new(user_name: 'user5', role: @role, user_groups: [@group4])
    @user5.save(validate: false)
    @user6 = User.new(user_name: 'user6', role: @role_incident, user_groups: [@group4])
    @user6.save(validate: false)
    @case = Child.create(data: {
                           name: 'Test', owned_by: 'user1',
                           module_id: @module_cp.unique_id,
                           consent_for_services: true, disclosure_other_orgs: true
                         })
    @incident = Incident.create(
      data: {
        age: 3,
        status: 'open',
        owned_by: 'user2',
        short_id: '6a7013f',
        module_id: @module_cp.unique_id
      }
    )
  end

  describe 'transitions_for_user' do
    before :each do
      @assign1 = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @assign2 = Assign.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      @assign3 = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user6', record: @incident)
      @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral1 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @referral2 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
    end

    it 'lists all cases transitions' do
      transitions = @case.transitions_for_user(@user1)
      expect(transitions.size).to eq(5)
      expect(transitions.map(&:id)).to include(@assign1.id, @assign2.id, @transfer.id, @referral1.id, @referral2.id)
    end

    it 'lists all incidents transitions' do
      transitions = @incident.transitions_for_user(@user1)
      expect(transitions.size).to eq(1)
      expect(transitions.map(&:id)).to include(@assign3.id)
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
      @case.save!
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
      @referral2.accept!
      @referral3.reject!(@user4)
      @referral4.accept!
      @referral4.done!(@user4)
      [@referral1, @referral2, @referral3, @referral4].each(&:save!)
    end

    it 'should return the users with referrals' do
      expect(@case.referred_users).to match_array(%w[user2 user3])
    end
  end

  describe 'referrals_for_user' do
    before :each do
      clean_data(User, Role, Referral, Agency)
      permissions = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE, Permission::CREATE,
          Permission::REFERRAL, Permission::RECEIVE_REFERRAL
        ]
      )
      permissions_limited = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ]
      )

      @agency = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @role_self = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::SELF)
      @role_self.save(validate: false)
      @role_group = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::GROUP)
      @role_group.save(validate: false)
      @role_group_limited = Role.new(
        permissions: [permissions_limited], modules: [@module_cp], group_permission: Permission::GROUP
      )
      @role_group_limited.save(validate: false)
      @role_agency = Role.new(permissions: [permissions], modules: [@module_cp], group_permission: Permission::AGENCY)
      @role_agency.save(validate: false)
      @role_agency_limited = Role.new(
        permissions: [permissions_limited], modules: [@module_cp], group_permission: Permission::AGENCY
      )
      @role_agency_limited.save(validate: false)
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
      @user_group_limited = User.create(user_name: 'user5', role: @role_group_limited, user_groups: [@group2, @group1])
      @user_group_limited.save(validate: false)
      @user_agency_limited = User.create(user_name: 'user6', role: @role_agency_limited, agency: @agency)
      @user_agency_limited.save(validate: false)

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
      @referral8 = Referral.create!(transitioned_by: 'user2', transitioned_to: 'user1',
                                    transitioned_to_agency: @agency.unique_id, record: @case3)
      @referral9 = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user4',
                                    transitioned_to_agency: @agency.unique_id, record: @case3)
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

      describe 'no permission to view referrals' do
        it 'should not see any referrals' do
          referrals = @case.referrals_for_user(@user_group_limited)
          expect(referrals.size).to eq(0)
        end

        before do
          allow(@user_group).to receive(:can_view_referrals?).and_return(false)
        end

        it 'should only referrals where user is the transitioned_to' do
          referrals = @case.referrals_for_user(@user_group)
          expect(referrals.size).to eq(1)
          expect(referrals.ids).to include(@referral2.id)
        end
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

      describe 'no permission to view referrals' do
        it 'should not see any referrals' do
          referrals = @case3.referrals_for_user(@user_agency_limited)
          expect(referrals.size).to eq(0)
        end

        before do
          allow(@user_agency).to receive(:can_view_referrals?).and_return(false)
        end

        it 'should only referrals where user is the transitioned_to' do
          referrals = @case3.referrals_for_user(@user_agency)
          expect(referrals.size).to eq(1)
          expect(referrals.ids).to include(@referral9.id)
        end
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

  describe 'referrals_to_user' do
    let(:referral1) { Referral.create!(transitioned_by: 'user1', transitioned_to: 'user5', record: @case) }
    let(:referral2) { Referral.create!(transitioned_by: 'user1', transitioned_to: 'user5', record: @case) }
    let(:referral3) { Referral.create!(transitioned_by: 'user1', transitioned_to: 'user5', record: @case) }
    let(:referral4) { Referral.create!(transitioned_by: 'user1', transitioned_to: 'user5', record: @case) }
    let(:referral5) { Referral.create!(transitioned_by: 'user1', transitioned_to: 'user5', record: @case) }

    before do
      referral1
      referral2.accept!
      referral3.accept!
      referral3.done!(@user5)
      referral4.revoke!(@user5)
      referral5.reject!(@user5)
    end

    it 'returns the pending referrals where the user is the recipient' do
      referrals = @case.referrals_to_user(@user5)

      expect(referrals.length).to eq(2)
      expect(referrals.map(&:id)).to match_array([referral1.id, referral2.id])
    end
  end

  after :each do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Transition, Agency)
  end
end
