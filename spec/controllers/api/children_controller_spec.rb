require 'rails_helper'

describe ChildrenController do

  before do
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: "en",
      primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  before :each do
    Child.any_instance.stub(:field_definitions).and_return([])
    Child.any_instance.stub(:permitted_properties).and_return(Child.properties)
    Child.any_instance.stub(:given_consent).and_return(false)
    fake_admin_login
  end

  describe '#authorizations' do
    it "should fail GET index when unauthorized" do
      Ability.any_instance.stub(:can?).with(anything, Child).and_return(false)
      Ability.any_instance.stub(:can?).with(anything, Dashboard).and_return(false)
      get :index
      expect(response).to be_forbidden
    end

    it "should fail GET show when unauthorized" do
      child = Child.create(:short_id => 'short_id', :created_by => "fakeadmin")
      @controller.current_ability.should_receive(:can?).with(:read, child).and_return(false)
      get :show, params: {:id => child.id, :format => :json}
      response.should be_forbidden
    end

    it "should fail to POST create when unauthorized" do
      @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false)
      post :create
      response.should be_forbidden
    end
  end

  describe "GET index" do
    before :each do
      Child.all.each{|c| c.destroy}
      @c1 = Child.new(id: 'child1', marked_for_mobile: true, module_id: 'cp')
      @c2 = Child.new(id: 'child2', marked_for_mobile: true, module_id: 'cp')
      @c3 = Child.new(id: 'child3', marked_for_mobile: false, module_id: 'cp')
      children = [@c1, @c2, @c3]
      children.each{|c| c.stub(:format_json_response).and_return(c)}
      Child.any_instance.stub(:module).and_return(PrimeroModule::cp)
      Child.stub(:permitted_property_names).and_return(@c1.attributes.keys)
      ChildrenController.any_instance.stub(:retrieve_records_and_total).and_return([children, 3])
    end

    it "should filter out all the non-mobile records" do
      get :index, params: {format: :json, mobile: 'true'}
      #What is returned isn't the entire Case record, but a stripped down version with only the populated fields
      expect(assigns[:records]).to match_array([{"module_id"=>"cp",
                                                "record_state"=>true,
                                                "marked_for_mobile"=>true,
                                                "hidden_name"=>false,
                                                "workflow"=>"new",
                                                "case_status_reopened"=>false,
                                                "system_generated_followup"=>false,
                                                "_id"=>"child1",
                                                "couchrest-type"=>"Child"},
                                               {"module_id"=>"cp",
                                                "record_state"=>true,
                                                "marked_for_mobile"=>true,
                                                "hidden_name"=>false,
                                                "workflow"=>"new",
                                                "case_status_reopened"=>false,
                                                "system_generated_followup"=>false,
                                                "_id"=>"child2",
                                                "couchrest-type"=>"Child"}])
    end

    it "should return ids of all mobile-syncable records when using the ids parameter" do
      get :index, params: {format: :json, mobile: 'true', ids: 'true'}
      expect(assigns[:records]).to match_array(['child1', 'child2'])
    end
  end

  describe "GET index integration", :type => :request do
    it "should render all children as json" do
      get '/api/children'
      expect(response.content_type.to_s).to eq('application/json')
    end
  end

  describe "GET show" do
    it "will return the underlying CouchDB JSON representation if queried from the mobile client" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', some_array: []})
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
    end

    it "will discard empty arrays in the JSON representation if queried from the mobile client" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', empty_array_attr: []})
      Child.stub(:permitted_property_names).and_return(%w[module_id id empty_array_attr])
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
      expect(assigns[:record][:id]).to eq('123')
      expect(assigns[:record].key?(:empty_array_attr)).to be_falsey
    end

    it "will discard empty arrays in the nested subforms in the JSON representation if queried from the mobile client" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', a_nested_subform: [{field1: 'A', empty_array_attr: []}]})
      Child.stub(:permitted_property_names).and_return(%w[module_id id a_nested_subform])
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
      expect(assigns[:record][:id]).to eq('123')
      expect(assigns[:record][:a_nested_subform].first.key?(:empty_array_attr)).to be_falsey
    end

    it "will not discard child array attributes" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', nationality: ["Angola", "Antigua and Barbuda", "Argentina"]})
      Child.stub(:permitted_property_names).and_return(%w[module_id id nationality])
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
      expect(assigns[:record][:id]).to eq('123')
      expect(assigns[:record][:nationality]).to match_array(["Angola", "Antigua and Barbuda", "Argentina"])
    end

    it "should return a 404 with empty body if no child record is found" do
      Child.should_receive(:get).with("123").and_return(nil)
      get :show, params: {:id => "123", :format => :json}
      response.response_code.should == 404
      response.body.should == ""
    end

  end

  describe "GET show integration", :type => :request do
    it "should render a child record as json" do
      get '/api/children', params: {id: '123'}
      expect(response.content_type.to_s).to eq('application/json')
    end
  end

  describe "POST create" do
    it "should update the child record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      Child.stub(:permitted_property_names).and_return(['name', 'unique_identifier'])
      child = Child.new_with_user_name(user, {:name => 'old name'})
      child.save!
      controller.stub(:authorize!)
      post :create, params: {:child => {:unique_identifier => child.unique_identifier, :name => 'new name'}, :format => :json}

      updated_child = Child.by_short_id(:key => child.short_id)
      updated_child.rows.size.should == 1
      updated_child.first.name.should == 'new name'
    end

  end

  describe "PUT update" do
    it "should allow a records ID to be specified to create a new record with a known id" do
      new_uuid = UUIDTools::UUID.random_create()
      put :update, params: {:id => new_uuid.to_s, :child => {:id => new_uuid.to_s, :_id => new_uuid.to_s, :last_known_location => "London", :age => "7"}}

      Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end
  end

end
