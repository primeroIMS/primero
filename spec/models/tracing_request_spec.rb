require 'spec_helper'
require 'sunspot'

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
      TracingRequest.searchable_string_fields.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name","created_organisation"]
    end

    it "should build with date search fields" do
      expect(TracingRequest.searchable_date_fields).to include("created_at", "last_updated_at")
    end

    it "fields build with all fields in form sections" do
      FormSection.all.each { |form_section| form_section.destroy }
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "relation_name", :type => Field::TEXT_FIELD, :display_name => "relation_name")
      form.save!
      TracingRequest.searchable_string_fields.should include("relation_name")
      FormSection.all.each { |form_section| form_section.destroy }
    end

    # TODO: build_solr_schema under developme nt. Temp removed
    # it "should call Sunspot with all fields" do
    #   Sunspot.should_receive(:setup)
    #   TracingRequest.should_receive(:build_text_fields_for_solar)
    #   TracingRequest.should_receive(:build_date_fields_for_solar)
    #   TracingRequest.build_solar_schema
    # end

  end

  describe ".search" do

    before :each do
      Sunspot.remove_all(TracingRequest)
    end

    before :all do
      FormSection.all.all.each { |form| form.destroy }
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "relation_name", :type => Field::TEXT_FIELD, :display_name => "relation_name")
      form.save!
    end

    # TODO: full text searching not implemented yet. Effects the next 13 test.

    # it "should return empty array if search is not valid" do
    #   search = double("search", :query => "", :valid? => false)
    #   TracingRequest.search(search).should == []
    # end

    # it "should return empty array for no match" do
    #   search = double("search", :query => "Nothing", :valid? => true)
    #   TracingRequest.search(search).should == [[],[]]
    # end

    # it "should return an exact match" do
    #   create_tracing_request("Exact")
    #   search = double("search", :query => "Exact", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should == ["Exact"]
    # end

    # it "should return a match that starts with the query" do
    #   create_tracing_request("Starts With")
    #   search = double("search", :query => "Star", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should == ["Starts With"]
    # end

    # it "should return a fuzzy match" do
    #   create_tracing_request("timithy")
    #   create_tracing_request("timothy")
    #   search = double("search", :query => "timothy", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should =~ ["timithy", "timothy"]
    # end

    # it "should return tracing request that have duplicate as nil" do
    #   tracing_request_active = TracingRequest.create(:name => "eduardo aquiles", 'created_by' => "me", 'created_organisation' => "stc")
    #   tracing_request_duplicate = TracingRequest.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = TracingRequest.search(search)

    #   result.first.map(&:name).should == ["eduardo aquiles"]
    # end

    # it "should return tracing request that have duplicate as false" do
    #   tracing_request_active = TracingRequest.create(:name => "eduardo aquiles", :duplicate => false, 'created_by' => "me", 'created_organisation' => "stc")
    #   tracing_request_duplicate = TracingRequest.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organisation' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = TracingRequest.search(search)

    #   result.first.map(&:name).should == ["eduardo aquiles"]
    # end

    # it "should search by exact match for short id" do
    #   uuid = UUIDTools::UUID.random_create.to_s
    #   TracingRequest.create("relation_name" => "kev", :unique_identifier => "1234567890", "last_known_location" => "new york", 'created_by' => "me", 'created_organisation' => "stc")
    #   TracingRequest.create("relation_name" => "kev", :unique_identifier => "0987654321", "last_known_location" => "new york", 'created_by' => "me", 'created_organisation' => "stc")
    #   search = double("search", :query => "7654321", :valid? => true)
    #   results, full_results = TracingRequest.search(search)
    #   results.length.should == 1
    #   results.first[:unique_identifier].should == "0987654321"
    # end


    # it "should match more than one word" do
    #   create_tracing_request("timothy cochran")
    #   search = double("search", :query => "timothy cochran", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should =~ ["timothy cochran"]
    # end

    # it "should match more than one word with fuzzy search" do
    #   create_tracing_request("timothy cochran")
    #   search = double("search", :query => "timithy cichran", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should =~ ["timothy cochran"]
    # end

    # it "should match more than one word with starts with" do
    #   create_tracing_request("timothy cochran")
    #   search = double("search", :query => "timo coch", :valid? => true)
    #   TracingRequest.search(search).first.map(&:name).should =~ ["timothy cochran"]
    # end

    # it "should return the tracing request registered by the user if the user has limited permission" do
    #   TracingRequest.create(:name => "suganthi", 'created_by' => "me", 'created_organisation' => "stc")
    #   TracingRequest.create(:name => "kavitha", 'created_by' => "you", 'created_organisation' => "stc")
    #   search = double("search", :query => "kavitha", :valid? => true, :page => 1)
    #   TracingRequest.search_by_created_user(search, "you", 1).first.map(&:name).should =~ ["kavitha"]
    # end

    # it "should not return any results if a limited user searches with unique id of a tracing request registerd by a different user" do
    #   create_tracing_request("suganthi", {"created_by" => "thirumani", "unique_identifier" => "thirumanixxx12345"})
    #   create_tracing_request("kavitha", {"created_by" => "rajagopalan", "unique_identifier" => "rajagopalanxxx12345"})
    #   search = double("search", :query => "thirumanixxx12345", :valid? => true)
    #   TracingRequest.search_by_created_user(search, "rajagopalan", 1).first.map(&:name).should =~ []
    # end


  end

  describe ".sunspot_search" do
    before :each do
      Sunspot.remove_all(TracingRequest)
    end

    before :all do
      FormSection.all.each { |form| form.destroy }
      form = FormSection.new(:name => "test_form", :parent_form => 'tracing_request')
      form.fields << Field.new(:name => "relation_name", :type => Field::TEXT_FIELD, :display_name => "relation_name")
      form.save!
    end

    # TODO: full text searching not implemented yet.
    # it "should return all results" do
    #   40.times do
    #     create_tracing_request("Exact")
    #   end
    #   criteria_list = SearchCriteria.build_from_params("1" => {:field => "relation_name", :value => "Exact", :join => "AND", :display_name => "relation_name" } )
    #   query = SearchCriteria.lucene_query(criteria_list)
    #   TracingRequest.sunspot_search(1, query).last.count.should == 40
    # end
  end

  describe "update_properties_with_user_name" do

    it "should replace old properties with updated ones" do
      tracing_request = TracingRequest.new("relation_name" => "Dave", "relation_age" => "28", "last_known_location" => "London")
      new_properties = {"relation_name" => "Dave", "relation_age" => "35"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      tracing_request['relation_age'].should == "35"
      tracing_request['relation_name'].should == "Dave"
      tracing_request['last_known_location'].should == "London"
    end

    it "should not replace old properties when when missing from update" do
      tracing_request = TracingRequest.new("origin" => "Croydon", "last_known_location" => "London")
      new_properties = {"last_known_location" => "Manchester"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      tracing_request['last_known_location'].should == "Manchester"
      tracing_request['origin'].should == "Croydon"
    end

    it "should not replace old properties when the existing records last_updated at is latest than the given last_updated_at" do
      tracing_request = TracingRequest.new("relation_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      given_properties = {"relation_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC"}
      tracing_request.update_properties_with_user_name "some_user", nil, nil, nil, false, given_properties
      tracing_request["relation_name"].should == "existing name"
      tracing_request["last_updated_at"].should == "2013-01-01 00:00:01UTC"
    end

    it "should merge the histories of the given record with the current record if the last updated at of current record is greater than given record's" do
      existing_histories = JSON.parse "{\"user_name\":\"rapidftr\", \"datetime\":\"2013-01-01 00:00:01UTC\",\"changes\":{\"sex\":{\"to\":\"male\",\"from\":\"female\"}}}"
      given_histories = [existing_histories, JSON.parse("{\"user_name\":\"rapidftr\",\"datetime\":\"2012-01-01 00:00:02UTC\",\"changes\":{\"relation_name\":{\"to\":\"new\",\"from\":\"old\"}}}")]
      tracing_request = TracingRequest.new("relation_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" =>  [existing_histories])
      given_properties = {"relation_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => given_histories}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = tracing_request["histories"]
      histories.size.should == 2
      histories.first["changes"]["sex"]["from"].should == "female"
      histories.last["changes"]["relation_name"]["to"].should == "new"
    end

    it "should delete the newly created media history(current_photo_key and recorded_audio) as the media names are changed before save of tracing request record" do
      existing_histories = JSON.parse "{\"user_name\":\"rapidftr\", \"datetime\":\"2013-01-01 00:00:01UTC\",\"changes\":{\"sex\":{\"to\":\"male\",\"from\":\"female\"}}}"
      given_histories = [existing_histories,
                         JSON.parse("{\"datetime\":\"2013-02-04 06:55:03\",\"user_name\":\"rapidftr\",\"changes\":{\"current_photo_key\":{\"to\":\"2c097fa8-b9ab-4ae8-aa4d-1b7bda7dcb72\",\"from\":\"photo-364416240-2013-02-04T122424\"}},\"user_organisation\":\"N\\/A\"}"),
                         JSON.parse("{\"datetime\":\"2013-02-04 06:58:12\",\"user_name\":\"rapidftr\",\"changes\":{\"recorded_audio\":{\"to\":\"9252364d-c011-4af0-8739-0b1e9ed5c0ad1359961089870\",\"from\":\"\"}},\"user_organisation\":\"N\\/A\"}")
                        ]
      tracing_request = TracingRequest.new("relation_name" => "existing name", "last_updated_at" => "2013-12-12 00:00:01UTC", "histories" =>  [existing_histories])
      given_properties = {"relation_name" => "given name", "last_updated_at" => "2013-01-01 00:00:00UTC", "histories" => given_histories}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = tracing_request["histories"]
      histories.size.should == 1
      histories.first["changes"]["current_photo_key"].should be_nil
    end

    it "should assign the history of the given properties as it is if the current record has no history" do
      tracing_request = TracingRequest.new("relation_name" => "existing name", "last_updated_at" => "2013-01-01 00:00:01UTC")
      given_properties = {"relation_name" => "given name", "last_updated_at" => "2012-12-12 00:00:00UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"relation_name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = tracing_request["histories"]
      histories.last["changes"]["relation_name"]["to"].should == "new"
    end

    # This spec is almost always failing randomly, need to fix this spec if possible or think of other ways to test this?
    xit "should not add changes to history if its already added to the history" do
      FormSection.stub(:all_visible_form_fields =>
                            [Field.new(:type => Field::TEXT_FIELD, :name => "relation_name", :display_name => "Name"),
                             Field.new(:type => Field::CHECK_BOXES, :name => "not_name")])
      tracing_request = TracingRequest.new("relation_name" => "old", "created_at" => "2012-12-12 00:00:00UTC")
      tracing_request.save!
      sleep 1
      changed_properties = {"relation_name" => "new", "last_updated_at" => "2013-01-01 00:00:01UTC", "histories" => [JSON.parse("{\"user_name\":\"rapidftr\",\"changes\":{\"relation_name\":{\"to\":\"new\",\"from\":\"old\"}}}")]}
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      tracing_request.save!
      sleep 1
      tracing_request.update_properties_with_user_name "rapidftr", nil, nil, nil, false, changed_properties
      tracing_request.save!
      tracing_request["histories"].size.should == 1
    end

    it "should populate last_updated_by field with the user_name who is updating" do
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request.last_updated_by.should == 'jdoe'
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
      DateTime.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request.last_updated_at.should == DateTime.parse("2010-01-17 19:05:00UTC")
    end

    it "should not update attachments when the photo value is nil" do
      tracing_request = TracingRequest.new
      tracing_request.update_with_attachements({}, "mr jones")
      tracing_request.photos.should be_empty
    end

    it "should update attachment when there is audio update" do
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, uploadable_audio, false, {}
      tracing_request['_attachments']['audio-2010-01-17T140532']['data'].should_not be_blank
    end

    it "should respond nil for photo when there is no photo associated with the tracing request" do
      tracing_request = TracingRequest.new
      tracing_request.photo.should == nil
    end

    it "should update photo keys" do
      tracing_request = TracingRequest.new
      tracing_request.should_receive(:update_photo_keys)
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request.photos.should be_empty
    end

    it "should remove old audio files when save a new audio file" do
      User.stub(:find_by_user_name).and_return("John Doe")
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"), Time.parse("Jan 18 2010 14:05:32"))

      #Create a tracing_request with some audio file.
      tracing_request = TracingRequest.new
      tracing_request.audio = uploadable_audio_amr
      tracing_request.save
      #Validate the audio file was store.
      tracing_request['_attachments']['audio-2010-01-17T140532']['data'].should_not be_blank
      tracing_request['_attachments']['audio-2010-01-17T140532']['content_type'].should eq("audio/amr")
      tracing_request['audio_attachments']['original'].should == "audio-2010-01-17T140532"
      tracing_request['audio_attachments']['amr'].should == "audio-2010-01-17T140532"
      tracing_request['audio_attachments']['mp3'].should be_nil
      #Others
      tracing_request['recorded_audio'].should == "audio-2010-01-17T140532"
      tracing_request['relation_name'].should be_nil

      #Update the tracing_request so a new audio is loaded.
      properties = {:relation_name => "Some TracingRequest Name"}
      tracing_request.update_properties_with_user_name 'Jane Doe', nil, nil, uploadable_audio_mp3, false, properties

      #Validate the old file was removed.
      tracing_request['_attachments']['audio-2010-01-17T140532'].should be_blank
      #Validate the new file was stored.
      tracing_request['_attachments']['audio-2010-01-18T140532']['data'].should_not be_blank
      tracing_request['_attachments']['audio-2010-01-18T140532']['content_type'].should eq("audio/mpeg")
      tracing_request['audio_attachments']['original'].should == "audio-2010-01-18T140532"
      tracing_request['audio_attachments']['mp3'].should == "audio-2010-01-18T140532"
      #Others
      tracing_request['recorded_audio'].should == "audio-2010-01-18T140532"
      tracing_request['relation_name'].should == "Some TracingRequest Name"
    end

    it "should remove current audio files" do
      User.stub(:find_by_user_name).and_return("John Doe")
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

      #Create a tracing_request with some audio file.
      tracing_request = TracingRequest.new
      tracing_request.audio = uploadable_audio_amr
      tracing_request.save
      #Validate the audio file was store.
      tracing_request['_attachments']['audio-2010-01-17T140532']['data'].should_not be_blank
      tracing_request['_attachments']['audio-2010-01-17T140532']['content_type'].should eq("audio/amr")
      tracing_request['audio_attachments']['original'].should == "audio-2010-01-17T140532"
      tracing_request['audio_attachments']['amr'].should == "audio-2010-01-17T140532"
      tracing_request['audio_attachments']['mp3'].should be_nil
      #Others
      tracing_request['recorded_audio'].should == "audio-2010-01-17T140532"
      tracing_request['relation_name'].should be_nil

      #Update the tracing_request so the current audio is removed.
      properties = {:relation_name => "Some TracingRequest Name"}
      tracing_request.update_properties_with_user_name 'Jane Doe', nil, nil, nil, true, properties

      #Validate the file was removed.
      tracing_request['_attachments'].should be_blank
      tracing_request['audio_attachments'].should be_nil
      #Others
      tracing_request['recorded_audio'].should be_nil
      tracing_request['relation_name'].should == "Some TracingRequest Name"
    end

  end

  describe "validation" do

    it "should disallow file formats that are not photo formats" do
      tracing_request = TracingRequest.new
      tracing_request.photo = uploadable_photo_gif
      tracing_request.should_not be_valid
      tracing_request.photo = uploadable_photo_bmp
      tracing_request.should_not be_valid
    end

    it "should disallow file formats that are not supported audio formats" do
      tracing_request = TracingRequest.new
      tracing_request.audio = uploadable_photo_gif
      tracing_request.should_not be_valid
      tracing_request.audio = uploadable_audio_amr
      tracing_request.should be_valid
      tracing_request.audio = uploadable_audio_mp3
      tracing_request.should be_valid
      tracing_request.audio = uploadable_audio_wav
      tracing_request.should_not be_valid
      tracing_request.audio = uploadable_audio_ogg
      tracing_request.should_not be_valid
    end

    it "should disallow image file formats that are not png or jpg" do
      tracing_request = TracingRequest.new
      tracing_request.photo = uploadable_photo
      tracing_request.should be_valid
      tracing_request.photo = uploadable_text_file
      tracing_request.should_not be_valid
    end

    it "should disallow a photo larger than 10 megabytes" do
      photo = uploadable_large_photo
      tracing_request = TracingRequest.new
      tracing_request.photo = photo
      tracing_request.should_not be_valid
    end

    it "should disllow an audio file larger than 10 megabytes" do
      tracing_request = TracingRequest.new
      tracing_request.audio = uploadable_large_audio
      tracing_request.should_not be_valid
    end
  end


  describe 'save' do

    it "should save with generated tracing request_id and inquiry_date" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'relation_age' => '6')
      tracing_request.save!
      tracing_request[:tracing_request_id].should_not be_nil
      tracing_request[:inquiry_date].should_not be_nil
    end

    it "should allow edit inquiry_date" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'relation_age' => '6', 'inquiry_date' => '19/Jul/2014')
      tracing_request.save!
      tracing_request[:tracing_request_id].should_not be_nil
      tracing_request[:inquiry_date].should eq '19/Jul/2014'
    end

    it "should not save file formats that are not photo formats" do
      tracing_request = TracingRequest.new
      tracing_request.photo = uploadable_photo_gif
      tracing_request.save.should == false
      tracing_request.photo = uploadable_photo_bmp
      tracing_request.save.should == false
    end

    it "should save file based on content type" do
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organisation' => "stc")
      photo = uploadable_jpg_photo_without_file_extension
      tracing_request[:photo] = photo
      tracing_request.save.present?.should == true
    end

    it "should not save with file formats that are not supported audio formats" do
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organisation' => "stc")
      tracing_request.audio = uploadable_photo_gif
      tracing_request.save.should == false
      tracing_request.audio = uploadable_audio_amr
      tracing_request.save.present?.should == true
      tracing_request.audio = uploadable_audio_mp3
      tracing_request.save.present?.should == true
      tracing_request.audio = uploadable_audio_wav
      tracing_request.save.should == false
      tracing_request.audio = uploadable_audio_ogg
      tracing_request.save.should == false
    end

    it "should not save with image file formats that are not png or jpg" do
      photo = uploadable_photo
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organisation' => "stc")
      tracing_request.photo = photo
      tracing_request.save.present?.should == true
      loaded_tracing_request = TracingRequest.get(tracing_request.id)
      loaded_tracing_request.save.present?.should == true
      loaded_tracing_request.photo = uploadable_text_file
      loaded_tracing_request.save.should == false
    end

    it "should not save with a photo larger than 10 megabytes" do
      photo = uploadable_large_photo
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organisation' => "stc")
      tracing_request.photo = photo
      tracing_request.save.should == false
    end

    it "should not save with an audio file larger than 10 megabytes" do
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organisation' => "stc")
      tracing_request.audio = uploadable_large_audio
      tracing_request.save.should == false
    end

  end

  describe "new_with_user_name" do

    it "should create regular tracing request fields" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'relation_age' => '6')
      tracing_request['last_known_location'].should == 'London'
      tracing_request['relation_age'].should == '6'
    end

    it "should create a unique id" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London')
      tracing_request.save!
      tracing_request['unique_identifier'].should == "12345"
    end

    it "should not create a unique id if already exists" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'unique_identifier' => 'rapidftrxxx5bcde')
      tracing_request['unique_identifier'].should == "rapidftrxxx5bcde"
    end

    it "should create a created_by field with the user name" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'some_field' => 'some_value')
      tracing_request['created_by'].should == 'jdoe'
    end

    it "should create a posted_at field with the current date" do
      DateTime.stub(:now).and_return(Time.utc(2010, "jan", 22, 14, 05, 0))
      tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value')
      tracing_request.posted_at.should == DateTime.parse("2010-01-22 14:05:00UTC")
    end

    describe "when the created at field is not supplied" do

      it "should create a created_at field with time of creation" do
        DateTime.stub(:now).and_return(Time.utc(2010, "jan", 14, 14, 5, 0))
        tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value')
        tracing_request.created_at.should == DateTime.parse("2010-01-14 14:05:00UTC")
      end

    end

    describe "when the created at field is supplied" do

      it "should use the supplied created at value" do
        tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => DateTime.parse('2010-01-14 14:05:00UTC'))
        tracing_request.created_at.should == DateTime.parse("2010-01-14 14:05:00UTC")
      end
    end
  end

  describe "unique id" do
    it "should create a unique id" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.unique_identifier.should == "12345"
    end

    it "should return last 7 characters of unique id as short id" do
      UUIDTools::UUID.stub("random_create").and_return(1212127654321)
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.short_id.should == "7654321"
    end

  end

  describe "photo attachments" do

    before(:each) do
      Clock.stub(:now).and_return(Time.parse("Jan 20 2010 17:10:32"))
    end

    context "with no photos" do
      it "should have an empty set" do
        TracingRequest.new.photos.should be_empty
      end

      it "should not have a primary photo" do
        TracingRequest.new.primary_photo.should be_nil
      end
    end

    context "with a single new photo" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      end

      it "should only have one photo on creation" do
        @tracing_request.photos.size.should eql 1
      end

      it "should be the primary photo" do
        @tracing_request.primary_photo.should match_photo uploadable_photo
      end

    end

    context "with multiple new photos" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
        @tracing_request = TracingRequest.create('photo' => {'0' => uploadable_photo_jeff, '1' => uploadable_photo_jorge}, 'last_known_location' => 'London', 'created_by' => "me")
      end

      it "should have corrent number of photos after creation" do
        @tracing_request.photos.size.should eql 2
      end

      it "should order by primary photo" do
        @tracing_request.primary_photo_id = @tracing_request["photo_keys"].last
        @tracing_request.photos.first.name.should == @tracing_request.current_photo_key
      end

      it "should return the first photo as a primary photo" do
        @tracing_request.primary_photo.should match_photo uploadable_photo_jeff
      end

    end

    context "when rotating an existing photo" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      end

      it "should become the primary photo" do
        existing_photo = @tracing_request.primary_photo
        @tracing_request.rotate_photo(180)
        @tracing_request.save
        #TODO: should be a better way to check rotation other than stubbing Minimagic ?
        @tracing_request.primary_photo.should_not match_photo existing_photo
      end

      it "should delete the original orientation" do
        existing_photo = @tracing_request.primary_photo
        @tracing_request.rotate_photo(180)
        @tracing_request.save
        @tracing_request.primary_photo.name.should eql existing_photo.name
        existing_photo.should_not match_photo @tracing_request.primary_photo
        @tracing_request.photos.size.should eql 1
      end

    end

    context "validate photo size" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      end

      it "should not save tracing request if new photos are more than 10" do
        photos = []
        (1..11).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request.photos = photos
        tracing_request.save.should == false
        tracing_request.errors[:photo].should == ["You are only allowed 10 photos per tracing request."]
      end

      it "should not save tracing request if new photos and existing photos are more than 10" do
        photos = []
        (1..5).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 5

        photos = []
        (6..11).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request.photos = photos
        tracing_request.save.should == false
        tracing_request['photo_keys'].size == 5
        tracing_request.errors[:photo].should == ["You are only allowed 10 photos per tracing request."]
      end

      it "should save tracing request if new and existing photos are 10" do
        photos = []
        (1..5).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 5

        photos = []
        (6..10).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 10
      end

      it "should save tracing request 10 new photos" do
        photos = []
        (1..10).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 10
      end

      it "should save tracing request after delete some photos" do
        photos = []
        (1..10).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 10

        #Should fails because it reach the limit
        tracing_request.photos = [stub_photo_properties(11)]
        tracing_request.save.should == false

        #By deleting one, it should save.
        photo_key_to_delete = tracing_request['photo_keys'][0]
        tracing_request.delete_photos([photo_key_to_delete])
        tracing_request.photos = [stub_photo_properties(11)]
        tracing_request.save
        tracing_request.new? == false
        tracing_request['photo_keys'].size == 10
        tracing_request['photo_keys'].find_index(photo_key_to_delete).should == nil
      end

      def stub_photo_properties(i)
        photo = uploadable_photo
        photo.stub(:original_filename).and_return(i.to_s)
        photo.stub(:path).and_return(i.to_s)
        photo.stub(:size).and_return(i)
        photo.stub(:content_type).and_return("image/jpg")
        photo
      end

    end

  end

  describe ".audio=" do

    before(:each) do
      @tracing_request = TracingRequest.new
      @tracing_request.stub(:attach)
      @file_attachment = mock_model(FileAttachment, :data => "My Data", :name => "some name", :mime_type => Mime::Type.lookup("audio/mpeg"))
    end

    it "should create an 'original' key in the audio hash" do
      @tracing_request.audio= uploadable_audio
      @tracing_request['audio_attachments'].should have_key('original')
    end

    it "should create a FileAttachment with uploaded file and prefix 'audio'" do
      uploaded_file = uploadable_audio
      FileAttachment.should_receive(:from_uploadable_file).with(uploaded_file, "audio").and_return(@file_attachment)
      @tracing_request.audio= uploaded_file
    end

    it "should store the audio attachment key with the 'original' key in the audio hash" do
      FileAttachment.stub(:from_uploadable_file).and_return(@file_attachment)
      @tracing_request.audio= uploadable_audio
      @tracing_request['audio_attachments']['original'].should == 'some name'
    end

    it "should store the audio attachment key with the 'mime-type' key in the audio hash" do
      FileAttachment.stub(:from_uploadable_file).and_return(@file_attachment)
      @tracing_request.audio= uploadable_audio
      @tracing_request['audio_attachments']['mp3'].should == 'some name'
    end

    it "should call delete_audio_attachment_file when set an audio file" do
      @tracing_request.id = "id"
      @tracing_request['audio_attachments'] = {}
      @tracing_request.should_receive(:delete_audio_attachment_file).and_call_original
      @tracing_request.audio = uploadable_audio_mp3
    end

  end

  describe ".delete_audio" do
    it "should call delete_audio_attachment_file when delete current audio file" do
      @tracing_request = TracingRequest.new
      @tracing_request.id = "id"
      @tracing_request['audio_attachments'] = {}
      @tracing_request.should_receive(:delete_audio_attachment_file).and_call_original
      @tracing_request.delete_audio
    end
  end

  describe ".add_audio_file" do

    before :each do
      @file = stub!("File")
      File.stub(:binread).with(@file).and_return("ABC")
      @file_attachment = FileAttachment.new("attachment_file_name", "audio/mpeg", "data")
    end

    it "should use Mime::Type.lookup to create file name postfix" do
      tracing_request = TracingRequest.new()
      Mime::Type.should_receive(:lookup).exactly(2).times.with("audio/mpeg").and_return("abc".to_sym)
      tracing_request.add_audio_file(@file, "audio/mpeg")
    end

    it "should create a file attachment for the file with 'audio' prefix, mime mediatype as postfix" do
      tracing_request = TracingRequest.new()
      Mime::Type.stub(:lookup).and_return("abc".to_sym)
      FileAttachment.should_receive(:from_file).with(@file, "audio/mpeg", "audio", "abc").and_return(@file_attachment)
      tracing_request.add_audio_file(@file, "audio/mpeg")
    end

    it "should add attachments key attachment to the audio hash using the content's media type as key" do
      tracing_request = TracingRequest.new()
      FileAttachment.stub(:from_file).and_return(@file_attachment)
      tracing_request.add_audio_file(@file, "audio/mpeg")
      tracing_request['audio_attachments']['mp3'].should == "attachment_file_name"
    end

  end

  describe ".audio" do

    before :each do
      User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
    end

    it "should return nil if no audio file has been set" do
      tracing_request = TracingRequest.new
      tracing_request.audio.should be_nil
    end

    it "should check if 'original' audio attachment is present" do
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['audio_attachments']['original'] = "ThisIsNotAnAttachmentName"
      tracing_request.should_receive(:has_attachment?).with('ThisIsNotAnAttachmentName').and_return(false)
      tracing_request.audio
    end

    it "should return nil if the recorded audio key is not an attachment" do
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['audio_attachments']['original'] = "ThisIsNotAnAttachmentName"
      tracing_request.audio.should be_nil
    end

    it "should retrieve attachment data for attachment key" do
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request.should_receive(:read_attachment).with('audio-2010-02-20T120432').and_return("Some audio")
      tracing_request.audio
    end

    it 'should create a FileAttachment with the read attachment and the attachments content type' do
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      uploaded_amr = uploadable_audio_amr
      tracing_request = TracingRequest.create('audio' => uploaded_amr, 'created_by' => "me", 'created_organisation' => "stc")
      expected_data = 'LA! LA! LA! Audio Data'
      tracing_request.stub(:read_attachment).and_return(expected_data)
      FileAttachment.should_receive(:new).with('audio-2010-02-20T120432', uploaded_amr.content_type, expected_data)
      tracing_request.audio

    end

    it 'should return nil if tracing request has not been saved' do
      tracing_request = TracingRequest.new('audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request.audio.should be_nil
    end

  end


  describe "audio attachment" do
    before :each do
      User.stub(:find_by_user_name).and_return(double(:organisation => "stc"))
    end

    it "should create a field with recorded_audio on creation" do
      Clock.stub(:now).and_return(Time.parse("Jan 20 2010 17:10:32"))
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")

      tracing_request['audio_attachments']['original'].should == 'audio-2010-01-20T171032'
    end

    it "should change audio file if a new audio file is set" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'audio' => uploadable_audio, 'created_by' => "me", 'created_organisation' => "stc")
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      tracing_request.update_attributes :audio => uploadable_audio
      tracing_request['audio_attachments']['original'].should == 'audio-2010-02-20T120432'
    end

  end

  describe "history log" do

    before do
      fields = [
          Field.new_text_field("last_known_location"),
          Field.new_text_field("relation_age"),
          Field.new_text_field("origin"),
          Field.new_radio_button("gender", ["male", "female"]),
          Field.new_photo_upload_box("current_photo_key"),
          Field.new_audio_upload_box("recorded_audio")]
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
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['last_known_location']['from'].should == 'New York'
    end

    it "should update history with 'to' value on last_known_location update" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['last_known_location']['to'].should == 'Philadelphia'
    end

    it "should update history with 'from' value on age update" do
      tracing_request = TracingRequest.create('relation_age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      tracing_request['relation_age'] = '6'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['relation_age']['from'].should == '8'
    end

    it "should update history with 'to' value on age update" do
      tracing_request = TracingRequest.create('relation_age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      tracing_request['relation_age'] = '6'
      tracing_request.save!
      changes = tracing_request['histories'].first['changes']
      changes['relation_age']['to'].should == '6'
    end

    it "should update history with a combined history record when multiple fields are updated" do
      tracing_request = TracingRequest.create('relation_age' => '8', 'last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me")
      tracing_request['relation_age'] = '6'
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      tracing_request['histories'].size.should == 2
      changes = tracing_request['histories'].first['changes']
      changes['relation_age']['from'].should == '8'
      changes['relation_age']['to'].should == '6'
      changes['last_known_location']['from'].should == 'New York'
      changes['last_known_location']['to'].should == 'Philadelphia'
    end

    it "should not record anything in the history if a save occured with no changes" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      loaded_tracing_request = TracingRequest.get(tracing_request.id)
      loaded_tracing_request.save!
      tracing_request['histories'].size.should be 1
    end

    it "should not record empty string in the history if only change was spaces" do
      tracing_request = TracingRequest.create('origin' => '', 'photo' => uploadable_photo, 'last_known_location' => 'New York', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['origin'] = '    '
      tracing_request.save!
      tracing_request['histories'].size.should be 1
    end

    it "should not record history on populated field if only change was spaces" do
      tracing_request = TracingRequest.create('last_known_location' => 'New York', 'photo' => uploadable_photo, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = ' New York   '
      tracing_request.save!
      tracing_request['histories'].size.should be 1
    end

    it "should record history for newly populated field that previously was null" do
      # gender is the only field right now that is allowed to be nil when creating tracing_request document
      tracing_request = TracingRequest.create('gender' => nil, 'last_known_location' => 'London', 'photo' => uploadable_photo, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['gender'] = 'Male'
      tracing_request.save!
      tracing_request['histories'].first['changes']['gender']['from'].should be_nil
      tracing_request['histories'].first['changes']['gender']['to'].should == 'Male'
    end

    it "should apend latest history to the front of histories" do
      tracing_request = TracingRequest.create('last_known_location' => 'London', 'photo' => uploadable_photo, 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = 'New York'
      tracing_request.save!
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.save!
      tracing_request['histories'].size.should == 3
      tracing_request['histories'][0]['changes']['last_known_location']['to'].should == 'Philadelphia'
      tracing_request['histories'][1]['changes']['last_known_location']['to'].should == 'New York'
    end

    it "should update history with username from last_updated_by" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request['last_updated_by'] = 'some_user'
      tracing_request.save!
      tracing_request['histories'].first['user_name'].should == 'some_user'
      tracing_request['histories'].first['user_organisation'].should == 'UNICEF'
    end

    it "should update history with the datetime from last_updated_at" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['last_known_location'] = 'Philadelphia'
      tracing_request.last_updated_at = DateTime.parse('2010-01-14 14:05:00UTC')
      tracing_request.save!
      tracing_request['histories'].first['datetime'].should == DateTime.parse('2010-01-14 14:05:00UTC')
    end

    describe "photo logging" do

      before :each do
        Clock.stub(:now).and_return(Time.parse("Jan 20 2010 12:04:24"))
        User.stub(:find_by_user_name).and_return(double(:organisation => 'stc'))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:24"))
      end

      it "should log new photo key on adding a photo" do
        @tracing_request.photo = uploadable_photo_jeff
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        #TODO: this should be instead tracing_request.photo_history.first.to or something like that
        changes['photo_keys']['added'].first.should =~ /photo.*?-2010-02-20T120424/
      end

      it "should log multiple photos being added" do
        @tracing_request.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys']['added'].should have(2).photo_keys
        changes['photo_keys']['deleted'].should be_nil
      end

      it "should log a photo being deleted" do
        @tracing_request.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
        @tracing_request.save
        @tracing_request.delete_photos([@tracing_request.photos.first.name])
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys']['deleted'].should have(1).photo_key
        changes['photo_keys']['added'].should be_nil
      end

      it "should select a new primary photo if the current one is deleted" do
        @tracing_request.photos = [uploadable_photo_jeff]
        @tracing_request.save
        original_primary_photo_key = @tracing_request.photos[0].name
        jeff_photo_key = @tracing_request.photos[1].name
        @tracing_request.primary_photo.name.should == original_primary_photo_key
        @tracing_request.delete_photos([original_primary_photo_key])
        @tracing_request.save
        @tracing_request.primary_photo.name.should == jeff_photo_key
      end

      it "should take the current photo key during tracing_request creation and update it appropriately with the correct format" do
        @tracing_request = TracingRequest.create('photo' => {"0" => uploadable_photo, "1" => uploadable_photo_jeff}, 'last_known_location' => 'London', 'current_photo_key' => uploadable_photo_jeff.original_filename, 'created_by' => "me", 'created_organisation' => "stc")
        @tracing_request.save
        @tracing_request.primary_photo.name.should == @tracing_request.photos.first.name
        @tracing_request.primary_photo.name.should start_with("photo-")
      end


      it "should not log anything if no photo changes have been made" do
        @tracing_request["last_known_location"] = "Moscow"
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys'].should be_nil
      end

    end

    it "should maintain history when tracing request is flagged and message is added" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request.flags = [Flag.new(:message => 'Duplicate record!', :flagged_by => "me")]
      tracing_request.save!
      flag_history = tracing_request['histories'].first['changes']['flags']
      flag_history['from'].should == []
      flag_history['to'].should == [Flag.new(:message => 'Duplicate record!', :flagged_by => "me")]
    end

    it "should maintain history when tracing_request is reunited and message is added" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_request['reunited'] = 'true'
      tracing_request['reunited_message'] = 'Finally home!'
      tracing_request.save!
      reunited_history = tracing_request['histories'].first['changes']['reunited']
      reunited_history['from'].should be_nil
      reunited_history['to'].should == 'true'
      reunited_message_history = tracing_request['histories'].first['changes']['reunited_message']
      reunited_message_history['from'].should be_nil
      reunited_message_history['to'].should == 'Finally home!'
    end

    describe "photo changes" do

      before :each do
        Clock.stub(:now).and_return(Time.parse("Jan 20 2010 12:04:24"))
        User.stub(:find_by_user_name).and_return(double(:organisation => 'stc'))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organisation' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:24"))
      end

      it "should log new photo key on adding a photo" do
        @tracing_request.photo = uploadable_photo_jeff
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        #TODO: this should be instead tracing_request.photo_history.first.to or something like that
        changes['photo_keys']['added'].first.should =~ /photo.*?-2010-02-20T120424/
      end

      it "should log multiple photos being added" do
        @tracing_request.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys']['added'].should have(2).photo_keys
        changes['photo_keys']['deleted'].should be_nil
      end

      it "should log a photo being deleted" do
        @tracing_request.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
        @tracing_request.save
        @tracing_request.delete_photos([@tracing_request.photos.first.name])
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys']['deleted'].should have(1).photo_key
        changes['photo_keys']['added'].should be_nil
      end

      it "should select a new primary photo if the current one is deleted" do
        @tracing_request.photos = [uploadable_photo_jeff]
        @tracing_request.save
        original_primary_photo_key = @tracing_request.photos[0].name
        jeff_photo_key = @tracing_request.photos[1].name
        @tracing_request.primary_photo.name.should == original_primary_photo_key
        @tracing_request.delete_photos([original_primary_photo_key])
        @tracing_request.save
        @tracing_request.primary_photo.name.should == jeff_photo_key
      end

      it "should not log anything if no photo changes have been made" do
        @tracing_request["last_known_location"] = "Moscow"
        @tracing_request.save
        changes = @tracing_request['histories'].first['changes']
        changes['photo_keys'].should be_nil
      end

      it "should delete items like _328 and _160x160 in attachments" do
        tracing_request = TracingRequest.new
        tracing_request.photo = uploadable_photo
        tracing_request.save

        photo_key = tracing_request.photos[0].name
        uploadable_photo_328 = FileAttachment.new(photo_key+"_328", "image/jpg", "data")
        uploadable_photo_160x160 = FileAttachment.new(photo_key+"_160x160", "image/jpg", "data")
        tracing_request.attach(uploadable_photo_328)
        tracing_request.attach(uploadable_photo_160x160)
        tracing_request.save
        tracing_request[:_attachments].keys.size.should == 3

        tracing_request.delete_photos [tracing_request.primary_photo.name]
        tracing_request.save
        tracing_request[:_attachments].keys.size.should == 0
      end
    end

  end

  describe "when fetching tracing request" do

    before do
      User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
    end

    it "should return list of tracing request ordered by name" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      tracing_requests = TracingRequest.all
      tracing_requests.first['relation_name'].should == 'Abu'
    end

    it "should order tracing_request with blank names first" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organisation' => "stc")
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => '', 'last_known_location' => 'POA')
      tracing_requests = TracingRequest.all
      tracing_requests.first['relation_name'].should == ''
      # TODO: Ask why all.all now?
      TracingRequest.all.all.size.should == 3
    end

  end


  describe ".photo" do

    it "should return nil if the record has no attached photo" do
      tracing_request = create_tracing_request "Bob McBobberson"
      TracingRequest.all.find { |c| c.id == tracing_request.id }.photo.should be_nil
    end

  end

  describe ".audio" do

    it "should return nil if the record has no audio" do
      tracing_request = create_tracing_request "Bob McBobberson"
      tracing_request.audio.should be_nil
    end

  end

  describe "primary_photo =" do

    before :each do
      @photo1 = uploadable_photo("capybara_features/resources/jorge.jpg")
      @photo2 = uploadable_photo("capybara_features/resources/jeff.png")
      User.stub(:find_by_user_name).and_return(double(:organisation => 'UNICEF'))
      @tracing_request = TracingRequest.new("relation_name" => "Tom", 'created_by' => "me")
      @tracing_request.photo= {0 => @photo1, 1 => @photo2}
      @tracing_request.save
    end

    it "should update the primary photo selection" do
      photos = @tracing_request.photos
      orig_primary_photo = photos[0]
      new_primary_photo = photos[1]
      @tracing_request.primary_photo_id.should == orig_primary_photo.name
      @tracing_request.primary_photo_id = new_primary_photo.name
      @tracing_request.save
      @tracing_request.primary_photo_id.should == new_primary_photo.name
    end

    context "when selected photo id doesn't exist" do

      it "should show an error" do
        lambda { @tracing_request.primary_photo_id="non-existant-id" }.should raise_error "Failed trying to set 'non-existant-id' to primary photo: no such photo key"
      end

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
      tracing_request = TracingRequest.create 'relation_name' => 'Jaco', :created_by => "mj"

      tracing_request.created_organisation.should == 'UNICEF'
    end
  end

  describe "views" do
    describe "user action log" do
      it "should return all tracing request updated by a user" do
        tracing_request = TracingRequest.create!("created_by" => "some_other_user", "last_updated_by" => "a_third_user", "relation_name" => "abc", "histories" => [{"user_name" => "brucewayne", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("brucewayne").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should not return tracing request updated by other users" do
        TracingRequest.create!("created_by" => "some_other_user", "relation_name" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("peterparker").should be_empty
      end

      it "should return the tracing request once when modified twice by the same user" do
        tracing_request = TracingRequest.create!("created_by" => "some_other_user", "relation_name" => "ghi", "histories" => [{"user_name" => "peterparker", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "peterparker", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        TracingRequest.all_connected_with("peterparker").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should return the tracing request created by a user" do
        tracing_request = TracingRequest.create!("created_by" => "a_user", "relation_name" => "def", "histories" => [{"user_name" => "clarkkent", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}])

        TracingRequest.all_connected_with("a_user").should == [TracingRequest.get(tracing_request.id)]
      end

      it "should not return duplicate records when same user had created and updated same tracing request multiple times" do
        tracing_request = TracingRequest.create!("created_by" => "tonystark", "relation_name" => "ghi", "histories" => [{"user_name" => "tonystark", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}, {"user_name" => "tonystark", "changes" => {"sex" => {"to" => "female", "from" => "male"}}}])

        TracingRequest.all_connected_with("tonystark").should == [TracingRequest.get(tracing_request.id)]
      end
    end

  end


  describe 'reindex' do
    it 'should reindex every 24 hours' do
      scheduler = double()
      scheduler.should_receive(:every).with('24h').and_yield()
      TracingRequest.should_receive(:reindex!).once.and_return(nil)
      TracingRequest.schedule scheduler
    end
  end

  describe 'validate dates and date ranges fields' do
    before do
      fields = [Field.new({"name" => "a_date_field",
                           "type" => "date_field",
                           "display_name_all" => "A Date Field"
                          }),
                Field.new({"name" => "a_range_field",
                           "type" => "date_range",
                           "display_name_all" => "A Range Field"
                          })]
      FormSection.create_or_update_form_section({
        :unique_id=> "form_section_with_dates_fields",
        "visible" => true,
        :order => 1,
        "editable" => true,
        :fields => fields,
        :perm_enabled => true,
        :parent_form=>"tracing_request",
        "name_all" => "Form Section With Dates Fields",
        "description_all" => "Form Section With Dates Fields",
      })
    end

    it "should validate single date field" do
      #date field invalid.
      tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "asldkfjlj3234"
      tracing_request.errors[:a_date_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #date valid.
      tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "30-May-2014"
      tracing_request.errors[:a_date_field].should eq([])
    end

    it "should validate range fields" do
      #_from is wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lkjlj", :a_range_field_to => "31-May-2014"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_to is wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "lk2j3lk45"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_from and _to are wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lk2j34lkj", :a_range_field_to => "akdf34lk4j"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #range valid dates.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "31-May-2014"
      tracing_request.errors[:a_range_field].should eq([])
    end
  end

  private

  def create_tracing_request(name, options={})
    options.merge!("relation_name" => name, "last_known_location" => "new york", 'created_by' => "me", 'created_organisation' => "stc")
    TracingRequest.create(options)
  end

  def create_tracing_request_with_created_by(created_by,options = {})
    user = User.new({:user_name => created_by, :organisation=> "UNICEF"})
    TracingRequest.new_with_user_name user, options
  end
end
