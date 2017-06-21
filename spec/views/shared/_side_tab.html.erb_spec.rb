require 'spec_helper'

describe 'shared/_side_tab.html.erb' do

  describe 'when logged in' do
    context 'with User READ permissions' do
      before do
        fake_user_login(Permission.new(resource: Permission::USER, actions: [Permission::READ]))
      end

      it 'does not have a Users link' do
          render :partial => 'shared/side_tab', :locals => {:highlight_page => ''}
          expect(rendered).not_to have_link("Users")
      end
    end

    context 'with User MANAGE permissions' do
      before do
        # We use UserGroup here instead of User because all users have access to manage themselves.
        # Therefore... can? :edit, User always returns true
        fake_user_login(Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]))
      end

      it 'has a Users link' do
        render :partial => 'shared/side_tab', :locals => {:highlight_page => ''}
        expect(rendered).to have_link("Users")
      end
    end

    context 'with Role WRITE permissions' do
      before do
        fake_user_login(Permission.new(resource: Permission::ROLE, actions: [Permission::WRITE]))
      end

      it 'has a Users link' do
        render :partial => 'shared/side_tab', :locals => {:highlight_page => ''}
        expect(rendered).to have_link("Users")
      end
    end

  end

  def fake_user_login(permissions)
    @user = double('user', :permissions => [permissions], :has_permission? => true, :has_group_permission? => Permission::GROUP,
                                                        :user_name => 'name', :id => 'test-user-id', :full_name => 'Jose Smith')
    @user.stub(:localize_date)
    controller.stub(:current_user).and_return(@user)
    controller.stub(:model_class).and_return(Child)
    controller.stub(:name).and_return('cases')
    view.stub(:current_user).and_return(@user)
    view.stub(:logged_in?).and_return(true)
    view.stub(:current_user_name).and_return('name')
  end

end
