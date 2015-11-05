require 'spec_helper'

describe ApproveCasePlanActions, type: :controller do

  controller(ApplicationController) do
    include RecordActions
    include ApproveCasePlanActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    routes.draw {
      post 'approve_case_plan' => 'anonymous#approve_case_plan'
    }

    @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => 'cp')
    @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => 'cp')
  end

  context 'with a user not having approval permission' do
    before do
      User.stub(:find_by_user_name).and_return(@user)
      permission_nonapproval = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      Role.create(id: 'nonapprover', name: 'nonapprover', permissions_list: [permission_nonapproval], group_permission: Permission::GROUP)
      @user = User.new(:user_name => 'non_approval_user', :role_ids => ['nonapprover'])
      @session = fake_login @user
    end

    it "does not allow approve case plan" do
      params = {
          :id => @case1.id,
          :approval => "yes",
          :comments => "Test Comments"
      }
      post :approve_case_plan, params
      expect(response.status).to eq(403)
    end
  end

  context 'with user having approval permission' do
    before do
      User.stub(:find_by_user_name).and_return(@user)
      permission_approval = Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_CASE_PLAN])
      Role.create(id: 'approver', name: 'approver', permissions_list: [permission_approval], group_permission: Permission::GROUP)
      @user2 = User.new(:user_name => 'approval_user', :role_ids => ['approver'])
      @session = fake_login @user2
    end

    it 'allows approve case plan' do
      params = {
        :id => @case1.id,
        :approval => "yes",
        :comments => "Test Comments"
      }
      post :approve_case_plan, params
      expect(response.status).not_to eq(403)
    end
  end
end
