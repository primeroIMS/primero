require 'spec_helper'

describe Incident do

  describe 'build solar schema' do

    it "should build with free text search fields" do
      Field.stub(:all_searchable_field_names).and_return []
      Incident.build_text_fields_for_solar.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name","created_organisation"]
    end

    it "should build with date search fields" do
      Incident.build_date_fields_for_solar.should == ["created_at", "last_updated_at"]
    end

    it "fields build with all fields in form sections" do
      form = FormSection.new(:name => "test_form", :parent_form => 'incident')
      form.fields << Field.new(:name => "description", :type => Field::TEXT_FIELD, :display_name => "description")
      form.save!
      Incident.build_text_fields_for_solar.should include("description")
      FormSection.all.each { |form_section| form_section.destroy }
    end

    it "should call Sunspot with all fields" do
      Sunspot.should_receive(:setup)
      Incident.should_receive(:build_text_fields_for_solar)
      Incident.should_receive(:build_date_fields_for_solar)
      Incident.build_solar_schema
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

    it "should return empty array if search is not valid" do
      search = double("search", :query => "", :valid? => false)
      Incident.search(search).should == []
    end

    it "should return empty array for no match" do
      search = double("search", :query => "Nothing", :valid? => true)
      Incident.search(search).should == [[],[]]
    end

    it "should return an exact match" do
      create_incident("Exact")
      search = double("search", :query => "Exact", :valid? => true)
      Incident.search(search).first.map(&:description).should == ["Exact"]
    end

    it "should return a match that starts with the query" do
      create_incident("Starts With")
      search = double("search", :query => "Star", :valid? => true)
      Incident.search(search).first.map(&:description).should == ["Starts With"]
    end

    it "should return a fuzzy match" do
      create_incident("timithy")
      create_incident("timothy")
      search = double("search", :query => "timothy", :valid? => true)
      Incident.search(search).first.map(&:description).should =~ ["timithy", "timothy"]
    end

    # it "should return children that have duplicate as nil" do
      # child_active = Child.create(:name => "eduardo aquiles", 'created_by' => "me", 'created_organisation' => "stc")
      # child_duplicate = Child.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")
# 
      # search = double("search", :query => "aquiles", :valid? => true)
      # result = Child.search(search)
# 
      # result.first.map(&:name).should == ["eduardo aquiles"]
    # end
# 
    # it "should return children that have duplicate as false" do
      # child_active = Child.create(:name => "eduardo aquiles", :duplicate => false, 'created_by' => "me", 'created_organisation' => "stc")
      # child_duplicate = Child.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")
# 
      # search = double("search", :query => "aquiles", :valid? => true)
      # result = Child.search(search)
# 
      # result.first.map(&:name).should == ["eduardo aquiles"]
    # end
