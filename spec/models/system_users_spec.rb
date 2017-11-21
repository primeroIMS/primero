require 'rails_helper'
describe SystemUsers do

  before :each do
    @sys_user = build :system_users
  end

  after :each do
    @sys_user.destroy
  end

  it "System Users should be valid" do
    @sys_user.should be_valid
    @sys_user.save
  end

  it "should assign _id based on name" do
    @sys_user.save
    @sys_user._id.should == "org.couchdb.user:test_user"
  end

  it "should not save if the username already exists" do
    @sys_user.save
    another_sys_user = build :system_users
    another_sys_user.save.should be_false
    another_sys_user.errors[:name].should == ["User name has already been taken! Please select a new User name"]
  end

  it "should fetch all the _user documents" do
    @sys_user.save
    SystemUsers.get(@sys_user._id).should_not be_nil
  end

end

describe "SystemUsers - Others Validations" do
  before do
    SystemUsers.all.each &:destroy
  end

  #NOTE: Don't remove all the records from this table
  #There is not test table for this records
  #and will delete valid record from the development database.

  it "should not be valid because missing required fields" do
    sys_user = SystemUsers.new
    sys_user.save.should be_false
    sys_user.errors[:name].should == ["can't be blank"]
    sys_user.errors[:password].should == ["can't be blank"]
  end

  it "should update system users password" do
    #Create new user and expected to save
    sys_user = SystemUsers.new(:name => "another_user_name", :password => "some password")
    sys_user.save.should be_true
    sys_user.errors.messages.empty?.should be_true

    #Retrieve from the database and change the password
    sys_user = SystemUsers.get(sys_user._id)
    sys_user.password = "Change password"
    sys_user.save.should be_true
    sys_user.errors.messages.empty?.should be_true

    sys_user.destroy
  end

end
