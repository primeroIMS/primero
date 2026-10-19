# frozen_string_literal: true

require 'rails_helper'

describe TransferRequest do
  before :each do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Transition)
    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)
    @module_gbv = PrimeroModule.new(name: 'GBV')
    @module_gbv.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::RECEIVE_TRANSFER]
    )
    @role = Role.new(permissions: [permission_case], primero_modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @case = Child.create(
      data: {
        name: 'Test', owned_by: 'user1',
        module_id: @module_cp.unique_id,
        disclosure_other_orgs: true
      }
    )
  end

  describe 'validations' do
    before :each do
      permission_request_transfer = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ, Permission::REQUEST_TRANSFER]
      )
      @requester_role = Role.new(permissions: [permission_request_transfer], primero_modules: [@module_cp])
      @requester_role.save(validate: false)
      @requester = User.new(user_name: 'requester', role: @requester_role, user_groups: [@group1])
      @requester.save(validate: false)

      permission_read_only = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @owner_role = Role.new(permissions: [permission_read_only], primero_modules: [@module_cp])
      @owner_role.save(validate: false)
      @owner = User.new(user_name: 'owner', role: @owner_role, user_groups: [@group1])
      @owner.save(validate: false)

      @owned_case = Child.create(
        data: { name: 'Owned', owned_by: 'owner', module_id: @module_cp.unique_id, disclosure_other_orgs: true }
      )
    end

    it 'is valid when neither user has the receive transfer permission' do
      transfer_request = TransferRequest.new(
        transitioned_by: 'requester', transitioned_to: 'owner', record: @owned_case
      )

      expect(transfer_request).to be_valid
    end

    it 'is invalid when the request is not addressed to the record owner' do
      transfer_request = TransferRequest.new(
        transitioned_by: 'requester', transitioned_to: 'user2', record: @owned_case
      )

      expect(transfer_request).not_to be_valid
      expect(transfer_request.errors[:transitioned_to]).to include('transition.errors.to_user_can_receive')
    end

    it 'is invalid when the requester owns the record' do
      transfer_request = TransferRequest.new(transitioned_by: 'owner', transitioned_to: 'owner', record: @owned_case)

      expect(transfer_request).not_to be_valid
      expect(transfer_request.errors[:transitioned_to]).to include('transition.errors.to_user_can_receive')
    end

    it 'is invalid when the record owner has a system role' do
      system_role = Role.new(
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::READ])],
        primero_modules: [@module_cp], user_category: Role::CATEGORY_SYSTEM
      )
      system_role.save(validate: false)
      User.new(user_name: 'system_owner', role: system_role, user_groups: [@group1]).save(validate: false)
      system_owned_case = Child.create(
        data: { name: 'System', owned_by: 'system_owner', module_id: @module_cp.unique_id, disclosure_other_orgs: true }
      )

      transfer_request = TransferRequest.new(
        transitioned_by: 'requester', transitioned_to: 'system_owner', record: system_owned_case
      )

      expect(transfer_request).not_to be_valid
      expect(transfer_request.errors[:transitioned_to]).to include('transition.errors.to_user_can_receive')
    end
  end

  describe 'accept' do
    it 'initiates a transfer' do
      transfer_request = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      transfer_request.accept!

      transfer = @case.transfers.first

      expect(transfer_request.status).to eq(Transition::STATUS_ACCEPTED)
      expect(@case.transfers.size).to eq(1)
      expect(transfer.transitioned_to).to eq('user2')
      expect(transfer.transitioned_by).to eq('user1')
      expect(transfer.status).to eq(Transition::STATUS_INPROGRESS)
    end

    context 'when the requester cannot receive transfers' do
      before :each do
        permission_request_only = Permission.new(
          resource: Permission::CASE, actions: [Permission::READ, Permission::REQUEST_TRANSFER]
        )
        request_only_role = Role.new(permissions: [permission_request_only], primero_modules: [@module_cp])
        request_only_role.save(validate: false)
        User.new(user_name: 'requester', role: request_only_role, user_groups: [@group2]).save(validate: false)
        @transfer_request = TransferRequest.create!(
          transitioned_by: 'requester', transitioned_to: 'user1', record: @case
        )
      end

      it 'does not create a transfer' do
        expect { @transfer_request.accept! }.to raise_error(ActiveRecord::RecordInvalid, /to_user_can_receive/)

        expect(@case.transfers.size).to eq(0)
      end

      it 'leaves the request in progress' do
        expect { @transfer_request.accept! }.to raise_error(ActiveRecord::RecordInvalid)

        expect(@transfer_request.reload.status).to eq(Transition::STATUS_INPROGRESS)
      end
    end
  end

  after :each do
    clean_data(Alert, User, Role, PrimeroModule, UserGroup, Child, Transition)
  end
end