# 
    it "should search by exact match for short id" do
      uuid = UUIDTools::UUID.random_create.to_s
      Incident.create("description" => "kev", :unique_identifier => "1234567890", 'created_by' => "me", 'created_organisation' => "stc")
      Incident.create("description" => "kev", :unique_identifier => "0987654321", 'created_by' => "me", 'created_organisation' => "stc")
      search = double("search", :query => "7654321", :valid? => true)
      results, full_results = Incident.search(search)
      results.length.should == 1
      results.first[:unique_identifier].should == "0987654321"
    end


    it "should match more than one word" do
      create_incident("timothy cochran")
      search = double("search", :query => "timothy cochran", :valid? => true)
      Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    end

    it "should match more than one word with fuzzy search" do
      create_incident("timothy cochran")
      search = double("search", :query => "timithy cichran", :valid? => true)
      Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    end

    it "should match more than one word with starts with" do
      create_incident("timothy cochran")
      search = double("search", :query => "timo coch", :valid? => true)
      Incident.search(search).first.map(&:description).should =~ ["timothy cochran"]
    end

    it "should return the incidents registered by the user if the user has limited permission" do
      Incident.create(:description => "suganthi", 'created_by' => "me", 'created_organisation' => "stc")
      Incident.create(:description => "kavitha", 'created_by' => "you", 'created_organisation' => "stc")
      search = double("search", :query => "kavitha", :valid? => true, :page => 1)
      Incident.search_by_created_user(search, "you", 1).first.map(&:description).should =~ ["kavitha"]
    end

    it "should not return any results if a limited user searches with unique id of an incident registerd by a different user" do
      create_incident("suganthi", {"created_by" => "thirumani", "unique_identifier" => "thirumanixxx12345"})
      create_incident("kavitha", {"created_by" => "rajagopalan", "unique_identifier" => "rajagopalanxxx12345"})
      search = double("search", :query => "thirumanixxx12345", :valid? => true)
      Incident.search_by_created_user(search, "rajagopalan", 1).first.map(&:description).should =~ []
    end


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


    it "should return all results" do
      40.times do
        create_incident("Exact")
      end
      criteria_list = SearchCriteria.build_from_params("1" => {:field => "description", :value => "Exact", :join => "AND", :display_name => "description" } )
      query = SearchCriteria.lucene_query(criteria_list)
      Incident.sunspot_search(1, query).last.count.should == 40
    end
  end

  describe "update_properties_with_user_name" do

    # it "should replace old properties with updated ones" do
      # child = Child.new("name" => "Dave", "age" => "28", "last_known_location" => "London")
      # new_properties = {"name" => "Dave", "age" => "35"}
      # child.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      # child['age'].should == "35"
      # child['name'].should == "Dave"
      # child['last_known_location'].should == "London"
    # end
# 
    # it "should not replace old properties when updated ones have nil value" do
      # child = Child.new("origin" => "Croydon", "last_known_location" => "London")
      # new_properties = {"origin" => nil, "last_known_location" => "Manchester"}
      # child.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      # child['last_known_location'].should == "Manchester"
      # child['origin'].should == "Croydon"
    # end
# 
    # it "should not replace old properties when the existing records last_updated at is latest than the given last_updated_at" do
      # child = Child.new("name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      # given_properties = {"name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC"}
      # child.update_properties_with_user_name "some_user", nil, nil, nil, false, given_properties
      # child["name"].should == "existing name"
      # child["last_updated_at"].should == "2013-01-01 00:00:01UTC"
    # end
# 
    # it "should merge the histories of the given record with the current record if the last updated at of current record is greater than given record's" do
      # existing_histories = JSON.parse "{\"user_name\":\"rapidftr\", \"datetime\":\"2013-01-01 00:00:01UTC\",\"changes\":{\"sex\":{\"to\":\"male\",\"from\":\"female\"}}}"
      # given_histories = [existing_histories, JSON.parse("{\"user_name\":\"rapidftr\",\"datetime\":\"2012-01-01 00:00:02UTC\",\"changes\":{\"name\":{\"to\":\"new\",\"from\":\"old\"}}}")]
      # child = Child.new("name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" =>  [existing_histories])
      # given_properties = {"name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => given_histories}
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      # histories = child["histories"]
      # histories.size.should == 2
      # histories.first["changes"]["sex"]["from"].should == "female"
      # histories.last["changes"]["name"]["to"].should == "new"
    # end
