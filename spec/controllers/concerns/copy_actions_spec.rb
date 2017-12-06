require 'rails_helper'

describe CopyActions, type: :controller do
  controller(ApplicationController) do
    include CopyActions

    def model_class
      Role
    end
  end

  before do
    routes.draw {
      post 'copy' => 'anonymous#copy'
    }

    Role.all.each &:destroy
    User.all.each &:destroy
  end

  describe 'copy object' do
    context 'as user without permission' do
      before do
        @permission_role_read = Permission.new(resource: Permission::ROLE, actions: [Permission::READ])
        Role.create(id: 'non-copyable', name: 'non copyable', permissions_list: [@permission_role_read], group_permission: Permission::GROUP)
        @user = User.new(:user_name => 'non_copy_user', :role_ids => ['non-copyable'])
        @session = fake_login @user
      end

      it 'does not allow copy' do
        post :copy
        expect(response.status).to eq(403)
      end
    end

    context 'as user with permission' do
      before do
        @permission_role_read_copy = Permission.new(resource: Permission::ROLE, actions: [Permission::READ, Permission::COPY])
        Role.create(id: 'copyable', name: 'copyable', permissions_list: [@permission_role_read_copy], group_permission: Permission::GROUP)
        @permission_case_read_write = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
        @test_role = Role.create(id: 'role-test-role', name: 'Test Role', permissions_list: [@permission_role_read_copy, @permission_case_read_write], group_permission: Permission::GROUP)
        @user = User.create(:user_name => 'copy_user', :role_ids => ['copyable'])
        Role.should_receive(:get).with(@test_role.id).and_return(@test_role)
        @request.env['HTTP_REFERER'] = 'http://test.com/roles/index'
        @session = fake_login @user
      end

      context 'passing no name' do
        it 'creates a new role having name starting with copy of' do
          post :copy, params: {:id => @test_role.id}
          flash[:notice].should == "Role successfully copied."
        end

        context 'if new role already exists' do
          #It should fail gracefully with an error message
          it 'does not copy the role and returns error message' do
            Role.create(id: 'role-copy-of-test-role', name: 'copy of Test Role', permissions_list: [@permission_role_read_copy, @permission_case_read_write], group_permission: Permission::GROUP)
            post :copy, params: {:id => @test_role.id}
            flash[:notice].should == "Error copying Role.  Ensure the name does not conflict with another Role."
          end
        end
      end

      context 'passing a name' do
        it 'creates a new role having the passed in name' do
          post :copy, params: {:id => @test_role.id, :name => 'New Role Name'}
          flash[:notice].should == "Role successfully copied."
        end

        context 'if new role already exists' do
          #It should fail gracefully with an error message
          it 'does not copy the role and returns error message' do
            Role.create(id: 'role-new-role-name', name: 'New Role Name', permissions_list: [@permission_role_read_copy, @permission_case_read_write], group_permission: Permission::GROUP)
            post :copy, params: {:id => @test_role.id, :name => 'New Role Name'}
            flash[:notice].should == "Error copying Role.  Ensure the name does not conflict with another Role."
          end
        end
      end

    end
  end
end
