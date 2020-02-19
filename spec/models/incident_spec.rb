require 'rails_helper'
require 'will_paginate'

describe Incident do
  before(:all) do
    clean_data(Agency, User, Child, PrimeroProgram, UserGroup, PrimeroModule, FormSection, Field)
  end

  # TODO: Fix when models validations be ready
  # it_behaves_like "a valid record" do
  #   let(:record) {
  #     fields = [
  #       Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A date field"),
  #       Field.new(:type => Field::TEXT_AREA, :name => "a_textarea", :display_name => "A text area"),
  #       Field.new(:type => Field::TEXT_FIELD, :name => "a_textfield", :display_name => "A text field"),
  #       Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield", :display_name => "A numeric field"),
  #       Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield_2", :display_name => "A second numeric field")
  #     ]
  #     FormSection.stub(:all_visible_form_fields => fields)
  #     Incident.new
  #   }
  # end

  describe 'build solar schema' do

    before(:all) do
      clean_data(FormSection, Field)
      form = create(:form_section, parent_form: "incident", is_nested: false)
      %w(approval_status_bia
         approval_status_case_plan
         approval_status_closure
         transfer_status).each {|f| create(:select_field, name: f, multi_select: false, form_section_id: form.id) }
      create(:field, :date_with_datetime, name: "created_at", form_section_id: form.id)
      create(:field, :date_range_with_datetime, name: "last_updated_at", form_section_id: form.id)
    end

    it "should build with date/time search fields" do
      expect(Incident.searchable_date_time_fields).to include("created_at", "last_updated_at")
    end

    it "fields build with all fields in form sections" do
      form = FormSection.new(:name => "test_form", :parent_form => 'incident')
      form.fields << Field.new(:name => "description", :type => Field::TEXT_FIELD, :display_name => "description")
      form.save!
      Incident.searchable_string_fields.should include("description")
      FormSection.all.each { |form_section| form_section.destroy }
    end
  end

  describe ".search" do

    before :each do
      Sunspot.remove_all(Incident)
    end

    before :all do
      form = FormSection.new(:name => "test_form", :parent_form => 'incident')
      form.fields << Field.new(:name => "description", :type => Field::TEXT_FIELD, :display_name => "description")
      form.save!
    end

    after :all do
      FormSection.all.each { |form| form.destroy }
    end

    # TODO: full text searching not implemented yet. Effects the next 13 test.

    # it "should return empty array if search is not valid" do
    #   search = double("search", :query => "", :valid? => false)
    #   Incident.search(search).should == []
    # end

    # it "should return empty array for no match" do
    #   search = double("search", :query => "Nothing", :valid? => true)
    #   Incident.search(search).should == [[],[]]
    # end

    # it "should return an exact match" do
    #   create_incident("Exact")
    #   search = double("search", :query => "Exact", :valid? => true)
    #   Incident.search(search).first.map(&:description).should == ["Exact"]
    # end

    # it "should return a match that starts with the query" do
    #   create_incident("Starts With")
    #   search = double("search", :query => "Star", :valid? => true)
    #   Incident.search(search).first.map(&:description).should == ["Starts With"]
    # end

    # it "should return a fuzzy match" do
    #   create_incident("timithy")
    #   create_incident("timothy")
    #   search = double("search", :query => "timothy", :valid? => true)
    #   Incident.search(search).first.map(&:description).should =~ ["timithy", "timothy"]
    # end

    # it "should return incidents that have duplicate as nil" do
    #   incident_active = Incident.create(:description => "eduardo aquiles", 'created_by' => "me", 'created_organization' => "stc")
    #   incident_duplicate = Incident.create(:description => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organization' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = Incident.search(search)

    #   result.first.map(&:description).should == ["eduardo aquiles"]
    # end

    # it "should return incidents that have duplicate as false" do
    #   incident_active = Incident.create(:description => "eduardo aquiles", :duplicate => false, 'created_by' => "me", 'created_organization' => "stc")
    #   incident_duplicate = Incident.create(:description => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organization' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = Incident.search(search)

    #   result.first.map(&:description).should == ["eduardo aquiles"]
    # end

    # it "should search by exact match for short id" do
    #   uuid = UUIDTools::UUID.random_create.to_s
    #   Incident.create("description" => "kev", :unique_identifier => "1234567890", 'created_by' => "me", 'created_organization' => "stc")
    #   Incident.create("description" => "kev", :unique_identifier => "0987654321", 'created_by' => "me", 'created_organization' => "stc")
    #   search = double("search", :query => "7654321", :valid? => true)
    #   results, full_results = Incident.search(search)
    #   results.length.should == 1
    #   results.first[:unique_identifier].should == "0987654321"
    # end


    # it "should match more than one word" do
    #   create_incident("timothy cochran")
    #   search = double("search", :query => "timothy cochran", :valid? => true)
    #   Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    # end

    # it "should match more than one word with fuzzy search" do
    #   create_incident("timothy cochran")
    #   search = double("search", :query => "timithy cichran", :valid? => true)
    #   Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    # end

    # it "should match more than one word with starts with" do
    #   create_incident("timothy cochran")
    #   search = double("search", :query => "timo coch", :valid? => true)
    #   Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    # end

    # it "should return the incidents registered by the user if the user has limited permission" do
    #   Incident.create(:description => "suganthi", 'created_by' => "me", 'created_organization' => "stc")
    #   Incident.create(:description => "kavitha", 'created_by' => "you", 'created_organization' => "stc")
    #   search = double("search", :query => "kavitha", :valid? => true, :page => 1)
    #   Incident.search_by_created_user(search, "you", 1).first.map(&:description).should =~ ["kavitha"]
    # end

    # it "should not return any results if a limited user searches with unique id of an incident registerd by a different user" do
    #   create_incident("suganthi", {"created_by" => "thirumani", "unique_identifier" => "thirumanixxx12345"})
    #   create_incident("kavitha", {"created_by" => "rajagopalan", "unique_identifier" => "rajagopalanxxx12345"})
    #   search = double("search", :query => "thirumanixxx12345", :valid? => true)
    #   Incident.search_by_created_user(search, "rajagopalan", 1).first.map(&:description).should =~ []
    # end


  end

  describe ".sunspot_search" do
    before :each do
      Sunspot.remove_all(Incident)
    end

    before :all do
      form = FormSection.new(:name => "test_form", :parent_form => 'incident')
      form.fields << Field.new(:name => "description", :type => Field::TEXT_FIELD, :display_name => "description")
      form.save!
    end

    after :all do
      FormSection.all.each { |form| form.destroy }
    end
  end

  describe 'save' do
    before(:all) { create(:agency) }

    it "should save with generated incident_id" do
      Incident.any_instance.stub(:field_definitions).and_return([])
      incident = create_incident_with_created_by('jdoe', 'description' => 'London')
      incident.save!
      incident.id.should_not be_nil
    end

  end

  describe "new_with_user_name" do
    before(:all) { create(:agency) }
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it "should create regular incident fields" do
      incident = create_incident_with_created_by('jdoe', 'description' => 'London', 'age' => '6')
      incident.data['description'].should == 'London'
      incident.data['age'].to_s.should == "6"
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return("bbfca678-18fc-44a4-9a0d-0764e0941316")
      incident = create_incident_with_created_by('jdoe')
      incident.save!
      incident.unique_identifier.should == "bbfca678-18fc-44a4-9a0d-0764e0941316"
    end

    it "should create a created_by field with the user name" do
      incident = create_incident_with_created_by('jdoe', 'some_field' => 'some_value')
      incident.data['created_by'].should == 'jdoe'
    end

    # it "should create a posted_at field with the current date" do
      # Clock.stub(:now).and_return(Time.utc(2010, "jan", 22, 14, 05, 0))
      # child = create_child_with_created_by('some_user', 'some_field' => 'some_value')
      # child['posted_at'].should == "2010-01-22 14:05:00UTC"
    # end

    # it "should assign name property as '' if name is not passed before saving child record" do
      # child = Child.new_with_user_name(double('user', :user_name => 'user', :organization => 'org'), {'some_field' => 'some_value'})
      # child.save
      # child = Child.get(child.id)
      # child.name.should == ''
    # end

    describe "when the created at field is not supplied" do

      it "should create a created_at field with time of creation" do
        DateTime.stub(:now).and_return(Time.utc(2010, "jan", 14, 14, 5, 0))
        incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value')
        incident.created_at.should == DateTime.parse("2010-01-14 14:05:00UTC")
      end

    end

    describe "when the created at field is supplied" do

      it "should use the supplied created at value" do
        incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC')
        incident.data['created_at'].should == "2010-01-14 14:05:00UTC"
      end
    end
  end

  describe "unique id" do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return("191fc236-71f4-4a76-be09-f2d8c442e1fd")
      incident = Incident.new
      incident.save!
      incident.unique_identifier.should == "191fc236-71f4-4a76-be09-f2d8c442e1fd"
    end

    it "should return last 7 characters of unique id as short id" do
      SecureRandom.stub("uuid").and_return("191fc236-71f4-4a76-be09-f2d8c442e1fd")
      incident = Incident.new
      incident.save!
      incident.short_id.should == "442e1fd"
    end

  end

  describe "when fetching incidents" do

    before do
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
      Incident.all.each { |incident| incident.destroy }
    end

    #TODO - verify ordering logic for INCIDENTS
    xit "should return list of incidents ordered by description" do
      SecureRandom.stub("uuid").and_return(12345)
      Incident.create('description' => 'Zxy', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Azz', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Abc', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Amm', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Bbb', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      incidents = Incident.all.all
      incidents.first['description'].should == 'Abc'
      incidents.last['description'].should == 'Zxy'
    end

    xit "should order incidents with blank descriptions first" do
      SecureRandom.stub("uuid").and_return(12345)
      Incident.create('description' => 'Zxy', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => '', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Azz', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Abc', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Amm', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      Incident.create('description' => 'Bbb', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      incidents = Incident.all
      incidents.first['description'].should == ''
      incidents.last['description'].should == 'Zxy'
    end

  end

  describe 'organization' do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it 'should get created user' do
      incident = Incident.new
      incident.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      incident.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organization => 'UNICEF'))
      incident = Incident.create 'description' => 'My Test Incident Description', :created_by => "mj"

      incident.created_organization.should == 'UNICEF'
    end
  end

  describe "Batch processing" do
    before do
      Incident.all.each { |incident| incident.destroy }
    end

    it "should process in two batches" do
      incident1 = Incident.new('created_by' => "user1")
      incident2 = Incident.new('created_by' => "user2")
      incident3 = Incident.new('created_by' => "user3")
      incident4 = Incident.new('created_by' => "user4")
      incident4.save!
      incident3.save!
      incident2.save!
      incident1.save!

      expect(Incident.all.paginate(:page => 1, :per_page => 3)).to match_array([incident4, incident3, incident2])
      expect(Incident.all.paginate(:page => 2, :per_page => 3)).to match_array([incident1])

      records = []
      Incident.all.each_slice(3) do |incidents|
        incidents.each{|i| records << i.data["created_by"]}
      end
      records.should eq(["user1", "user2", "user3", "user4"].reverse)
    end

    it "should process in 0 batches" do
      # Incident.should_receive(:all).exactly(1).times.and_call_original
      records = []
      Incident.all.each_slice(3) do |incidents|
        incidents.each{|i| records << i.data["created_by"]}
      end
      records.should eq([])
    end

  end

  private

  def create_incident(description, options={})
    options.merge!("description" => description, 'created_by' => "me", 'created_organization' => "stc")
    Incident.create(options)
  end

  def create_duplicate(parent)
    duplicate = Incident.create(:description => "dupe")
    duplicate.mark_as_duplicate(parent['short_id'])
    duplicate.save!
    duplicate
  end

  def create_incident_with_created_by(created_by,options = {})
    user = User.new(user_name: created_by, agency_id: Agency.last.id )
    Incident.new_with_user(user, options)
  end
end
