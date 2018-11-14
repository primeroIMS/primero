require 'rails_helper'

describe Matchable do

  before :each do
    Child.any_instance.stub(:field_definitions).and_return([])
  end

  describe "phonetic_fields" do
    it "should be an array of fields" do
      expect(Child.phonetic_fields.is_a? Array).to eq(true)
    end
  end

  describe "phonetic_fields_exist" do
    it "should return false for no phonetic_fields" do
      expect(Child.phonetic_fields_exist?("test_field")).to eq(false)
    end

    it "should return true for exact phonetic_fields" do
      expect(Child.phonetic_fields_exist?("name")).to eq(true)
    end
  end
end



