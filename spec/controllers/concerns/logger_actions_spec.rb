require 'spec_helper'

describe LoggerActions, type: :controller do

  controller(ApplicationController) do
    include RecordActions
    include LoggerActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    # routes.draw {
    #   post 'approve_form' => 'anonymous#approve_form'
    # }

    @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => 'cp')
    @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => 'cp')
    User.stub(:find_by_user_name).and_return(@user)
    case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::WRITE])
    Role.create(id: 'tester', name: 'tester', permissions_list: [case_permission], group_permission: Permission::GROUP)
    @user = User.new(:user_name => 'test_user', :role_ids => ['tester'])
    @session = fake_login @user
  end

  describe 'Login' do
    # it "logs when a user logs in" do
    #   expect(Rails.logger).to receive(:info).with("Login  by user 'test_user'")
    #   @session = fake_login @user
    # end
  end
end
