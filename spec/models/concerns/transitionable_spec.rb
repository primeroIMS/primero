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
    @role = Role.new(permissions_list: [permission_case])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1], modules: [@module_cp])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2], modules: [@module_cp])
    @user2.save(validate: false)
    @group3 = UserGroup.create!(name: 'Group3')
    @user3 = User.new(user_name: 'user3', role: @role, user_groups: [@group3], modules: [@module_cp])
    @user3.save(validate: false)
    @case = Child.create(data: {
      name: 'Test', owned_by: 'user1',
      module_id: @module_cp.unique_id,
      consent_for_services: true, disclosure_other_orgs: true
    })
  end

  describe 'transitions_for_user' do

    before :each do
      @assign1 = Assign.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      @assign2 = Assign.create!(transitioned_by: 'user2', to_user_name: 'user1', record: @case)
      @transfer = Transfer.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      @referral1 = Referral.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      @referral2 = Referral.create!(transitioned_by: 'user1', to_user_name: 'user3', record: @case)
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

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end

end