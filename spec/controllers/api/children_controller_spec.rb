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
      controller.should_receive(:can?).with(:assign, Child).and_return(false)
      controller.should_receive(:can?).with(:assign_within_agency, Child).and_return(false)
      controller.should_receive(:can?).with(:assign_within_user_group, Child).and_return(false)
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
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
      expect(assigns[:record][:id]).to eq('123')
      expect(assigns[:record].key?(:empty_array_attr)).to be_falsey
    end

    it "will discard empty arrays in the nested subforms in the JSON representation if queried from the mobile client" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', a_nested_subform: [{field1: 'A', empty_array_attr: []}]})
      Child.should_receive(:get).with("123").and_return(child)
      get :show, params: {:id => "123", :format => :json, :mobile => 'true'}
      expect(assigns[:record][:id]).to eq('123')
      expect(assigns[:record][:a_nested_subform].first.key?(:empty_array_attr)).to be_falsey
    end

    it "will not discard child array attributes" do
      child = Child.new(:module_id => 'primeromodule-cp')
      child.should_receive(:as_couch_json).and_return({module_id: 'primeromodule-cp', id: '123', nationality: ["Angola", "Antigua and Barbuda", "Argentina"]})
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
      new_uuid = SecureRandom.uuid
      put :update, params: {:id => new_uuid.to_s, :child => {:id => new_uuid.to_s, :_id => new_uuid.to_s, :last_known_location => "London", :age => "7"}}

      Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end
  end

  describe "PUT update subforms when the subform is subform_append_only and mobile param is true" do
    before :each do
      Child.all.each{|c| c.destroy}
      FormSection.all.each &:destroy
      @subform_text_field = Field.new({name: "subform_text_field", type: "text_field", display_name_en: "Subform Text Field"})
      @subform_section = FormSection.create!(unique_id: 'subform_section', name: "Subform Section", is_nested: true, editable: true, parent_form: "case", fields:[@subform_text_field], subform_append_only: true)
      @subform_field = Field.new({display_name: 'Subform Section Field', name: 'subform_section_field', type: 'subform', editable: true, subform_section_id: @subform_section.unique_id})
      @form_section_a = FormSection.create!(unique_id: "form_a", name: "Form A", parent_form: "case", fields:[@subform_field])
      Child.stub(:permitted_property_names).and_return(['subform_section'])
      # Make subform_section a valid property
      Child.couchrest_model_property :subform_section, [Class.new(){include Syncable::PrimeroEmbeddedModel}], :default => []

      @child_1 = Child.new_with_user_name(controller.current_user, {name: "Name 1", age: "5", subform_section: [{subform_text_field: 'some text 2'}]})
      @child_1.save!
    end

    it "should merge the subforms if the record already has subforms" do

      put :update, params: { format: :json, mobile: true, id: @child_1.id, _id: @child_1._id, child: { subform_section: [{subform_text_field: 'some text 2'}]}}

      expect(Child.get(@child_1.id).subform_section.size).to eq(2)
    end

    it "should not have the subforms in the response" do
      put :update, params: { format: :json, mobile: true, id: @child_1.id, _id: @child_1._id, child: { subform_section: [{subform_text_field: 'some text 2'}]}}

      json_response = JSON.parse(response.body)

      expect(json_response['subform_section']).to be_nil
    end
  end

  describe "PUT update subforms when one subform is subform_append_only and mobile param is true" do
    before :each do
      Child.all.each{|c| c.destroy}
      FormSection.all.each &:destroy
      @subform_text_field_1 = Field.new({name: "subform_text_field_1", type: "text_field", display_name_en: "Subform Text Field 1"})
      @subform_text_field_2 = Field.new({name: "subform_text_field_2", type: "text_field", display_name_en: "Subform Text Field 2"})
      @subform_section_append_only = FormSection.create!(unique_id: 'subform_append_section', name: "Subform Append Only Section", is_nested: true, editable: true, parent_form: "case", fields:[@subform_text_field_1], subform_append_only: true)
      @subform_section = FormSection.create!(unique_id: 'subform_section', name: "Subform Section", is_nested: true, editable: true, parent_form: "case", fields:[@subform_text_field_2])
      @subform_field_1 = Field.new({display_name: 'Subform Section Field 1', name: 'subform_section_field_1', type: 'subform', editable: true, subform_section_id: @subform_section_append_only.unique_id})
      @subform_field_2 = Field.new({display_name: 'Subform Section Fiel 2d', name: 'subform_section_field_2', type: 'subform', editable: true, subform_section_id: @subform_section.unique_id})
      @form_section_a = FormSection.create!(unique_id: "form_a", name: "Form A", parent_form: "case", fields:[@subform_field_1, @subform_field_2])
      Child.stub(:permitted_property_names).and_return(['subform_section', 'subform_append_section'])
      # Make subform_section a valid property
      Child.couchrest_model_property :subform_append_section, [Class.new(){include Syncable::PrimeroEmbeddedModel}], :default => []
      Child.couchrest_model_property :subform_section, [Class.new(){include Syncable::PrimeroEmbeddedModel}], :default => []

      @child_1 = Child.new_with_user_name(controller.current_user, {name: "Name 1", age: "5", subform_section: [{subform_text_field_2: 'some text 2'}],  subform_append_section: [{subform_text_field_1: 'some text 2'}]})
      @child_1.save!
    end

    it "should only merge the subforms with the field subform_append_only => true if the record already has subforms" do

      put :update, params: { format: :json, mobile: true, id: @child_1.id, _id: @child_1._id, child: { subform_section: nil, subform_append_section: [{subform_text_field_1: 'some text 1'}]}}

      expect(Child.get(@child_1.id).subform_section.size).to eq(0)
      expect(Child.get(@child_1.id).subform_append_section.size).to eq(2)
    end

    it "should only have the subforms that are not subform_append_only in the response" do

      put :update, params: { format: :json, mobile: true, id: @child_1.id, _id: @child_1._id, child: { subform_section: [{subform_text_field: 'some text 1'}], subform_append_section: [{subform_text_field_1: 'some text 1'}]}}

      json_response = JSON.parse(response.body)

      expect(json_response['subform_section'].size).to eq(1)
      expect(json_response['subform_append_section']).to be_nil
    end
  end

end
