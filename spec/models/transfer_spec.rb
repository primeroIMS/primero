require 'rails_helper'

describe Transfer do

  before :each do
    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)
    @module_gbv = PrimeroModule.new(name: 'GBV')
    @module_gbv.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::RECEIVE_TRANSFER]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @case = Child.create(data: {
      name: 'Test', owned_by: 'user1',
      module_id: @module_cp.unique_id,
      disclosure_other_orgs: true
    })
  end

  describe 'consent' do

    it 'denies consent for transferring records if consent properties are not set' do
      @case.update_attributes(disclosure_other_orgs: nil)
      transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(transfer.consent_given?).to be_falsey
    end

    it 'consents for transferring GBV records if referral_for_other_services is set to true' do
      @case.update_attributes(consent_for_services: true, module_id: @module_gbv.unique_id)
      transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(transfer.consent_given?).to be_truthy
    end

    it 'consents for referring CP records if referral_for_other_services and disclosure_other_orgs are set to true' do
      transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(transfer.consent_given?).to be_truthy
    end

  end

  describe 'perform' do

    context 'in system' do

      it 'allows the targeted user to have access to this record' do
        transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(transfer.status).to eq(Transition::STATUS_INPROGRESS)
        expect(@case.assigned_user_names).to include(transfer.transitioned_to)
      end

      it 'does not perform the transfer if the receiving user is not allowed to receive transfers' do
        permission_case = Permission.new(
          resource: Permission::CASE,
          actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
        )
        @role.permissions_list = [permission_case]
        @role.save(validate: false)
        transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(transfer.valid?).to be_falsey
        expect(@case.assigned_user_names.present?).to be_falsey
      end

    end

  end

  describe 'accept' do
    it 'changes the record owner' do
      transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      transfer.accept!

      expect(transfer.status).to eq(Transition::STATUS_ACCEPTED)
      expect(@case.owned_by).to eq('user2')
    end

  end

  describe 'reject' do
    it 'revokes access to this record for the target user' do
      transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      transfer.reject!

      expect(transfer.status).to eq(Transition::STATUS_REJECTED)
      expect(@case.assigned_user_names.present?).to be_falsey
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
