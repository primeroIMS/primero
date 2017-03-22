require 'spec_helper'

describe HomeController do
  render_views

  #TODO: Please write tests after we refactor dashboards!!!!!

  describe "GET index", skip_session: true do

    xit "should display information for user manager" do
      p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      user = User.new(:user_name => 'fakeadmin', :is_manager => true)
      session = fake_admin_login user
      user.should_receive(:modules).and_return([p_module], [p_module], [p_module], [p_module])

      controller.should_receive(:load_manager_information).once

      get :index

      #That header should appears in the body if the user is a manager.
      response.body.should match(/<h4>Cases<\/h4>/)
    end

    xit "should not display information for user not manager" do
      p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      user = User.new(:user_name => 'fakeadmin', :is_manager => false)
      session = fake_admin_login user
      user.should_receive(:modules).and_return([p_module], [p_module], [p_module], [p_module])

      controller.should_not_receive(:load_manager_information)

      get :index

      #That header should not appears in the body if the user is not a manager.
      response.body.should_not match(/<h4>Cases<\/h4>/)
    end

  end

  describe 'Dashboard' do
    before do
      @p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      Role.all.each &:destroy
      @case3 = build :child, :unique_identifier => "1234"
      User.stub(:find_by_user_name).and_return(@user)
      @case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::WRITE])
    end

    context 'when logged in as a worker' do
      context 'with View Approvals permission' do
        before do
          dashboard_permission = Permission.new(resource: Permission::DASHBOARD, actions: [Permission::VIEW_APPROVALS])
          Role.create(id: 'tester', name: 'tester', permissions_list: [@case_permission, dashboard_permission], group_permission: Permission::GROUP)
          @user = User.new(:user_name => 'test_user', :role_ids => ['tester'], :module_ids => [PrimeroModule::CP])
          @session = fake_login @user
          @user.should_receive(:modules).and_return([@p_module], [@p_module])
        end

        #TODO - Implement this and other specs after dashboard refactor
        # Running into difficulties testing this due to search logic that is down in the home_helper (case_count)
        # Tried to stub helper method case count, couldn't get it to work.
        # That logic needs to be moved into the new Dashboard model and have helper have count passed in
        # It needs to be refactored so we don't have to stub case_count
        xit 'displays the Approvals section' do
          get :index
          expect(response.body).to match(/Approvals/)
          expect(response.body).not_to match(/Assessment/)
        end

        context 'and View Assessment permission' do
          #TODO - implement after dashboard refactor
          xit 'displays the Approvals and Assessment sections' do

          end
        end
      end

      context 'with View Assessment permission' do
        #TODO - implement after dashboard refactor
        xit 'displays the Assessment sections' do

        end
      end

      context 'with no Dashboard view permissions' do
        #TODO - implement after dashboard refactor
        xit 'does not display the Approval section' do

        end

        #TODO - implement after dashboard refactor
        xit 'does not display the Assessment section' do

        end
      end
    end


    context 'when loged in as a manager' do
      #TODO - implement after dashboard refactor
    end
  end

end
