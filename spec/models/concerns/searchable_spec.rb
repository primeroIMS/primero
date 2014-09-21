require 'spec_helper'

shared_examples "Searchable" do

  describe "Text Query" do

    # before :each do
    #   Sunspot.remove_all(Child)
    # end

    # before :all do
    #   form = FormSection.new(:name => "test_form", :parent_form => 'case')
    #   form.fields << Field.new(:name => "name", :type => Field::TEXT_FIELD, :display_name => "name")
    #   form.save!
    # end

    # after :all do
    #   FormSection.all.all.each { |form| form.destroy }
    # end


    it "should return empty array for no match" do
      pending "Write this test!"
    end

    it "should return an exact match" do
      pending "Write this test!"
    end

    it "should return a match that starts with the query" do
      pending "Write this test!"
    end

    it "should return a fuzzy match" do
      pending "Fuzzy search isn't implemented yet"
    end

    it "should search by exact match for short id" do
      pending "Write this test!"
    end


    it "should match more than one word" do
      pending "Write this test!"
    end

    it "should match more than one word with fuzzy search" do
      pending "Fuzzy search isn't implemented yet"
    end

    it "should match more than one word with starts with" do
      pending "Are we even doing startswith searches for names?"
    end
  end

  describe "Filtering" do
  end


  describe "Solr schema" do

    it "should build with free text search fields" do
      pending "Write this test!"
      # Field.stub(:all_searchable_field_names).and_return []
      # Child.searchable_string_fields.should == ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name","created_organisation"]
    end

    it "should build with date search fields" do
      pending "Write this test!"
      # expect(Child.searchable_date_fields).to include("created_at", "last_updated_at", "registration_date")
    end

    it "fields build with all fields in form sections" do
      pending "Write this test!"
      # form = FormSection.new(:name => "test_form", :parent_form => 'case')
      # form.fields << Field.new(:name => "name", :type => Field::TEXT_FIELD, :display_name => "name")
      # form.save!
      # Child.searchable_string_fields.should include("name")
      # FormSection.all.each { |form_section| form_section.destroy }
    end

  end

end



