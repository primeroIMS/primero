require 'rails_helper'

describe Incident do

  it_behaves_like "a valid record" do
    let(:record) {
      fields = [
        Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A date field"),
        Field.new(:type => Field::TEXT_AREA, :name => "a_textarea", :display_name => "A text area"),
        Field.new(:type => Field::TEXT_FIELD, :name => "a_textfield", :display_name => "A text field"),
        Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield", :display_name => "A numeric field"),
        Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield_2", :display_name => "A second numeric field")
      ]
      Incident.any_instance.stub(:field_definitions).and_return(fields)
      FormSection.stub(:all_visible_form_fields => fields)
      Incident.new
    }
  end

  describe 'build solar schema' do
    # TODO: Ask about these test
    it "should build with free text search fields" do
      Field.stub(:all_searchable_field_names).and_return []
      Incident.searchable_string_fields.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name",
                                                   "last_updated_by", "last_updated_by_full_name","created_organization",
                                                   "owned_by_agency", "owned_by_location",
                                                   "approval_status_bia", "approval_status_case_plan", "approval_status_closure",
                                                   "transfer_status"]
    end

    it "should build with date/time search fields" do
      expect(Incident.searchable_date_time_fields).to  include("created_at", "last_updated_at")
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

    # TODO: full text searching not implemented yet. Effects the next 13 test.
    # it "should return all results" do
    #   40.times do
    #     create_incident("Exact")
    #   end
    #   criteria_list = SearchCriteria.build_from_params("1" => {:field => "description", :value => "Exact", :join => "AND", :display_name => "description" } )
    #   query = SearchCriteria.lucene_query(criteria_list)
    #   Incident.sunspot_search(1, query).last.count.should == 40
    # end
  end

  describe "update_properties_with_user_name" do

    it "should replace old properties with updated ones" do
      incident = Incident.new("name" => "Dave", "age" => "28", "last_known_location" => "London")
      new_properties = {"name" => "Dave", "age" => "35"}
      incident.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      incident['age'].to_s.should == "35"
      incident['name'].should == "Dave"
      incident['last_known_location'].should == "London"
    end

    it "should not replace old properties when when missing from update" do
      incident = Incident.new("origin" => "Croydon", "last_known_location" => "London")
      new_properties = {"last_known_location" => "Manchester"}
      incident.update_properties_with_user_name "some_user", nil, nil, nil, false, new_properties
      incident['last_known_location'].should == "Manchester"
      incident['origin'].should == "Croydon"
    end

    it "should populate last_updated_by field with the user_name who is updating" do
      incident = Incident.new
      incident.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      incident.last_updated_by.should == 'jdoe'
    end

  end


  describe 'save' do

    it "should save with generated incident_id" do
      Incident.any_instance.stub(:field_definitions).and_return([])
      incident = create_incident_with_created_by('jdoe', 'description' => 'London')
      incident.save!
      incident[:incident_id].should_not be_nil
    end

  end

  describe "new_with_user_name" do

    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it "should create regular incident fields" do
      incident = create_incident_with_created_by('jdoe', 'description' => 'London', 'age' => '6')
      incident['description'].should == 'London'
      incident['age'].to_s.should == "6"
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return(12345)
      incident = create_incident_with_created_by('jdoe')
      incident.save!
      incident['unique_identifier'].should == "12345"
    end

    it "should not create a unique id if already exists" do
      incident = create_incident_with_created_by('jdoe', 'unique_identifier' => 'primeroxxx5bcde')
      incident.save!
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
        incident['created_at'].should == "2010-01-14 14:05:00UTC"
      end
    end
  end

  describe "unique id" do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return(12345)
      incident = Incident.new
      incident.save!
      incident.unique_identifier.should == "12345"
    end

    it "should return last 7 characters of unique id as short id" do
      SecureRandom.stub("uuid").and_return(1212127654321)
      incident = Incident.new
      incident.save!
      incident.short_id.should == "7654321"
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

  describe "validation" do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it "should disallow uploading executable files for documents" do
      incident = Incident.new
      incident.upload_other_document = [{'document' => uploadable_executable_file}]
      incident.should_not be_valid
    end

    it "should disallow uploading more than 100 documents" do
      documents = []
      101.times { documents.push({'document' => uploadable_photo_gif}) }
      incident = Incident.new
      incident.upload_other_document = documents
      incident.should_not be_valid
    end

    it "should disallow uploading a document larger than 2 megabytes" do
      incident = Incident.new
      incident.upload_other_document = [{'document' => uploadable_large_photo}]
      incident.should_not be_valid
    end
  end

  describe "views" do
    describe "user action log" do
      before :each do
        Incident.any_instance.stub(:field_definitions).and_return([])
      end


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


  describe "Batch processing" do
    before do
      Incident.all.each { |incident| incident.destroy }
    end

    it "should process in two batches" do
      incident1 = Incident.new('created_by' => "user1", :name => "incident1")
      incident2 = Incident.new('created_by' => "user2", :name => "incident2")
      incident3 = Incident.new('created_by' => "user3", :name => "incident3")
      incident4 = Incident.new('created_by' => "user4", :name => "incident4")
      incident4.save!
      incident3.save!
      incident2.save!
      incident1.save!

      expect(Incident.all.page(1).per(3).all).to include(incident1, incident2, incident3)
      expect(Incident.all.page(2).per(3).all).to include(incident4)
      Incident.should_receive(:all).exactly(3).times.and_call_original

      records = []
      Incident.each_slice(3) do |incidents|
        incidents.each{|i| records << i.name}
      end

      records.should eq(["incident1", "incident2", "incident3", "incident4"])
    end

    it "should process in 0 batches" do
      Incident.should_receive(:all).exactly(1).times.and_call_original
      records = []
      Incident.each_slice(3) do |incidents|
        incidents.each{|i| records << i.name}
      end
      records.should eq([])
    end

  end

  describe "all ids and revs" do
    before do
      Incident.all.each &:destroy
      @owner = create :user
      @owner2 = create :user
      @incident1 = create_incident_with_created_by(@owner.user_name, :marked_for_mobile => true, :module_id => PrimeroModule::GBV)
      @incident2 = create_incident_with_created_by(@owner.user_name, :marked_for_mobile => false, :module_id => PrimeroModule::MRM)
      @incident3 = create_incident_with_created_by(@owner2.user_name, :marked_for_mobile => true, :module_id => PrimeroModule::MRM)
      @incident4 = create_incident_with_created_by(@owner2.user_name, :marked_for_mobile => false, :module_id => PrimeroModule::GBV)

      @incident1.create!
      @incident2.create!
      @incident3.create!
      @incident4.create!
    end

    context 'when mobile' do
      context 'and module id is MRM' do
        it 'returns all MRM mobile _ids and revs' do
          ids_and_revs = Incident.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', PrimeroModule::MRM)
          expect(ids_and_revs.count).to eq(1)
          expect(ids_and_revs).to eq([{"_id" => @incident3.id, "_rev" => @incident3.rev}])
        end
      end

      context 'and module id is GBV' do
        it 'returns all GBV mobile _ids and revs' do
          ids_and_revs = Incident.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', PrimeroModule::GBV)
          expect(ids_and_revs.count).to eq(1)
          expect(ids_and_revs).to eq([{"_id" => @incident1.id, "_rev" => @incident1.rev}])
        end
      end

      context 'and module id is not provided' do
        it 'returns all mobile _ids and revs' do
          ids_and_revs = Incident.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', '')
          expect(ids_and_revs.count).to eq(2)
          expect(ids_and_revs).to include({"_id" => @incident1.id, "_rev" => @incident1.rev},
                                          {"_id" => @incident3.id, "_rev" => @incident3.rev})
        end
      end
    end

    context 'when not mobile' do
      it 'returns all _ids and revs' do
        ids_and_revs = Incident.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], false, '2000/01/01', '')
        expect(ids_and_revs.count).to eq(4)
        expect(ids_and_revs).to include({"_id" => @incident1.id, "_rev" => @incident1.rev},
                                        {"_id" => @incident2.id, "_rev" => @incident2.rev},
                                        {"_id" => @incident3.id, "_rev" => @incident3.rev},
                                        {"_id" => @incident4.id, "_rev" => @incident4.rev})
      end
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
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    Incident.new_with_user_name user, options
  end
end
