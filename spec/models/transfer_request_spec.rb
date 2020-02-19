require 'rails_helper'

describe TransferRequest do

  before :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition)
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

  end


  after :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Transition)
  end

end

