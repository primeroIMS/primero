require 'rails_helper'

describe 'shared/_nav.html.erb' do

  describe 'when logged in' do
    before do
      fake_user_login(Permission.new(resource: Permission::CASE, actions: [Permission::READ]))
    end
    it 'has a HOME link' do
        render :partial => 'shared/nav'
        rendered.should have_link("HOME")
    end
  end

  context 'when logged in with Role permissions' do
    context 'without write access' do
      before do
        fake_user_login(Permission.new(resource: Permission::ROLE, actions: [Permission::READ]))
      end
      it 'should not have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should_not have_link("SETTINGS")
      end
    end

    context 'with write access' do
      before do
        fake_user_login(Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE]))
      end
      it 'should have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should have_link("SETTINGS")
      end
    end
  end

  context 'when logged in with User permissions' do
    context 'without write access' do
      before do
        fake_user_login(Permission.new(resource: Permission::USER, actions: [Permission::READ]))
      end
      it 'should not have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should_not have_link("SETTINGS")
      end
    end

    context 'with write access' do
      before do
        # We use UserGroup here instead of User because all users have access to manage themselves.
        # Therefore... can? :edit, User always returns true
        fake_user_login(Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]))
      end
      it 'should have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should have_link("SETTINGS")
      end
    end
  end

  context 'when not logged in with User or Role permissions' do
    context 'without write access' do
      before do
        fake_user_login(Permission.new(resource: Permission::CASE, actions: [Permission::READ]))
      end
      it 'should not have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should_not have_link("SETTINGS")
      end
    end

    context 'with write access' do
      before do
        fake_user_login(Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE]))
      end
      it 'should not have SETTINGS link' do
        render :partial => 'shared/nav'
        rendered.should_not have_link("SETTINGS")
      end
    end
  end

  def fake_user_login(permissions)
    @user = double('user', :permissions => [permissions], :has_permission? => true, :group_permission? => Permission::GROUP,
                                                        :user_name => 'name', :id => 'test-user-id', :full_name => 'Jose Smith')
    @user.stub(:has_permission_by_permission_type?).and_return(true)
    @user.stub(:localize_date)
    controller.stub(:current_user).and_return(@user)
    controller.stub(:model_class).and_return(Child)
    controller.stub(:name).and_return('cases')
    view.stub(:current_user).and_return(@user)
    view.stub(:user_signed_in?).and_return(true)
    view.stub(:current_user_name).and_return('name')
  end

end
