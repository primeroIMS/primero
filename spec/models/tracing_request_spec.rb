require 'rails_helper'
require 'sunspot'

describe TracingRequest do

  before :each do
    TracingRequest.any_instance.stub(:field_definitions).and_return([])
  end

  it_behaves_like "a valid record" do
    fields = [
      Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A date field"),
      Field.new(:type => Field::TEXT_AREA, :name => "a_textarea", :display_name => "A text area"),
      Field.new(:type => Field::TEXT_FIELD, :name => "a_textfield", :display_name => "A text field"),
      Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield", :display_name => "A numeric field"),
      Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield_2", :display_name => "A second numeric field")
    ]
    let(:record) {
      FormSection.stub(:all_visible_form_fields => fields )
      TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
      TracingRequest.new
    }
  end

  describe 'build solar schema' do

    it "should build with free text search fields" do
      Field.stub(:all_searchable_field_names).and_return []
      TracingRequest.searchable_string_fields.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name",
                                                         "last_updated_by", "last_updated_by_full_name","created_organization",
                                                         "owned_by_agency", "owned_by_location", "owned_by_agency_office",
                                                         "approval_status_bia", "approval_status_case_plan", "approval_status_closure",
                                                         "transfer_status"]
    end

    it "should build with date/time search fields" do
      expect(TracingRequest.searchable_date_time_fields).to include("created_at", "last_updated_at")
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
    #   tracing_request_active = TracingRequest.create(:name => "eduardo aquiles", 'created_by' => "me", 'created_organization' => "stc")
    #   tracing_request_duplicate = TracingRequest.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organization' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = TracingRequest.search(search)

    #   result.first.map(&:name).should == ["eduardo aquiles"]
    # end

    # it "should return tracing request that have duplicate as false" do
    #   tracing_request_active = TracingRequest.create(:name => "eduardo aquiles", :duplicate => false, 'created_by' => "me", 'created_organization' => "stc")
    #   tracing_request_duplicate = TracingRequest.create(:name => "aquiles", :duplicate => true, 'created_by' => "me", 'created_organization' => "stc")

    #   search = double("search", :query => "aquiles", :valid? => true)
    #   result = TracingRequest.search(search)

    #   result.first.map(&:name).should == ["eduardo aquiles"]
    # end

    # it "should search by exact match for short id" do
    #   uuid = UUIDTools::UUID.random_create.to_s
    #   TracingRequest.create("relation_name" => "kev", :unique_identifier => "1234567890", "last_known_location" => "new york", 'created_by' => "me", 'created_organization' => "stc")
    #   TracingRequest.create("relation_name" => "kev", :unique_identifier => "0987654321", "last_known_location" => "new york", 'created_by' => "me", 'created_organization' => "stc")
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
    #   TracingRequest.create(:name => "suganthi", 'created_by' => "me", 'created_organization' => "stc")
    #   TracingRequest.create(:name => "kavitha", 'created_by' => "you", 'created_organization' => "stc")
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

    it "should populate last_updated_by field with the user_name who is updating" do
      tracing_request = TracingRequest.new
      tracing_request.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      tracing_request.last_updated_by.should == 'jdoe'
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
      tracing_request['_attachments']['sample']['data'].should_not be_blank
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
      tracing_request['_attachments']['sample']['data'].should_not be_blank
      tracing_request['_attachments']['sample']['content_type'].should eq("audio/amr")
      tracing_request['audio_attachments']['original'].should == "sample"
      tracing_request['audio_attachments']['amr'].should == "sample"
      tracing_request['audio_attachments']['mp3'].should be_nil
      #Others
      tracing_request['recorded_audio'].should == "sample"
      tracing_request['relation_name'].should be_nil

      #Update the tracing_request so a new audio is loaded.
      properties = {:relation_name => "Some TracingRequest Name"}
      tracing_request.update_properties_with_user_name 'Jane Doe', nil, nil, uploadable_audio_mp3, false, properties

      #Validate the new file was stored.
      tracing_request['_attachments']['sample']['data'].should_not be_blank
      tracing_request['_attachments']['sample']['content_type'].should eq("audio/mpeg")
      tracing_request['audio_attachments']['original'].should == "sample"
      tracing_request['audio_attachments']['mp3'].should == "sample"
      tracing_request['audio_attachments']['amr'].should be_nil
      #Others
      tracing_request['recorded_audio'].should == "sample"
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
      tracing_request['_attachments']['sample']['data'].should_not be_blank
      tracing_request['_attachments']['sample']['content_type'].should eq("audio/amr")
      tracing_request['audio_attachments']['original'].should == "sample"
      tracing_request['audio_attachments']['amr'].should == "sample"
      tracing_request['audio_attachments']['mp3'].should be_nil
      #Others
      tracing_request['recorded_audio'].should == "sample"
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
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organization' => "stc")
      photo = uploadable_jpg_photo_without_file_extension
      tracing_request[:photo] = photo
      tracing_request.save.present?.should == true
    end

    it "should not save with file formats that are not supported audio formats" do
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organization' => "stc")
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
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organization' => "stc")
      tracing_request.photo = photo
      tracing_request.save.present?.should == true
      loaded_tracing_request = TracingRequest.get(tracing_request.id)
      loaded_tracing_request.save.present?.should == true
      loaded_tracing_request.photo = uploadable_text_file
      loaded_tracing_request.save.should == false
    end

    it "should not save with a photo larger than 10 megabytes" do
      photo = uploadable_large_photo
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organization' => "stc")
      tracing_request.photo = photo
      tracing_request.save.should == false
    end

    it "should not save with an audio file larger than 10 megabytes" do
      tracing_request = TracingRequest.new('created_by' => "me", 'created_organization' => "stc")
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
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
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
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
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
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
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
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      end

      it "should not save tracing request if new photos are more than 10" do
        photos = []
        (1..11).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        tracing_request.photos = photos
        tracing_request.save.should == false
        tracing_request.errors[:photo].should == ["You are only allowed 10 photos per tracing request."]
      end

      it "should not save tracing request if new photos and existing photos are more than 10" do
        photos = []
        (1..5).each do |i|
          photos << stub_photo_properties(i)
        end
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
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
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
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
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
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
        tracing_request = TracingRequest.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        tracing_request.photos = photos
        tracing_request.save
        tracing_request.new? == false
        tracing_request.photo_keys.size == 10

        #Should fails because it reach the limit
        tracing_request.photos = [stub_photo_properties(11)]
        tracing_request.save.should == false

        #By deleting one, it should save.
        photo_key_to_delete = tracing_request['photo_keys'][0]
        tracing_request.delete_photos([photo_key_to_delete])
        tracing_request.photos = [stub_photo_properties(11)]
        tracing_request.save
        tracing_request.new? == false
        tracing_request.photo_keys.size == 10
        tracing_request.photo_keys.find_index(photo_key_to_delete).should == nil
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
      @file = stub("File")
      File.stub(:binread).with(@file).and_return("ABC")
      @file_attachment = FileAttachment.new("attachment_file_name", "audio/mpeg", "data")
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
      User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
    end

    it "should return nil if no audio file has been set" do
      tracing_request = TracingRequest.new
      tracing_request.audio.should be_nil
    end

    it "should check if 'original' audio attachment is present" do
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")
      tracing_request['audio_attachments']['original'] = "ThisIsNotAnAttachmentName"
      tracing_request.should_receive(:has_attachment?).with('ThisIsNotAnAttachmentName').and_return(false)
      tracing_request.audio
    end

    it "should return nil if the recorded audio key is not an attachment" do
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")
      tracing_request['audio_attachments']['original'] = "ThisIsNotAnAttachmentName"
      tracing_request.audio.should be_nil
    end

    it "should retrieve attachment data for attachment key" do
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      tracing_request = TracingRequest.create('audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")
      tracing_request.should_receive(:read_attachment).with('sample').and_return("Some audio")
      tracing_request.audio
    end

    it 'should create a FileAttachment with the read attachment and the attachments content type' do
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      uploaded_amr = uploadable_audio_amr
      tracing_request = TracingRequest.create('audio' => uploaded_amr, 'created_by' => "me", 'created_organization' => "stc")
      expected_data = 'LA! LA! LA! Audio Data'
      tracing_request.stub(:read_attachment).and_return(expected_data)
      FileAttachment.should_receive(:new).with('sample', uploaded_amr.content_type, expected_data)
      tracing_request.audio

    end

    it 'should return nil if tracing request has not been saved' do
      tracing_request = TracingRequest.new('audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")
      tracing_request.audio.should be_nil
    end

  end


  describe "audio attachment" do
    before :each do
      User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
    end

    it "should create a field with recorded_audio on creation" do
      Clock.stub(:now).and_return(Time.parse("Jan 20 2010 17:10:32"))
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")

      tracing_request['audio_attachments']['original'].should == 'sample'
    end

    it "should change audio file if a new audio file is set" do
      tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'audio' => uploadable_audio, 'created_by' => "me", 'created_organization' => "stc")
      Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      tracing_request.update_attributes :audio => uploadable_audio
      tracing_request['audio_attachments']['original'].should == 'sample'
    end

  end

  it "should maintain history when tracing_request is reunited and message is added" do
    tracing_request = TracingRequest.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
    tracing_request.reunited = true
    tracing_request.save!
    reunited_history = tracing_request.histories.first.changes['reunited']
    reunited_history['from'].should be_nil
    reunited_history['to'].should == true
  end

  describe "when fetching tracing request" do

    before do
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
    end

    it "should return list of tracing request ordered by name" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      tracing_requests = TracingRequest.all
      tracing_requests.first['relation_name'].should == 'Abu'
    end

    it "should order tracing_request with blank names first" do
      UUIDTools::UUID.stub("random_create").and_return(12345)
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Zbu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      TracingRequest.create('photo' => uploadable_photo, 'relation_name' => 'Abu', 'last_known_location' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
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
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
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
        expect { @tracing_request.primary_photo_id="non-existant-id" }.to raise_error(RuntimeError, "Failed trying to set 'non-existant-id' to primary photo: no such photo key")
      end

    end

  end

  describe 'organization' do
    it 'should get created user' do
      tracing_request = TracingRequest.new
      tracing_request['created_by'] = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      tracing_request.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organization => 'UNICEF'))
      tracing_request = TracingRequest.create 'relation_name' => 'Jaco', :created_by => "mj"

      tracing_request.created_organization.should == 'UNICEF'
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
      TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
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
      tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "asldkfjlj3234", :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_date_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #date valid.
      tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "30-May-2014", :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_date_field].should eq([])
    end

    it "should validate range fields" do
      #_from is wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lkjlj", :a_range_field_to => "31-May-2014",
                                                :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_to is wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "lk2j3lk45",
                                                :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_from and _to are wrong.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lk2j34lkj", :a_range_field_to => "akdf34lk4j",
                                                :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #range valid dates.
      tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "31-May-2014",
                                                :a_range_field_date_or_date_range => "date_range"
      tracing_request.errors[:a_range_field].should eq([])
    end
  end

  describe "mother and father" do
    before :each do
      @tracing_request1 = create_tracing_request "Judy", :relation => "Mother"
      @tracing_request2 = create_tracing_request "Brad", :relation => "Father"
      @tracing_request3 = create_tracing_request "Velma", :relation => "Sister"
    end

    it "should return mothers name" do
      expect(@tracing_request1.mothers_name).to eq("Judy")
    end

    it "should return fathers name" do
      expect(@tracing_request2.fathers_name).to eq("Brad")
    end

    context "mother not set" do
      it "should return nil for mother" do
        expect(@tracing_request3.mothers_name).to be_nil
      end
    end

    context "father not set" do
      it "should return nil for father" do
        expect(@tracing_request3.fathers_name).to be_nil
      end
    end

  end

  describe "Batch processing" do
    before do
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
    end

    it "should process in two batches" do
      tracing_request1 = TracingRequest.new('created_by' => "user1", :name => "tracing_request1")
      tracing_request2 = TracingRequest.new('created_by' => "user2", :name => "tracing_request2")
      tracing_request3 = TracingRequest.new('created_by' => "user3", :name => "tracing_request3")
      tracing_request4 = TracingRequest.new('created_by' => "user4", :name => "tracing_request4")
      tracing_request4.save!
      tracing_request3.save!
      tracing_request2.save!
      tracing_request1.save!

      expect(TracingRequest.all.page(1).per(3).all).to include(tracing_request1, tracing_request2, tracing_request3)
      expect(TracingRequest.all.page(2).per(3).all).to include(tracing_request4)
      TracingRequest.should_receive(:all).exactly(3).times.and_call_original

      records = []
      TracingRequest.each_slice(3) do |tracing_requests|
        tracing_requests.each{|t| records << t.name}
      end

      records.should eq(["tracing_request1", "tracing_request2", "tracing_request3", "tracing_request4"])
    end

    it "should process in 0 batches" do
      TracingRequest.should_receive(:all).exactly(1).times.and_call_original
      records = []
      TracingRequest.each_slice(3) do |tracing_requests|
        tracing_requests.each{|t| records << t.name}
      end
      records.should eq([])
    end

  end

  private

  def create_tracing_request(name, options={})
    options.merge!("relation_name" => name, "last_known_location" => "new york", 'created_by' => "me", 'created_organization' => "stc")
    TracingRequest.create(options)
  end

  def create_tracing_request_with_created_by(created_by,options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    TracingRequest.new_with_user_name user, options
  end
end
