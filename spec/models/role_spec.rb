require 'spec_helper'

describe Role do
  it "should not be valid if name is empty" do
    role = Role.new
    role.should_not be_valid
    role.errors[:name].should == ["Name must not be blank"]
  end

  it "should not be valid if permissions is empty" do
    role = Role.new
    role.should_not be_valid
    role.errors[:permissions_list].should == ["Please select at least one permission"]
  end

  it "should sanitize and check for permissions" do
    role = Role.new(:name => "Name", :permissions_list => [])
    role.save
    role.should_not be_valid
    role.errors[:permissions_list].should == ["Please select at least one permission"]
  end

  it "should not be valid if a role name has been taken already" do
    Role.create({:name => "Unique", :permissions_list => Permission.all_permissions_list})
    role = Role.new({:name => "Unique", :permissions => Permission.all_permissions_list})
    role.should_not be_valid
    role.errors[:name].should == ["A role with that name already exists, please enter a different name"]
  end

  it "should create a valid role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list).should be_valid
  end

  it "should create a valid transfer role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list, :transfer => true).should be_valid
  end

  it "should create a valid referral role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list, :referral => true).should be_valid
  end

  it "should only grant permissions that are assigned to a role" do
    permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    role = Role.new(:name => "some_role", :permissions_list => [permission])
    role.should be_valid
    role.has_permission(Permission::READ).should == true
    role.has_permission(Permission::WRITE).should == false
  end

  it "should generate id" do
    Role.all.each {|role| role.destroy}
    role = create :role, :name => 'test role 1234', :permissions_list => Permission.all_permissions_list, :_id => nil
    role.id.should == "role-test-role-1234"
  end
end