# 
    # it "should delete the newly created media history(current_photo_key and recorded_audio) as the media names are changed before save of child record" do
      # existing_histories = JSON.parse "{\"user_name\":\"rapidftr\", \"datetime\":\"2013-01-01 00:00:01UTC\",\"changes\":{\"sex\":{\"to\":\"male\",\"from\":\"female\"}}}"
      # given_histories = [existing_histories,
                         # JSON.parse("{\"datetime\":\"2013-02-04 06:55:03\",\"user_name\":\"rapidftr\",\"changes\":{\"current_photo_key\":{\"to\":\"2c097fa8-b9ab-4ae8-aa4d-1b7bda7dcb72\",\"from\":\"photo-364416240-2013-02-04T122424\"}},\"user_organisation\":\"N\\/A\"}"),
                         # JSON.parse("{\"datetime\":\"2013-02-04 06:58:12\",\"user_name\":\"rapidftr\",\"changes\":{\"recorded_audio\":{\"to\":\"9252364d-c011-4af0-8739-0b1e9ed5c0ad1359961089870\",\"from\":\"\"}},\"user_organisation\":\"N\\/A\"}")
                        # ]
      # child = Child.new("name" => "existing name", "last_updated_at" => "2013-12-12 00:00:01UTC", "histories" =>  [existing_histories])
      # given_properties = {"name" => "given name", "last_updated_at" => "2013-01-01 00:00:00UTC", "histories" => given_histories}
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      # histories = child["histories"]
      # histories.size.should == 1
      # histories.first["changes"]["current_photo_key"].should be_nil
    # end
# 
    # it "should assign the history of the given properties as it is if the current record has no history" do
      # child = Child.new("name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      # given_properties = {"name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      # histories = child["histories"]
      # histories.last["changes"]["name"]["to"].should == "new"
    # end

    # This spec is almost always failing randomly, need to fix this spec if possible or think of other ways to test this?
    # xit "should not add changes to history if its already added to the history" do
      # FormSection.stub(:all_visible_form_fields =>
                            # [Field.new(:type => Field::TEXT_FIELD, :name => "name", :display_name => "Name"),
                             # Field.new(:type => Field::CHECK_BOXES, :name => "not_name")])
      # child = Child.new("name" => "old", "last_updated_at" => "2012-12-12 00:00:00UTC")
      # child.save!
      # sleep 1
      # changed_properties = {"name" => "new", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      # child.save!
      # sleep 1
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      # child.save!
      # child["histories"].size.should == 1
    # end

    it "should populate last_updated_by field with the user_name who is updating" do
      incident = Incident.new
      incident.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      incident['last_updated_by'].should == 'jdoe'
    end


    it "should assign histories order by datetime of history" do
      incident = Incident.new()
      first_history = double("history", :[] => "2010-01-01 01:01:02UTC")
      second_history = double("history", :[] => "2010-01-02 01:01:02UTC")
      third_history = double("history", :[] => "2010-01-02 01:01:03UTC")
      incident["histories"] = [first_history, second_history, third_history]
      incident.ordered_histories.should == [third_history, second_history, first_history]
    end

    it "should populate last_updated_at field with the time of the update" do
      Clock.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      incident = Incident.new
      incident.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      incident['last_updated_at'].should == "2010-01-17 19:05:00UTC"
    end

    # it "should set flagged_at if the record has been flagged" do
      # Clock.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      # child = create_child("timothy cochran")
      # child.update_properties_with_user_name 'some user name', nil, nil, nil, false, {:flag => true}
      # child.flag_at.should == "2010-01-17 19:05:00UTC"
    # end

    # it "should set reunited_at if the record has been reunited" do
      # Clock.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      # child = create_child("timothy cochran")
      # child.update_properties_with_user_name 'some user name', nil, nil, nil, false, {:reunited => true}
      # child.reunited_at.should == "2010-01-17 19:05:00UTC"
    # end    

  end

  describe "validation" do
    # Next 3 tests no longer valid
    # context "child with only a photo registered" do
    #   before :each do
    #     User.stub(:find_by_user_name).and_return(double(:organisation => 'stc'))
    #   end
    #
    #   it 'should not be able to delete photo of child  with only one photo' do
    #     child = Child.new
    #     child.photo = uploadable_photo
    #     child.save
    #     child.delete_photos [child.primary_photo.name]
    #     child.should_not be_valid
    #     child.errors[:validate_has_at_least_one_field_value].should == ["Please fill in at least one field or upload a file"]
    #   end
    # end

    # it "should fail to validate if all fields are nil" do
    #   child = Child.new
    #   FormSection.stub(:all_visible_form_fields).and_return [Field.new(:type => 'numeric_field', :name => 'height', :display_name => "height")]
    #   child.should_not be_valid
    #   child.errors[:validate_has_at_least_one_field_value].should == ["Please fill in at least one field or upload a file"]
    # end

    # it "should fail to validate if all fields on child record are the default values" do
    #   child = Child.new({:height=>"",:reunite_with_mother=>""})
    #   FormSection.stub(:all_visible_form_fields).and_return [
    #     Field.new(:type => Field::NUMERIC_FIELD, :name => 'height'),
    #     Field.new(:type => Field::RADIO_BUTTON, :name => 'reunite_with_mother'),
    #     Field.new(:type => Field::PHOTO_UPLOAD_BOX, :name => 'current_photo_key') ]
    #     child.should_not be_valid
    #     child.errors[:validate_has_at_least_one_field_value].should == ["Please fill in at least one field or upload a file"]
    # end

    # it "should validate numeric types" do
      # field = Field.new({:type => 'numeric_field', :name => 'height', :display_name => "height"})
      # field.should_receive(:form).and_return(FormSection.new)
      # child = Child.new
      # child[:height] = "very tall"
      # FormSection.stub(:all_visible_form_fields).and_return([field])
