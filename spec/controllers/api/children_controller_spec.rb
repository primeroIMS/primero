require 'spec_helper'

describe ChildrenController do

  before :each do
    Child.any_instance.stub(:field_definitions).and_return([])
    fake_admin_login
  end

  describe '#authorizations' do
    it "should fail GET index when unauthorized" do
      @controller.current_ability.should_receive(:can?).with(:index, Child).and_return(false)
      get :index
      response.should be_forbidden
    end

    it "should fail GET show when unauthorized" do
      child = Child.create(:short_id => 'short_id', :created_by => "fakeadmin")
      child_arg = hash_including("_id" => child.id)

      @controller.current_ability.should_receive(:can?).with(:read, child_arg).and_return(false)
      get :show, :id => child.id, :format => :json
      response.should be_forbidden
    end

    it "should fail to POST create when unauthorized" do
      @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false)
      post :create
      response.should be_forbidden
    end
  end

  describe "GET index" do
    it "should render all children as json" do
      controller.should_receive(:retrieve_records_and_total) {|*args| [double(:to_json => "all the children"), 0] }

      get :index, :format => :json

      response.body.should == "all the children"
    end
  end

  describe "GET show" do
    it "should render a child record as json" do
      Child.should_receive(:get).with("123").and_return(mock_model(Child, :to_json => "a child record"))
      get :show, :id => "123", :format => :json
      response.body.should == "a child record"
    end

    it "should return a 404 with empty body if no child record is found" do
      Child.should_receive(:get).with("123").and_return(nil)
      get :show, :id => "123", :format => :json
      response.response_code.should == 404
      response.body.should == ""
    end

  end

  describe "POST create" do
    it "should update the child record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'old name'})
      child.save!
      controller.stub(:authorize!)

      post :create, :child => {:unique_identifier => child.unique_identifier, :name => 'new name'}, :format => :json

      updated_child = Child.by_short_id(:key => child.short_id)
      updated_child.rows.size.should == 1
      updated_child.first.name.should == 'new name'
    end
  end

  describe "PUT update" do
    it "should allow a records ID to be specified to create a new record with a known id" do
      new_uuid = UUIDTools::UUID.random_create()
      put :update, :id => new_uuid.to_s, :child => {:id => new_uuid.to_s, :_id => new_uuid.to_s, :last_known_location => "London", :age => "7"}

      Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end
  end

end
