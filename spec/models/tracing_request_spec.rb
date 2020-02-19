require 'rails_helper'
require 'sunspot'
require 'will_paginate'

describe TracingRequest do

  before :each do
    clean_data(Field, FormSection)
    TracingRequest.any_instance.stub(:field_definitions).and_return([])
  end

  # TODO: Fix when models validations be ready
  # it_behaves_like "a valid record" do
  #   fields = [
  #     Field.new(:type => Field::DATE_FIELD, :name => "a_datefield", :display_name => "A date field"),
  #     Field.new(:type => Field::TEXT_AREA, :name => "a_textarea", :display_name => "A text area"),
  #     Field.new(:type => Field::TEXT_FIELD, :name => "a_textfield", :display_name => "A text field"),
  #     Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield", :display_name => "A numeric field"),
  #     Field.new(:type => Field::NUMERIC_FIELD, :name => "a_numericfield_2", :display_name => "A second numeric field")
  #   ]
  #   let(:record) {
  #     FormSection.stub(:all_visible_form_fields => fields )
  #     TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
  #     TracingRequest.new
  #   }
  # end

  describe 'build solar schema' do

    before(:each) do
      clean_data(FormSection, Field)
      form = create(:form_section, parent_form: "tracing_request", is_nested: false)
      %w(approval_status_bia
         approval_status_case_plan
         approval_status_closure
         transfer_status).each {|f| create(:select_field, name: f, multi_select: false, form_section_id: form.id) }
      create(:field, :date_with_datetime, name: "created_at", form_section_id: form.id)
      create(:field, :date_range_with_datetime, name: "last_updated_at", form_section_id: form.id)
    end

    it "should build with free text search fields" do
      Field.stub(:all_searchable_field_names).and_return []
      TracingRequest.searchable_string_fields.should =~ ["unique_identifier", "short_id", "created_by", "created_by_full_name",
                                                         "last_updated_by", "last_updated_by_full_name","created_organization",
                                                         "owned_by_agency_id", "owned_by_location",
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
  end

  xdescribe ".search" do
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

  describe 'save' do
    before(:each) do
      clean_data(Agency)
      create(:agency)
    end

    it "should save with generated tracing request_id and inquiry_date" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'relation_age' => '6')
      tracing_request.save!
      tracing_request[:id].should_not be_nil
      tracing_request.inquiry_date.should_not be_nil
    end

    it "should allow edit inquiry_date" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'relation_age' => '6', 'inquiry_date' => '19/Jul/2014')
      tracing_request.save!
      tracing_request[:id].should_not be_nil
      tracing_request.inquiry_date.should eq '19/Jul/2014'
    end
  end

  describe "new_with_user_name" do

    it "should create regular tracing request fields" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'location_last' => 'London', 'relation_age' => '6')
      tracing_request.location_last.should == 'London'
      tracing_request.relation_age.should == '6'
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return("191fc236-71f4-4a76-be09-f2d8c442e1fd")
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London')
      tracing_request.save!
      tracing_request.data['unique_identifier'].should == "191fc236-71f4-4a76-be09-f2d8c442e1fd"
    end

    it "should not create a unique id if already exists" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London', 'unique_identifier' => 'rapidftrxxx5bcde')
      tracing_request.data['unique_identifier'].should == "rapidftrxxx5bcde"
    end

    it "should create a created_by field with the user name" do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'some_field' => 'some_value')
      tracing_request.data['created_by'].should == 'jdoe'
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
      SecureRandom.stub("uuid").and_return("191fc236-71f4-4a76-be09-f2d8c442e1fd")
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.unique_identifier.should == "191fc236-71f4-4a76-be09-f2d8c442e1fd"
    end

    it "should return last 7 characters of unique id as short id" do
      SecureRandom.stub("uuid").and_return("191fc236-71f4-4a76-be09-f2d8c442e1fd")
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.short_id.should == "442e1fd"
    end

  end

  it "should maintain history when tracing_request is reunited and message is added" do
    tracing_request = TracingRequest.create('created_by' => "me", 'created_organization' => "stc")
    tracing_request.reunited = true
    tracing_request.save!
    reunited_history = tracing_request.histories.first.record_changes["reunited"]
    reunited_history['from'].should be_nil
    reunited_history['to'].should == true
  end

  describe "when fetching tracing request" do

    before do
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
      TracingRequest.all.each { |tracing_request| tracing_request.destroy }
    end

    it "should return list of tracing request ordered by name" do
      SecureRandom.stub("uuid").and_return(12345)
      TracingRequest.create('relation_name' => 'Zbu', 'location_last' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      TracingRequest.create('relation_name' => 'Abu', 'location_last' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      tracing_requests = TracingRequest.all.order("data -> 'relation_name' ASC")
      tracing_requests.first.relation_name.should == 'Abu'
    end

    it "should order tracing_request with blank names first" do
      SecureRandom.stub("uuid").and_return(12345)
      TracingRequest.create('relation_name' => 'Zbu', 'location_last' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      TracingRequest.create('relation_name' => 'Abu', 'location_last' => 'POA', 'created_by' => "me", 'created_organization' => "stc")
      TracingRequest.create('relation_name' => '', 'location_last' => 'POA')
      tracing_requests = TracingRequest.all.order("data -> 'relation_name' ASC")
      tracing_requests.first.relation_name.should == ''
      TracingRequest.count.should == 3
    end
  end

  describe 'organization' do
    it 'should get created user' do
      tracing_request = TracingRequest.new
      tracing_request.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      tracing_request.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organization => 'UNICEF'))
      tracing_request = TracingRequest.create 'relation_name' => 'Jaco', :created_by => "mj"

      tracing_request.created_organization.should == 'UNICEF'
    end
  end

  # describe 'validate dates and date ranges fields' do
  #   before do
  #     fields = [Field.new({"name" => "a_date_field",
  #                          "type" => "date_field",
  #                          "display_name_all" => "A Date Field"
  #                         }),
  #               Field.new({"name" => "a_range_field",
  #                          "type" => "date_range",
  #                          "display_name_all" => "A Range Field"
  #                         })]
  #     TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
  #     FormSection.create_or_update_form_section({
  #       :unique_id=> "form_section_with_dates_fields",
  #       "visible" => true,
  #       :order => 1,
  #       "editable" => true,
  #       :fields => fields,
  #       :parent_form=>"tracing_request",
  #       "name_all" => "Form Section With Dates Fields",
  #       "description_all" => "Form Section With Dates Fields",
  #     })
  #   end

  #   it "should validate single date field" do
  #     #date field invalid.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "asldkfjlj3234", :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_date_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

  #     #date valid.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_date_field => "30-May-2014", :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_date_field].should eq([])
  #   end

  #   it "should validate range fields" do
  #     #_from is wrong.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lkjlj", :a_range_field_to => "31-May-2014",
  #                                               :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

  #     #_to is wrong.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "lk2j3lk45",
  #                                               :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

  #     #_from and _to are wrong.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "lk2j34lkj", :a_range_field_to => "akdf34lk4j",
  #                                               :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

  #     #range valid dates.
  #     tracing_request = create_tracing_request "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "31-May-2014",
  #                                               :a_range_field_date_or_date_range => "date_range"
  #     tracing_request.errors[:a_range_field].should eq([])
  #   end
  # end

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

  xdescribe 'match criteria' do
    before do
      fields = [
        Field.new({"name" => "name",
                   "type" => "text_field",
                   "display_name_all" => "name",
                   "matchable" => true
                  }),
        Field.new({"name" => "name_nickname",
                  "type" => "text_field",
                  "display_name_en" => "Nickname",
                  "matchable" => true
                  }),
        Field.new({"name" => "sex",
                   "type" => "text_field",
                   "display_name_en" => "Sex",
                   "matchable" => true
                  }),
        Field.new({"name" => "age",
                   "type" => "numeric_field",
                   "display_name_all" => "Age"
                  })]
      TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
      FormSection.create_or_update_form_section({
        :unique_id=> "form_section_test",
        "visible" => true,
        :order => 1,
        "editable" => true,
        :fields => fields,
        :parent_form=>"tracing_request",
        "name_all" => "Form Section With Dates Fields",
        "description_all" => "Form Section With Dates Fields",
      })
    end

    tr1 = TracingRequest.create(:relation_name => "John cena", :relation_nickname => "you cant see me", :relation_age => 11)
    tr2 = TracingRequest.create(:relation_name => "Rock", :relation_age => 14)
    tr3 = TracingRequest.create(:relation_age => 50)
    matching_fields = { form_section_test: ["name"] }

    context 'when field in match_fields' do
      it 'should find all values in match criteria' do
        expect(tr1.match_criteria(tr1)).to eq({:name=>[tr1.relation_nickname, tr1.relation_name], :sex=>[tr1.sex]})
      end

      it 'should find matchable_fields values in match criteria' do
        expect(tr1.match_criteria(tr1, matching_fields)).to eq({:name=>[tr1.name, tr1.name_nickname]})
      end
    end

    context 'when field not in match_fields' do
      it 'should find exact match criteria' do
        expect(tr2.match_criteria(tr2)).to eq({:name=>[tr2.name], :sex=>[tr2.sex]})
      end

      it 'should find exact match criteria with matchable_fields' do
        expect(tr2.match_criteria(tr2, matching_fields)).to eq({:name=>[tr2.name]})
      end
    end

    context 'when field is not matchable' do
      it 'should find no criteria' do
        expect(tr3.match_criteria(tr3)).to eq({})
      end

      it 'should find no criteria with matchable_fields' do
        expect(tr3.match_criteria(tr3, matching_fields)).to eq({})
      end
    end
  end

  describe "tracing_request_subform_details" do
    before do
      FormSection.destroy_all
      Dir[File.dirname(__FILE__) + '/../../db/forms/tracing_request/*.rb'].each {|file| load file }
      #Reload the form properties
      TracingRequest.destroy_all

      @tracing_request1 = TracingRequest.new("tracing_request_subform_section": [{"name": "Judy", "name_other": "Uzair"},
                                                                                 {"name": "Cena", "other_name": "John"}].map(&:with_indifferent_access))
      @tracing_request2 = TracingRequest.new("tracing_request_subform_section": ["name": "Judy", "name_other": "Uzair"].map(&:with_indifferent_access),
                                             "relation_name" => "Brad")
      @tracing_request3 = TracingRequest.new("relation_name" => "Dave", "relation" => "Mother")
    end


    context 'when mutiple fields' do
      it "should return the names" do
        expect(@tracing_request1.tracing_request_subform_details("name")).to eq("Judy Cena")
      end
    end

    context 'when single field' do
      it 'should return a single other name' do
        expect(@tracing_request2.tracing_request_subform_details("name_other")).to eq("Uzair")
      end
    end

    context 'when no fields' do
      it 'should find no subform details' do
        expect(@tracing_request3.tracing_request_subform_details("relation")).to eq("")
      end
    end
  end

  private

  def create_tracing_request(name, options={})
    options.merge!("relation_name" => name, "location_last" => "new york", 'created_by' => "me", 'created_organization' => "stc")
    TracingRequest.create(options)
  end

  def create_tracing_request_with_created_by(created_by,options = {})
    user = User.new(user_name: created_by, agency_id: Agency.last.id)
    TracingRequest.new_with_user(user, options)
  end
end