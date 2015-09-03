require 'spec_helper'

describe HomeController do
  render_views

  describe "GET index", skip_session: true do

    it "should display information for user manager" do
      p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      user = User.new(:user_name => 'fakeadmin', :is_manager => true)
      session = fake_admin_login user
      user.should_receive(:modules).and_return([p_module], [p_module], [p_module], [p_module])

      controller.should_receive(:load_manager_information).once

      get :index

      #That header should appears in the body if the user is a manager.
      response.body.should match(/<h4>Status of Cases<\/h4>/)
    end

    it "should not display information for user not manager" do
      p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      user = User.new(:user_name => 'fakeadmin', :is_manager => false)
      session = fake_admin_login user
      user.should_receive(:modules).and_return([p_module], [p_module], [p_module], [p_module])

      controller.should_not_receive(:load_manager_information)

      get :index

      #That header should not appears in the body if the user is not a manager.
      response.body.should_not match(/<h4>Status of Cases<\/h4>/)
    end

  end

end
