require 'rails_helper'

describe SessionsController do

  it "should respond with text ok" do
    get :active
    response.body.should == 'OK'
  end

  xit "should return the required fields when the user is authenticated successfully via a mobile device" do
    mock_user = double({:organization => "TW", :verified? => true, :module_ids => ["primeromodule-cp"], :role_ids => ["role-cp-case-worker"], :locale => "en"})
    User.should_receive(:find_by_user_name).with(anything).and_return(mock_user)
    Login.stub(:new).and_return(double(:authenticate_user =>
                              mock_model(Session, :authenticate_user => true, :imei => "IMEI_NUMBER",
                                   :save => true, :put_in_cookie => true, :user_name => "dummy", :token => "some_token", :extractable_options? => false)))
    post :create, params: {:user_name => "dummy", :password => "dummy", :imei => "IMEI_NUMBER", :format => "json"}

    JSON.parse(response.body)["db_key"].should == "unique_key"
    JSON.parse(response.body)["organization"].should == "TW"
    JSON.parse(response.body)["module_ids"].should == ["primeromodule-cp"]
    JSON.parse(response.body)["role_ids"].should == ["role-cp-case-worker"]
    JSON.parse(response.body)["language"].should == "en"
  end

  describe 'logger' do
    before do
      Role.all.each &:destroy
      User.stub(:find_by_user_name).and_return(@user)
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::WRITE, Permission::CREATE])
      Role.create(id: 'tester', name: 'tester', permissions_list: [case_permission], group_permission: Permission::GROUP)
      @user = User.new(:user_name => 'test_user', :role_ids => ['tester'])
      allow(Rails.logger).to receive(:info)
    end

    it "logs a Login message" do
      Login.stub(:new).and_return(double(:authenticate_user =>
                                             mock_model(Session, :authenticate_user => true, :imei => "IMEI_NUMBER",
                                                        :save => true, :put_in_cookie => true, :user_name => "dummy", :token => "some_token", :extractable_options? => false)))
      expect(Rails.logger).to receive(:info).with("Login  by user 'test_user'")
      post :create, params: { :user_name => "test_user", :password => "test1234" }
    end

    it "logs a Logout message" do
      @session = fake_login @user
      expect(Rails.logger).to receive(:info).with("Logout  by user 'test_user'")
      delete :destroy
    end
  end


end
