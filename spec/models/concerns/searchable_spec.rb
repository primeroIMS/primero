require 'rails_helper'

describe "Searchable" do

  before :each do
    Sunspot.remove_all(Child)
  end

  before :all do
    form = FormSection.new(:name => "test_form", :unique_id => 'test_form', :parent_form => 'case')
    form.fields << Field.new(:name => "text_field1", :type => Field::TEXT_FIELD, :display_name => "Text Field 1")
    form.fields << Field.new(:name => "tick_field1", :type => Field::TICK_BOX, :display_name => "Tick Field 1")
    form.fields << Field.new(:name => "tick_field2", :type => Field::TICK_BOX, :display_name => "Tick Field 2")
    form.fields << Field.new(:name => "date_field1", :type => Field::DATE_FIELD, :display_name => "Date Field 1")
    form.fields << Field.new(:name => "registration_date", :type => Field::DATE_FIELD, :display_name => "Date Field 1", :date_include_time => true)
    form.save!
  end

  after :all do
    Field.destroy_all
    FormSection.destroy_all
  end

  describe "Text Query" do

    xit "should return empty array for no match" do
      #TODO pending "Write this test!"
    end

    xit "should return an exact match" do
      #TODO pending "Write this test!"
    end

    xit "should return a match that starts with the query" do
      #TODO pending "Write this test!"
    end

    xit "should return a fuzzy match" do
      #TODO pending "Fuzzy search isn't implemented yet"
    end

    xit "should search by exact match for short id" do
      #TODO pending "Write this test!"
    end


    xit "should match more than one word" do
      #TODO pending "Write this test!"
    end

    xit "should match more than one word with fuzzy search" do
      #TODO pending "Fuzzy search isn't implemented yet"
    end

    xit "should match more than one word with starts with" do
      #TODO pending "Are we even doing startswith searches for names?"
    end
  end

  describe "Filtering" do
  end


  describe "Solr schema" do
    it "should build with date search fields" do
      expect(Child.searchable_date_fields).to include("date_field1")
    end


    it "should build with date time search fields" do
      expect(Child.searchable_date_time_fields).to include("registration_date")
    end

    it "should build with boolean search fields" do
      expect(Child.searchable_boolean_fields).to include(
        'duplicate', 'flag', 'has_photo', 'record_state',
        'case_status_reopened', 'tick_field1', 'tick_field2'
      )
    end

  end

end



