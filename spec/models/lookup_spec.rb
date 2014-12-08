require 'spec_helper'

describe Lookup do
  it "should not be valid if name is empty" do
    lookup = Lookup.new
    lookup.should_not be_valid
    lookup.errors[:name].should == ["Name must not be blank"]
  end

  it "should not be valid if lookup_values is empty" do
    lookup = Lookup.new
    lookup.should_not be_valid
    lookup.errors[:lookup_values].should == ["Please select at least one lookup value"]
  end

  it "should sanitize and check for lookup values" do
    lookup = Lookup.new(:name => "Name", :lookup_values => [""]) #Need empty array, can't use %w here.
    lookup.should_not be_valid
    lookup.errors[:lookup_values].should == ["Please select at least one lookup value"]
  end

  it "should not be valid if a lookup name has been taken already" do
    Lookup.create({:name => "Unique", :lookup_values => ['value1', 'value2']})
    lookup = Lookup.new({:name => "Unique", :lookup_values => ['value3', 'value4']})
    lookup.should_not be_valid
    lookup.errors[:name].should == ["A lookup with that name already exists, please enter a different name"]
  end

  it "should titleize lookup name before validating it" do
    lookup = Lookup.new(:name => "should be titleized")
    lookup.valid?
    lookup.name.should == "Should Be Titleized"
  end

  it "should create a valid lookup" do
    Lookup.new(:name => "some_lookup", :lookup_values => ['value1', 'value2']).should be_valid
  end

  it "should generate id" do
    Lookup.all.each {|lookup| lookup.destroy}
    lookup = create :lookup, :name => 'test lookup 1234', :_id => nil
    lookup.id.should == "lookup-test-lookup-1234"
  end

  describe "check being used" do
    before do
      @lookup = create :lookup, name: 'test lookup', lookup_values: ['value1', 'value2']
    end

    context "when not on a form" do
      it "should return that it is not being used" do
        expect(@lookup.is_being_used?).to be_false
      end
    end

    context "when on a form" do

    end
  end
end
