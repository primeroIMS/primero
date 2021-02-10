require 'rails_helper'

describe Transitionable do
  before :each do
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

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end

end