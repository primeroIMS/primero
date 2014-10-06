require 'spec_helper'

describe ReplicationsController do

  describe :new do

    it "should show page name" do
      fake_login_as
      get :new
      assigns[:page_name].should == "Add a Remote Server"
    end

  end

  it "should authenticate configuration request through internal _users database of couchdb" do
    config = { "a" => "a", "b" => "b", "c" => "c" }
    CouchSettings.instance.should_receive(:authenticate).with("rapidftr", "rapidftr").and_return(true)
    Replication.should_receive(:couch_config).and_return(config)
    post :configuration, { :user_name => "rapidftr", :password => "rapidftr" }
    target_json = JSON.parse(response.body)
    target_json.should == config
  end

  it "should render devices index page after saving a replication" do
    fake_login_as
    mock_replication = Replication.new
    Replication.should_receive(:new).and_return(mock_replication)
    mock_replication.should_receive(:save).and_return(true)
    post :create
    response.should redirect_to(replications_path)
  end

  describe "GET index" do
    # TODO: Permissions issue
    xit "fetches all the blacklisted devices but not the replication details if user have only black listed permission" do
      fake_login_as(Permission::SYSTEM)
      device = double({:user_name => "someone"})
      Device.should_receive(:view).with("by_imei").and_return([device])
      Replication.should_not_receive(:all)
      get :index
      assigns[:devices].should == [device]
    end

    xit "should not show black listed devices, if the user have only manage replication permission" do
      fake_login_as(Permission::SYSTEM)
      Device.should_not_receive(:view).with("by_imei")
      Replication.should_receive(:all)
      get :index
    end

    it "should show black listed devices and the replications if the user have both the permissions" do
      fake_login_as(Permission::SYSTEM)
      Replication.should_receive(:all)
      Device.should_receive(:view)
      get :index
    end
  end
  describe "POST update_blacklist" do
    it "should update the blacklist flag" do
      fake_login_as(Permission::SYSTEM)
      device = double()
      Device.should_receive(:find_by_device_imei).with("123").and_call_original
      Device.should_receive(:by_imei).with(:key => "123").and_return([device])
      device.should_receive(:update_attributes).with({:blacklisted => true}).and_return(true)
      post :update_blacklist, {:imei => "123", :blacklisted => "true"}
      response.body.should == "{\"status\":\"ok\"}"
    end

    it "should return failure if blacklist fails" do
      fake_login_as(Permission::SYSTEM)
      device = double()
      Device.should_receive(:find_by_device_imei).with("123").and_call_original
      Device.should_receive(:by_imei).with(:key => "123").and_return([device])
      device.should_receive(:update_attributes).with({:blacklisted => true}).and_return(false)
      post :update_blacklist, {:imei => "123", :blacklisted => "true"}
      response.body.should == "{\"status\":\"error\"}"
    end

    it "should not update the device by user without blacklist permission" do
      fake_login_as([Permission::USER, Permission::ALL])
      Device.should_not_receive(:view).with("by_imei")
      post :update_blacklist, {:imei => "123", :blacklisted => "true"}
      response.status.should == 403
    end
  end

end