# 
      # child.should_not be_valid
      # child.errors[:height].should == ["height must be a valid number"]
    # end
# 
    # it "should validate multiple numeric types" do
      # fields = [
                # Field.new({:type => 'numeric_field', :name => 'height', :display_name => "height"}),
                # Field.new({:type => 'numeric_field', :name => 'new_age', :display_name => "new age"})
               # ].each do |field|
        # field.should_receive(:form).and_return(FormSection.new)
      # end
        # child = Child.new
        # child[:height] = "very tall"
        # child[:new_age] = "very old"
        # FormSection.stub(:all_visible_form_fields).and_return(fields)
# 
        # child.should_not be_valid
        # child.errors[:height].should == ["height must be a valid number"]
        # child.errors[:new_age].should == ["new age must be a valid number"]
    # end

    it "should disallow text field values to be more than 200 chars" do
      fields = [Field.new(:type => Field::TEXT_FIELD, :name => "description", :display_name => "Description"),
                               Field.new(:type => Field::CHECK_BOXES, :name => "not_name")]
      fields[0].should_receive(:form).and_return(FormSection.new)
      FormSection.stub(:all_visible_form_fields => fields)
      incident = Incident.new :description => ('a' * 201)
      incident.should_not be_valid
      incident.errors[:description].should == ["Description cannot be more than 200 characters long"]
    end

    it "should disallow text area values to be more than 400,000 chars" do
      field = Field.new(:type => Field::TEXT_AREA, :name => "a_textfield", :display_name => "A textfield")
      field.should_receive(:form).and_return(FormSection.new)
      FormSection.stub(:all_visible_form_fields => [field])
                        incident = Incident.new :a_textfield => ('a' * 400_001)
                        incident.should_not be_valid
                        incident.errors[:a_textfield].should == ["A textfield cannot be more than 400000 characters long"]
    end

    it "should allow text area values to be 400,000 chars" do
      FormSection.stub(:all_visible_incident_fields =>
                        [Field.new(:type => Field::TEXT_AREA, :name => "a_textfield", :display_name => "A textfield")])
                        incident = Incident.new :a_textfield => ('a' * 400_000)
                        incident.should be_valid
    end

    it "should allow date fields formatted as dd M yy" do
      FormSection.stub(:all_visible_incident_fields =>
                        [Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A datefield")])
                        incident = Incident.new :a_datefield => ('27 Feb 2010')
                        incident.should be_valid
    end

    it "should pass numeric fields that are valid numbers to 1 dp" do
      FormSection.stub(:all_visible_incident_fields =>
                        [Field.new(:type => Field::NUMERIC_FIELD, :name => "height")])
                        Incident.new(:height => "10.2").should be_valid
    end 

    it "created_at should be a be a valid ISO date" do
      incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => 'I am not a date')
      incident.should_not be_valid
      incident['created_at']='2010-01-14 14:05:00UTC'
      incident.should be_valid
    end

    it "last_updated_at should be a be a valid ISO date" do
      incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value', 'last_updated_at' => 'I am not a date')
      incident.should_not be_valid
      incident['last_updated_at']='2010-01-14 14:05:00UTC'
      incident.should be_valid
    end

    # describe "validate_duplicate_of" do
      # it "should validate duplicate_of field present when duplicate flag true" do
        # child = Child.new('duplicate' => true, 'duplicate_of' => nil)
        # child.should_not be_valid
        # child.errors[:duplicate].should include("A valid duplicate ID must be provided")
      # end
# 
      # it "should not validate duplicate_of field present when duplicate flag is false" do
        # child = Child.new('duplicate' => false, 'duplicate_of' => nil)
        # child.valid?
        # child.errors[:duplicate].should_not include("A valid duplicate ID must be provided")
      # end
    # end
  end


  describe 'save' do

    it "should save with generated incident_id" do
      incident = create_incident_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6')
      incident.save!
      incident[:incident_id].should_not be_nil
      # incident[:registration_date].should_not be_nil
    end

    # it "should allow edit registration_date" do
      # child = create_child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6', 'registration_date' => '19/Jul/2014')
      # child.save!
      # child[:case_id].should_not be_nil
      # child[:registration_date].should eq '19/Jul/2014'
    # end

  end

  describe "new_with_user_name" do

    # it "should create regular incident fields" do
      # incident = create_incident_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6')
      # child['last_known_location'].should == 'London'
      # child['age'].should == '6'
    # end

    it "should create a unique id" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      incident = create_incident_with_created_by('jdoe')
      incident['unique_identifier'].should == "12345"
    end

    it "should not create a unique id if already exists" do
      incident = create_incident_with_created_by('jdoe', 'unique_identifier' => 'primeroxxx5bcde')
      incident['unique_identifier'].should == "primeroxxx5bcde"
    end

    it "should create a created_by field with the user name" do
      incident = create_incident_with_created_by('jdoe', 'some_field' => 'some_value')
      incident['created_by'].should == 'jdoe'
    end

    # it "should create a posted_at field with the current date" do
      # Clock.stub(:now).and_return(Time.utc(2010, "jan", 22, 14, 05, 0))
      # child = create_child_with_created_by('some_user', 'some_field' => 'some_value')
      # child['posted_at'].should == "2010-01-22 14:05:00UTC"
    # end

    # it "should assign name property as '' if name is not passed before saving child record" do
      # child = Child.new_with_user_name(double('user', :user_name => 'user', :organisation => 'org'), {'some_field' => 'some_value'})
      # child.save
      # child = Child.get(child.id)
      # child.name.should == ''
    # end

    describe "when the created at field is not supplied" do

      it "should create a created_at field with time of creation" do
        Clock.stub(:now).and_return(Time.utc(2010, "jan", 14, 14, 5, 0))
        incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value')
        incident['created_at'].should == "2010-01-14 14:05:00UTC"
      end

    end

    describe "when the created at field is supplied" do

      it "should use the supplied created at value" do
        incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC')
        incident['created_at'].should == "2010-01-14 14:05:00UTC"
      end
    end
  end

  describe "unique id" do
    it "should create a unique id" do
      incident = Incident.new
      UUIDTools::UUID.stub("random_create").and_return(12345)
      incident.create_unique_id
      incident["unique_identifier"].should == "12345"
    end

    it "should return last 7 characters of unique id as short id" do
      incident = Incident.new
      UUIDTools::UUID.stub("random_create").and_return(1212127654321)
      incident.create_unique_id
      incident.short_id.should == "7654321"
    end

  end
  

  describe "history log" do

    before do
      fields = [
          Field.new_text_field("last_known_location"),
          Field.new_text_field("age"),
          Field.new_text_field("origin"),
          Field.new_radio_button("gender", ["male", "female"])]
      FormSection.stub(:all_visible_incident_fields).and_return(fields)
      mock_user = double({:organisation => 'UNICEF'})
      User.stub(:find_by_user_name).with(anything).and_return(mock_user)
    end

    it "should add a history entry when a record is created" do
      incident = Incident.create('last_known_location' => 'New York', 'created_by' => "me")
      incident['histories'].size.should be 1
      incident["histories"][0].should == {"changes"=>{"incident"=>{:created=>nil}}, "datetime"=>nil, "user_name"=>"me", "user_organisation"=>"UNICEF"}
    end

    # it "should update history with 'from' value on last_known_location update" do
      # incident = Incident.create('last_known_location' => 'New York', 'created_by' => "me")
      # incident['last_known_location'] = 'Philadelphia'
      # incident.save!
      # changes = incident['histories'].first['changes']
      # changes['last_known_location']['from'].should == 'New York'
    # end
# 
    # it "should update history with 'to' value on last_known_location update" do
      # incident = Incident.create('last_known_location' => 'New York', 'created_by' => "me")
      # incident['last_known_location'] = 'Philadelphia'
      # incident.save!
      # changes = incident['histories'].first['changes']
      # changes['last_known_location']['to'].should == 'Philadelphia'
    # end

    # it "should update history with 'from' value on age update" do
      # child = Child.create('age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      # child['age'] = '6'
      # child.save!
      # changes = child['histories'].first['changes']
      # changes['age']['from'].should == '8'
    # end

    # it "should update history with 'to' value on age update" do
      # child = Child.create('age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      # child['age'] = '6'
      # child.save!
      # changes = child['histories'].first['changes']
      # changes['age']['to'].should == '6'
    # end

    # it "should update history with a combined history record when multiple fields are updated" do
      # child = Child.create('age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      # child['age'] = '6'
      # child['last_known_location'] = 'Philadelphia'
      # child.save!
      # child['histories'].size.should == 2
      # changes = child['histories'].first['changes']
      # changes['age']['from'].should == '8'
      # changes['age']['to'].should == '6'
      # changes['last_known_location']['from'].should == 'New York'
      # changes['last_known_location']['to'].should == 'Philadelphia'
    # end

    it "should not record anything in the history if a save occured with no changes" do
      incident = Incident.create('last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      loaded_incident = Incident.get(incident.id)
      loaded_incident.save!
      incident['histories'].size.should be 1
    end

    it "should not record empty string in the history if only change was spaces" do
      incident = Incident.create('origin' => '', 'last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      incident['origin'] = '    '
      incident.save!
      incident['histories'].size.should be 1
    end

    it "should not record history on populated field if only change was spaces" do
      incident = Incident.create('last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      incident['last_known_location'] = ' New York   '
      incident.save!
      incident['histories'].size.should be 1
    end

    # it "should record history for newly populated field that previously was null" do
      # # gender is the only field right now that is allowed to be nil when creating child document
      # child = Child.create('gender' => nil, 'last_known_location' => 'London', 'photo' => uploadable_photo, 'created_by' => "me", 'created_organisation' => "stc")
      # child['gender'] = 'Male'
      # child.save!
      # child['histories'].first['changes']['gender']['from'].should be_nil
      # child['histories'].first['changes']['gender']['to'].should == 'Male'
    # end

    it "should apend latest history to the front of histories" do
      incident = Incident.create('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      incident['last_known_location'] = 'New York'
      incident.save!
      incident['last_known_location'] = 'Philadelphia'
      incident.save!
      incident['histories'].size.should == 3
      incident['histories'][0]['changes']['last_known_location']['to'].should == 'Philadelphia'
      incident['histories'][1]['changes']['last_known_location']['to'].should == 'New York'
    end

    it "should update history with username from last_updated_by" do
      incident = Incident.create('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      incident['last_known_location'] = 'Philadelphia'
      incident['last_updated_by'] = 'some_user'
      incident.save!
      incident['histories'].first['user_name'].should == 'some_user'
      incident['histories'].first['user_organisation'].should == 'UNICEF'
    end

    it "should update history with the datetime from last_updated_at" do
      child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      child['last_known_location'] = 'Philadelphia'
      child['last_updated_at'] = '2010-01-14 14:05:00UTC'
      child.save!
      child['histories'].first['datetime'].should == '2010-01-14 14:05:00UTC'
    end

  end

  #describe "when fetching children" do

    #before do
      #User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
      #Incident.all.each { |incident| child.destroy }
    #end

    #it "should return list of children ordered by name" do
      #UUIDTools::UUID.stub("random_create").and_return(12345)
      #Child.create('photo' => uploadable_photo, 'name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      #Child.create('photo' => uploadable_photo, 'name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      #childrens = Child.all
      #childrens.first['name'].should == 'Abu'
    #end

    #it "should order children with blank names first" do
      #UUIDTools::UUID.stub("random_create").and_return(12345)
      #Child.create('photo' => uploadable_photo, 'name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      #Child.create('photo' => uploadable_photo, 'name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      #Child.create('photo' => uploadable_photo, 'name' => '', 'last_known_location' => 'POA')
      #childrens = Child.all
      #childrens.first['name'].should == ''
      #Child.all.size.should == 3
    #end

  #end

  
  #context "duplicate" do
    #before do
      #Child.all.each { |child| child.destroy }
      #Child.duplicates.each { |child| child.destroy }
      #User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
    #end
#
    #describe "mark_as_duplicate" do
      #it "should set the duplicate field" do
        #child_duplicate = Child.create('name' => "Jaco", 'unique_identifier' => 'jacoxxabcde','short_id' => "abcde12", 'created_by' => "me", 'created_organisation' => "stc")
        #child_active = Child.create('name' => 'Jacobus', 'unique_identifier' => 'jacobusxxxunique', 'short_id'=> 'nique12', 'created_by' => "me", 'created_organisation' => "stc")
        #child_duplicate.mark_as_duplicate child_active['short_id']
        #child_duplicate.duplicate?.should be_true
        #child_duplicate.duplicate_of.should == child_active.id
      #end
#
      #it "should set not set the duplicate field if child " do
        #child_duplicate = Child.create('name' => "Jaco", 'unique_identifier' => 'jacoxxxunique')
        #child_duplicate.mark_as_duplicate "I am not a valid id"
        #child_duplicate.duplicate_of.should be_nil
      #end
#
      #it "should set the duplicate field" do
        #child_duplicate = Child.create('name' => "Jaco", 'unique_identifier' => 'jacoxxabcde','short_id' => "abcde12", 'created_by' => "me", 'created_organisation' => "stc")
        #child_active = Child.create('name' => 'Jacobus', 'unique_identifier' => 'jacobusxxxunique','short_id'=> 'nique12', 'created_by' => "me", 'created_organisation' => "stc")
        #child_duplicate.mark_as_duplicate child_active['short_id']
        #child_duplicate.duplicate?.should be_true
        #child_duplicate.duplicate_of.should == child_active.id
      #end
    #end
#
      #it "should return all duplicate records" do
        #record_active = Child.create(:name => "not a dupe", :unique_identifier => "someids",'short_id'=> 'someids', 'created_by' => "me", 'created_organisation' => "stc")
        #record_duplicate = create_duplicate(record_active)
#
        #duplicates = Child.duplicates_of(record_active.id)
        #all = Child.all
#
        #duplicates.size.should be 1
        #all.size.should be 1
        #duplicates.first.id.should == record_duplicate.id
        #all.first.id.should == record_active.id
      #end
#
      #it "should return duplicate from a record" do
        #record_active = Child.create(:name => "not a dupe", :unique_identifier => "someids",'short_id'=> 'someids', 'created_by' => "me", 'created_organisation' => "stc")
        #record_duplicate = create_duplicate(record_active)
#
        #duplicates = Child.duplicates_of(record_active.id)
        #duplicates.size.should be 1
        #duplicates.first.id.should == record_duplicate.id
      #end
#
  #end

  describe 'organisation' do
    it 'should get created user' do
      incident = Incident.new
      incident['created_by'] = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      incident.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organisation => 'UNICEF'))
      incident = Incident.create 'description' => 'My Test Incident Description', :created_by => "mj"

      incident.created_organisation.should == 'UNICEF'
    end
  end

  describe "views" do
    describe "user action log" do
      it "should return all incidents updated by a user" do
        incident = Incident.create!("created_by" => "some_other_user", "last_updated_by" => "a_third_user", "description" => "abc", "histories" => [{"user_name" => "brucewayne", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        Incident.all_connected_with("brucewayne").should == [Incident.get(incident.id)]
      end

      it "should not return incidents updated by other users" do
        Incident.create!("created_by" => "some_other_user", "description" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        Incident.all_connected_with("peterparker").should be_empty
      end

      it "should return the incident once when modified twice by the same user" do
        incident = Incident.create!("created_by" => "some_other_user", "description" => "ghi", "histories" => [{"user_name" => "peterparker", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "peterparker", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        Incident.all_connected_with("peterparker").should == [Incident.get(incident.id)]
      end

      it "should return the incident created by a user" do
        incident = Incident.create!("created_by" => "a_user", "description" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        Incident.all_connected_with("a_user").should == [Incident.get(incident.id)]
      end

      it "should not return duplicate records when same user had created and updated same incident multiple times" do
        incident = Incident.create!("created_by" => "tonystark", "description" => "ghi", "histories" => [{"user_name" => "tonystark", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "tonystark", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        Incident.all_connected_with("tonystark").should == [Incident.get(incident.id)]
      end
    end

    #describe "all ids and revs" do
      #before do
        #Child.all.each { |child| child.destroy }
      #end
#
      #it "should return all _ids and revs in the system" do
        #child1 = create_child_with_created_by("user1", :name => "child1")
        #child2 = create_child_with_created_by("user2", :name => "child2")
        #child3 = create_child_with_created_by("user3", :name => "child3")
        #child1.create!
        #child2.create!
        #child3.create!
#
        #ids_and_revs = Child.fetch_all_ids_and_revs
        #ids_and_revs.count.should == 3
        #ids_and_revs.should =~ [{"_id" => child1.id, "_rev" => child1.rev}, {"_id" => child2.id, "_rev" => child2.rev}, {"_id" => child3.id, "_rev" => child3.rev}]
      #end
    #end
  end


  describe 'reindex' do
    it 'should reindex every 24 hours' do
      scheduler = double()
      scheduler.should_receive(:every).with('24h').and_yield()
      Incident.should_receive(:reindex!).once.and_return(nil)
      Incident.schedule scheduler
    end
  end

  private

  def create_incident(description, options={})
    options.merge!("description" => description, 'created_by' => "me", 'created_organisation' => "stc")
    Incident.create(options)
  end

  #def create_duplicate(parent)
    #duplicate = Child.create(:name => "dupe")
    #duplicate.mark_as_duplicate(parent['short_id'])
    #duplicate.save!
    #duplicate
  #end

  def create_incident_with_created_by(created_by,options = {})
    user = User.new({:user_name => created_by, :organisation=> "UNICEF"})
    Incident.new_with_user_name user, options
  end
end
