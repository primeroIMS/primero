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
    lookup.errors[:lookup_values].should == ["Field must have at least 2 options"]
  end

  it "should sanitize and check for lookup values" do
    lookup = Lookup.new(:name => "Name", :lookup_values => [{:id => "", :display_text => ""}]) #Need empty array, can't use %w here.
    lookup.should_not be_valid
    lookup.errors[:lookup_values].should == ["Field must have at least 2 options"]
  end

  it "should not be valid if a lookup name has been taken already" do
    Lookup.create({:name => "Unique", :lookup_values => [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]})
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
    Lookup.new(:name => "some_lookup", :lookup_values => [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]).should be_valid
  end

  it "should generate id" do
    Lookup.all.each {|lookup| lookup.destroy}
    lookup = create :lookup, :name => 'test lookup 1234', :_id => nil
    lookup.id.should == "lookup-test-lookup-1234"
  end

  describe "check being used" do
    before do
      Lookup.all.each &:destroy
      @lookup = create :lookup, name: 'test lookup', lookup_values: [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]
    end

    context "when not on a form" do
      it "should return that it is not being used" do
        expect(@lookup.is_being_used?).to be_false
      end
    end

    context "when on a form" do
      before do
        @lookup_d = Lookup.create!(name: "D", lookup_values: [{id: "d", display_text: "D"}, {id: "dd", display_text: "DD"}, {id: "ddd", display_text: "DDD"}, {id: "dddd", display_text: "DDDD"}])
        text_field = Field.new(name: "text_field", type: Field::TEXT_FIELD, display_name: "My Text Field")
        select_box_field = Field.new(name: "select_box", type: Field::SELECT_BOX, display_name: "My Select Box", option_strings_source: "lookup D" )
        fs = create :form_section, fields: [select_box_field]
      end

      it "should return that it is being used" do
        expect(@lookup_d.is_being_used?).to be_true
      end
    end
  end
end
