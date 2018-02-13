require 'rails_helper'

describe TransitionActions, type: :controller do

  controller(ApplicationController) do
    include TransitionActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    routes.draw {
      post 'transition' => 'anonymous#transition'
    }
  end

  context 'passing ids' do
    before do
      User.stub(:find_by_user_name).and_return(@user)
      @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => PrimeroModule::CP, :consent_for_services => true, :disclosure_other_orgs => true)
      @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => PrimeroModule::CP, :consent_for_services => true, :disclosure_other_orgs => true)
      @user2 = User.new(:user_name => 'primero_cp', :role_ids => ['referer'], :module_ids => [PrimeroModule::CP])
    end

    it 'allows referrals from users with the referral permission' do
      permission_transition = Permission.new(resource: Permission::CASE, actions: [Permission::REFERRAL])
      Role.create(id: 'referer', name: 'referer', permissions_list: [permission_transition], group_permission: Permission::GROUP)

      @user = User.new(:user_name => 'referring_user', :role_ids => ['referer'])
      @session = fake_login @user

      User.stub(:find_by_user_name).with(@user2.user_name).and_return(@user2)

      controller.instance_variable_set(:@new_user, @user2)

      params = {
        :selected_records => [@case1.id, @case2.id].join(','),
        :transition_type => "referral",
        :consent_override => "true",
        :existing_user => "primero_cp",
        :transition_role => "role-referral",
        :service => "Safehouse Service",
        :notes => "test",
        :type_of_export => Transitionable::EXPORT_TYPE_PRIMERO,
      }
      post :transition, params: params
      flash[:notice].should eq("2 Referral(s) successfully made")
      response.status.should_not == 403
    end
  end
end
