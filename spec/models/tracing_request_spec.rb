require 'spec_helper'

describe TracingRequest do
  it_behaves_like "a valid record" do
    let(:record) {
      FormSection.stub(:all_visible_form_fields =>
                      [
                        Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A date field"),
                        Field.new(:type => Field::TEXT_AREA, :name => "a_textarea", :display_name => "A text area"),
                        Field.new(:type => Field::TEXT_FIELD, :name => "a_textfield", :display_name => "A text field"),
                        Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield", :display_name => "A numeric field"),
                        Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield_2", :display_name => "A second numeric field")
                      ])
      TracingRequest.new
    }
  end

  describe 'build solar schema' do

    it "should build with free text search fields" do
      Field.stub(:all_searchable_field_names).and_return []
      TracingRequest.build_text_fields_for_solar.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name","created_organisation"]
    end

    it "should build with date search fields" do
      TracingRequest.build_date_fields_for_solar.should == ["created_at", "last_updated_at"]
    end

    it "fields build with all fields in form sections" do
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "description", :type => Field::TEXT_FIELD, :display_name => "description")
      form.save!
      TracingRequest.build_text_fields_for_solar.should include("description")
      FormSection.all.each { |form_section| form_section.destroy }
    end

    it "should call Sunspot with all fields" do
      Sunspot.should_receive(:setup)
      TracingRequest.should_receive(:build_text_fields_for_solar)
      TracingRequest.should_receive(:build_date_fields_for_solar)
      TracingRequest.build_solar_schema
    end

  end

  describe ".search" do

    before :each do
      Sunspot.remove_all(TracingRequest)
    end

    before :all do
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "enquirer_name", :type => Field::TEXT_FIELD, :display_name => "enquirer name")
      form.save!
    end

    after :all do
      FormSection.all.each { |form| form.destroy }
    end

    it "should return empty array if search is not valid" do
      search = double("search", :query => "", :valid? => false)
      TracingRequest.search(search).should == []
    end

    it "should return empty array for no match" do
      search = double("search", :query => "Nothing", :valid? => true)
      TracingRequest.search(search).should == [[],[]]
    end

    it "should return an exact match" do
      create_tracing_request("Exact")
      search = double("search", :query => "Exact", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should == ["Exact"]
    end

    it "should return a match that starts with the query" do
      create_tracing_request("Starts With")
      search = double("search", :query => "Star", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should == ["Starts With"]
    end

    it "should return a fuzzy match" do
      create_tracing_request("timithy")
      create_tracing_request("timothy")
      search = double("search", :query => "timothy", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should =~ ["timithy", "timothy"]
    end

    it "should return tracing requests that have duplicate as nil" do
      tracing_request_active = TracingRequest.create(:enquirer_name => "eduardo aquiles", 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request_duplicate = TracingRequest.create(:enquirer_name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")

      search = double("search", :query => "aquiles", :valid? => true)
      result = TracingRequest.search(search)

      result.first.map(&:enquirer_name).should == ["eduardo aquiles"]
    end

    it "should return tracing requests that have duplicate as false" do
      tracing_request_active = TracingRequest.create(:enquirer_name => "eduardo aquiles", :duplicate => false, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request_duplicate = TracingRequest.create(:enquirer_name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")

      search = double("search", :query => "aquiles", :valid? => true)
      result = TracingRequest.search(search)   

      result.first.map(&:enquirer_name).should == ["eduardo aquiles"]
    end

    it "should search by exact match for short id" do
      uuid = UUIDTools::UUID.random_create.to_s
      TracingRequest.create("description" => "kev", :unique_identifier => "1234567890", 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create("description" => "kev", :unique_identifier => "0987654321", 'created_by' => "me", 'created_organisation' => "stc")
      search = double("search", :query => "7654321", :valid? => true)
      results, full_results = TracingRequest.search(search)
      results.length.should == 1
      results.first[:unique_identifier].should == "0987654321"
    end


    it "should match more than one word" do
      create_tracing_request("timothy cochran")
      search = double("search", :query => "timothy cochran", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should =~ ["timothy cochran"]
    end

    it "should match more than one word with fuzzy search" do
      create_tracing_request("timothy cochran")
      search = double("search", :query => "timithy cichran", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should =~ ["timothy cochran"]
    end

    it "should match more than one word with starts with" do
      create_tracing_request("timothy cochran")
      search = double("search", :query => "timo coch", :valid? => true)
      TracingRequest.search(search).first.map(&:enquirer_name).should =~ ["timothy cochran"]
    end

    it "should return the tracing requests registered by the user if the user has limited permission" do
      TracingRequest.create(:enquirer_name => "suganthi", 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create(:enquirer_name => "kavitha", 'created_by' => "you", 'created_organisation' => "stc")
      search = double("search", :query => "kavitha", :valid? => true, :page => 1)
      TracingRequest.search_by_created_user(search, "you", 1).first.map(&:enquirer_name).should =~ ["kavitha"]
    end

    it "should not return any results if a limited user searches with unique id of an tracing request registerd by a different user" do
      create_tracing_request("suganthi", {"created_by" => "thirumani", "unique_identifier" => "thirumanixxx12345"})
      create_tracing_request("kavitha", {"created_by" => "rajagopalan", "unique_identifier" => "rajagopalanxxx12345"})
      search = double("search", :query => "thirumanixxx12345", :valid? => true)
      TracingRequest.search_by_created_user(search, "rajagopalan", 1).first.map(&:enquirer_name).should =~ []
    end


  end

  describe ".sunspot_search" do
    before :each do
      Sunspot.remove_all(TracingRequest)
    end

    before :all do
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "enquirer_name", :type => Field::TEXT_FIELD, :display_name => "enquirer name")
      form.save!
    end

    after :all do
      FormSection.all.each { |form| form.destroy }
    end


    it "should return all results" do
      40.times do
        create_tracing_request("Exact")
      end
      criteria_list = SearchCriteria.build_from_params("1" => {:field => "enquirer_name", :value => "Exact", :join => "AND", :display_name => "enquirer name" } )
      query = SearchCriteria.lucene_query(criteria_list)
      TracingRequest.sunspot_search(1, query).last.count.should == 40
    end
  end

  describe "update_properties_with_user_name" do

    it "should replace old properties with updated ones" do
      tracing_request = TracingRequest.new("enquirer_name" => "Dave", "age" => "28", "last_known_location" => "London")
      new_properties = {"enquirer_name" => "Dave", "age" => "35"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      tracing_request['age'].should == "35"
      tracing_request['enquirer_name'].should == "Dave"
      tracing_request['last_known_location'].should == "London"
    end

    it "should not replace old properties when updated ones have nil value" do
      tracing_request = TracingRequest.new("origin" => "Croydon", "last_known_location" => "London")
      new_properties = {"origin" => nil, "last_known_location" => "Manchester"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      tracing_request['last_known_location'].should == "Manchester"
      tracing_request['origin'].should == "Croydon"
    end

    it "should not replace old properties when the existing records last_updated at is latest than the given last_updated_at" do
      tracing_request = TracingRequest.new("enquirer_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      given_properties = {"enquirer_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, given_properties
      tracing_request["enquirer_name"].should == "existing name"
      tracing_request["last_updated_at"].should == "2013-01-01 00:00:01UTC"
    end

    it "should merge the histories of the given record with the current record if the last updated at of current record is greater than given record's" do
      existing_histories = JSON.parse "{\"user_name\":\"rapidftr\", \"datetime\":\"2013-01-01 00:00:01UTC\",\"changes\":{\"sex\":{\"to\":\"male\",\"from\":\"female\"}}}"
      given_histories = [existing_histories, JSON.parse("{\"user_name\":\"rapidftr\",\"datetime\":\"2012-01-01 00:00:02UTC\",\"changes\":{\"enquirer_name\":{\"to\":\"new\",\"from\":\"old\"}}}")]
      tracing_request = TracingRequest.new("enquirer_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" =>  [existing_histories])
      given_properties = {"enquirer_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => given_histories}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = tracing_request["histories"]
      histories.size.should == 2
      histories.first["changes"]["sex"]["from"].should == "female"
      histories.last["changes"]["enquirer_name"]["to"].should == "new"
    end

    it "should assign the history of the given properties as it is if the current record has no history" do
      tracing_request = TracingRequest.new("enquirer_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      given_properties = {"enquirer_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"enquirer_name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = tracing_request["histories"]
      histories.last["changes"]["enquirer_name"]["to"].should == "new"
    end

    # This spec is almost always failing randomly, need to fix this spec if possible or think of other ways to test this?
    # xit "should not add changes to history if its already added to the history" do
      # FormSection.stub(:all_visible_form_fields =>
                            # [Field.new(:type => Field::TEXT_FIELD, :name => "enquirer_name", :display_name => "Name"),
                             # Field.new(:type => Field::CHECK_BOXES, :name => "not_name")])
      # child = Child.new("enquirer_name" => "old", "last_updated_at" => "2012-12-12 00:00:00UTC")
      # child.save!
      # sleep 1
      # changed_properties = {"enquirer_name" => "new", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      # child.save!
      # sleep 1
      # child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      # child.save!
      # child["histories"].size.should == 1
    # end

    it "should populate last_updated_by field with the user_name who is updating" do
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request['last_updated_by'].should == 'jdoe'
    end


    it "should assign histories order by datetime of history" do
      tracing_request = TracingRequest.new()
      first_history = double("history", :[] => "2010-01-01 01:01:02UTC")
      second_history = double("history", :[] => "2010-01-02 01:01:02UTC")
      third_history = double("history", :[] => "2010-01-02 01:01:03UTC")
      tracing_request["histories"] = [first_history, second_history, third_history]
      tracing_request.ordered_histories.should == [third_history, second_history, first_history]
    end

    it "should populate last_updated_at field with the time of the update" do
      Clock.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request['last_updated_at'].should == "2010-01-17 19:05:00UTC"
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


  describe 'save' do

    it "should save with generated tracing_request_id" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'enquirer_name' => 'London')
      tracing_request.save!
      tracing_request[:tracing_request_id].should_not be_nil
    end

  end

  describe "new_with_user_name" do

    it "should create regular tracing request fields" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'enquirer_name' => 'London', 'age' => '6')
      tracing_request['enquirer_name'].should == 'London'
      tracing_request['age'].should == '6'
    end

    it "should create a unique id" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      tracing_request = create_tracing_request_with_created_by('jdoe')
      tracing_request['unique_identifier'].should == "12345"
    end

    it "should not create a unique id if already exists" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'unique_identifier' => 'primeroxxx5bcde')
      tracing_request['unique_identifier'].should == "primeroxxx5bcde"
    end

    it "should create a created_by field with the user name" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'some_field' => 'some_value')
      tracing_request['created_by'].should == 'jdoe'
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
        tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value')
        tracing_request['created_at'].should == "2010-01-14 14:05:00UTC"
      end

    end

    describe "when the created at field is supplied" do

      it "should use the supplied created at value" do
        tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC')
        tracing_request['created_at'].should == "2010-01-14 14:05:00UTC"
      end
    end
  end

  describe "unique id" do
    it "should create a unique id" do
      tracing_request = TracingRequest.new
      UUIDTools::UUID.stub("random_create").and_return(12345)
      tracing_request.create_unique_id
      tracing_request["unique_identifier"].should == "12345"
    end

    it "should return last 7 characters of unique id as short id" do
      tracing_request = TracingRequest.new
      UUIDTools::UUID.stub("random_create").and_return(1212127654321)
      tracing_request.create_unique_id
      tracing_request.short_id.should == "7654321"
    end

  end
  

  describe "history log" do

    before do
      fields = [
          Field.new_text_field("enquirer_name"),
          Field.new_text_field("last_known_location"),
          Field.new_text_field("age"),
          Field.new_text_field("origin"),
          Field.new_radio_button("gender", ["male", "female"])]
      FormSection.stub(:all_visible_form_fields).and_return(fields)
      mock_user = double({:organisation => 'UNICEF'})
      User.stub(:find_by_user_name).with(anything).and_return(mock_user)
    end

    it "should add a history entry when a record is created" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'created_by' => "me")
      tracing_request['histories'].size.should be 1
      tracing_request["histories"][0].should == {"changes"=>{"tracing_request"=>{:created=>nil}}, "datetime"=>nil, "user_name"=>"me", "user_organisation"=>"UNICEF"}
    end

    it "should update history with 'from' value on last_known_location update" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'created_by' => "me")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['last_known_location']['from'].should == 'New York'
    end

    it "should update history with 'to' value on last_known_location update" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'created_by' => "me")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['last_known_location']['to'].should == 'Philadelphia'
    end

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

    it "should update history with a combined history record when multiple fields are updated" do
      tracing_request = TracingRequest.create('age' => '8', 'last_known_location' => 'New York', 'created_by' => "me")
      tracing_request['age'] = '6'
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      tracing_request['histories'].size.should == 2
      changes = tracing_request['histories'].first['changes']
      changes['age']['from'].should == '8'
      changes['age']['to'].should == '6'
      changes['last_known_location']['from'].should == 'New York'
      changes['last_known_location']['to'].should == 'Philadelphia'
    end

    it "should not record anything in the history if a save occured with no changes" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      loaded_tracing_request = TracingRequest.get(tracing_request.id)
      loaded_tracing_request.save!
      tracing_request['histories'].size.should be 1
    end

    it "should not record empty string in the history if only change was spaces" do
      tracing_request = TracingRequest.create('origin' => '', 'last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['origin'] = '    '
      tracing_request.save!
      tracing_request['histories'].size.should be 1
    end

    it "should not record history on populated field if only change was spaces" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = ' New York   '
      tracing_request.save!
      tracing_request['histories'].size.should be 1
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
      tracing_request = TracingRequest.create('enquirer_name' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['enquirer_name'] = 'New York'
      tracing_request.save!
      tracing_request['enquirer_name'] = 'Philadelphia'
      tracing_request.save!
      tracing_request['histories'].size.should == 3
      tracing_request['histories'][0]['changes']['enquirer_name']['to'].should == 'Philadelphia'
      tracing_request['histories'][1]['changes']['enquirer_name']['to'].should == 'New York'
    end

    it "should update history with username from last_updated_by" do
      tracing_request = TracingRequest.create('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request['last_updated_by'] = 'some_user'
      tracing_request.save!
      tracing_request['histories'].first['user_name'].should == 'some_user'
      tracing_request['histories'].first['user_organisation'].should == 'UNICEF'
    end

    it "should update history with the datetime from last_updated_at" do
      child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      child['last_known_location'] = 'Philadelphia'
      child['last_updated_at'] = '2010-01-14 14:05:00UTC'
      child.save!
      child['histories'].first['datetime'].should == '2010-01-14 14:05:00UTC'
    end

  end

  describe "when fetching tracing requests" do

    before do
      User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
    end

    #TODO - verify ordering logic for INCIDENTS
    it "should return list of tracing requests ordered by description" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('enquirer_name' => 'Zxy', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Azz', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Abc', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Amm', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Bbb', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_requests = TracingRequest.all
      tracing_requests.first['enquirer_name'].should == 'Abc'
      tracing_requests.last['enquirer_name'].should == 'Zxy'
    end
    
    it "should order tracing requests with blank descriptions first" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('enquirer_name' => 'Zxy', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => '', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Azz', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Abc', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Amm', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('enquirer_name' => 'Bbb', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_requests = TracingRequest.all
      tracing_requests.first['enquirer_name'].should == ''
      tracing_requests.last['enquirer_name'].should == 'Zxy'
    end

  end

  
  context "duplicate" do
    before do
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
      TracingRequest.duplicates.each { |tracing_request| tracing_request.destroy }
      User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
    end

    describe "mark_as_duplicate" do
      it "should set the duplicate field" do
        tracing_request_duplicate = TracingRequest.create('enquirer_name' => "Jaco", 'unique_identifier' => 'jacoxxabcde','short_id' => "abcde12", 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request_active = TracingRequest.create('enquirer_name' => 'Jacobus', 'unique_identifier' => 'jacobusxxxunique', 'short_id'=> 'nique12', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request_duplicate.mark_as_duplicate tracing_request_active['short_id']
        tracing_request_duplicate.duplicate?.should be_true
        tracing_request_duplicate.duplicate_of.should == tracing_request_active.id
      end

      it "should set not set the duplicate field if tracing request " do
        tracing_request_duplicate = TracingRequest.create('enquirer_name' => "Jaco", 'unique_identifier' => 'jacoxxxunique')
        tracing_request_duplicate.mark_as_duplicate "I am not a valid id"
        tracing_request_duplicate.duplicate_of.should be_nil
      end

      it "should set the duplicate field" do
        tracing_request_duplicate = TracingRequest.create('enquirer_name' => "Jaco", 'unique_identifier' => 'jacoxxabcde','short_id' => "abcde12", 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request_active = TracingRequest.create('enquirer_name' => 'Jacobus', 'unique_identifier' => 'jacobusxxxunique','short_id'=> 'nique12', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request_duplicate.mark_as_duplicate tracing_request_active['short_id']
        tracing_request_duplicate.duplicate?.should be_true
        tracing_request_duplicate.duplicate_of.should == tracing_request_active.id
      end
    end

      it "should return all duplicate records" do
        record_active = TracingRequest.create(:enquirer_name => "not a dupe", :unique_identifier => "someids",'short_id'=> 'someids', 'created_by' => "me", 'created_organisation' => "stc")
        record_duplicate = create_duplicate(record_active)

        duplicates = TracingRequest.duplicates_of(record_active.id)
        all = TracingRequest.all

        duplicates.size.should be 1
        all.size.should be 1
        duplicates.first.id.should == record_duplicate.id
        all.first.id.should == record_active.id
      end

      it "should return duplicate from a record" do
        record_active = TracingRequest.create(:enquirer_name => "not a dupe", :unique_identifier => "someids",'short_id'=> 'someids', 'created_by' => "me", 'created_organisation' => "stc")
        record_duplicate = create_duplicate(record_active)

        duplicates = TracingRequest.duplicates_of(record_active.id)
        duplicates.size.should be 1
        duplicates.first.id.should == record_duplicate.id
      end

  end

  describe 'organisation' do
    it 'should get created user' do
      tracing_request = TracingRequest.new
      tracing_request['created_by'] = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      tracing_request.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organisation => 'UNICEF'))
      tracing_request = TracingRequest.create 'enquirer_name' => 'My Test TracingRequest Description', :created_by => "mj"

      tracing_request.created_organisation.should == 'UNICEF'
    end
  end

  describe "views" do
    describe "user action log" do
      it "should return all tracing requests updated by a user" do
        tracing_request = TracingRequest.create!("created_by" => "some_other_user", "last_updated_by" => "a_third_user", "description" => "abc", "histories" => [{"user_name" => "brucewayne", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("brucewayne").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should not return tracing requests updated by other users" do
        TracingRequest.create!("created_by" => "some_other_user", "description" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("peterparker").should be_empty
      end

      it "should return the tracing request once when modified twice by the same user" do
        tracing_request = TracingRequest.create!("created_by" => "some_other_user", "description" => "ghi", "histories" => [{"user_name" => "peterparker", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "peterparker", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        TracingRequest.all_connected_with("peterparker").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should return the tracing request created by a user" do
        tracing_request = TracingRequest.create!("created_by" => "a_user", "description" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("a_user").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should not return duplicate records when same user had created and updated same tracing request multiple times" do
        tracing_request = TracingRequest.create!("created_by" => "tonystark", "description" => "ghi", "histories" => [{"user_name" => "tonystark", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "tonystark", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        TracingRequest.all_connected_with("tonystark").should == [TracingRequest.get(tracing_request.id)]
      end
    end

    #describe "all ids and revs" do
      #before do
        #Child.all.each { |child| child.destroy }
      #end
#
      #it "should return all _ids and revs in the system" do
        #child1 = create_child_with_created_by("user1", :enquirer_name => "child1")
        #child2 = create_child_with_created_by("user2", :enquirer_name => "child2")
        #child3 = create_child_with_created_by("user3", :enquirer_name => "child3")
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
      TracingRequest.should_receive(:reindex!).once.and_return(nil)
      TracingRequest.schedule scheduler
    end
  end

  private

  def create_tracing_request(enquirer_name, options={})
    options.merge!("enquirer_name" => enquirer_name, 'created_by' => "me", 'created_organisation' => "stc")
    TracingRequest.create(options)
  end

  def create_duplicate(parent)
    duplicate = TracingRequest.create(:enquirer_name => "dupe")
    duplicate.mark_as_duplicate(parent['short_id'])
    duplicate.save!
    duplicate
  end

  def create_tracing_request_with_created_by(created_by,options = {})
    user = User.new({:user_name => created_by, :organisation=> "UNICEF"})
    TracingRequest.new_with_user_name user, options
  end
end
