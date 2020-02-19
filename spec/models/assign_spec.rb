require 'rails_helper'

describe Assign do

  before :each do
    primero_module = PrimeroModule.new(name: 'CP')
    primero_module.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN]
    )
    @role = Role.new(permissions: [permission_case], modules: [primero_module])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @case = Child.create(data: {'name' => 'Test', 'owned_by' => 'user1', module_id: primero_module.unique_id})
  end

  it 'changes the record owner' do
    Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

    expect(@case.owned_by).to eq('user2')
  end

  it "doesn't assign this record to a user outside of the user group if the role forbids it" do
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::ASSIGN_WITHIN_USER_GROUP]
    )
    @role.permissions = [permission_case]
    @role.save(validate: false)

    assign = Assign.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

    expect(assign.valid?).to be_falsey
    expect(@case.owned_by).to eq('user1')
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