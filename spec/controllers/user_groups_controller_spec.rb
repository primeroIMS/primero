require 'rails_helper'

describe UserGroupsController, :type => :controller do

  describe "POST create " do
    before :each do
      Role.all.each &:destroy
      UserGroup.all.each &:destroy
      User.all.each &:destroy
    end

    context "User has group permissions" do
      before :each do
        permissions_user_group = Permission.new(resource: Permission::USER_GROUP, actions: [Permission::CREATE, Permission::ASSIGN])
        fake_login_with_permissions [permissions_user_group], Permission::GROUP
      end


      it "should create the UserGroup and User should be part of it" do

        post :create, params: {user_group: { name: 'Test Group 1', description: 'Test group'}}

        expect(controller.current_user.has_user_group_id?(UserGroup.all.first.id)).to be_truthy
      end
    end

    context "User does not have group permissions" do
      before :each do
        permissions_user_group = Permission.new(resource: Permission::USER_GROUP, actions: [Permission::CREATE])
        fake_login_with_permissions [permissions_user_group], Permission::SELF
      end

      it "should create the UserGroup and the user should not be part of it" do

        post :create, params: {user_group: { name: 'Test Group 1', description: 'Test group'}}

        expect(controller.current_user.has_user_group_id?(UserGroup.all.first.id)).to be_falsey
      end
    end
  end
end
