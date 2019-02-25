require 'rails_helper'

describe ChildrenHelper do

  before :each do
    Child.any_instance.stub(:field_definitions).and_return([])
  end

  context "View module" do
    it "should have PER_PAGE constant" do
      ChildrenHelper::View::PER_PAGE.should == 20
    end

    it "should have MAX_PER_PAGE constant" do
      ChildrenHelper::View::MAX_PER_PAGE.should == 9999
    end
  end

  context "EditView module" do
    it "should have ONETIME_PHOTOS_UPLOAD_LIMIT constant" do
      ChildrenHelper::EditView::ONETIME_PHOTOS_UPLOAD_LIMIT.should == 5
    end
  end

  describe '#thumbnail_tag' do
    it 'should use current photo key if photo ID is not specified' do
      child = stub_model Child, :id => 1001, :current_photo_key => 'current'
      helper.thumbnail_tag(child).should == '<img src="/children/1001/thumbnail/current" />'
    end
    it 'should use photo ID if specified' do
      child = stub_model Child, :id => 1001, :current_photo_key => 'current'
      helper.thumbnail_tag(child, 'custom-id').should == '<img src="/children/1001/thumbnail/custom-id" />'
    end
  end

  #Delete this example and add some real ones or delete this file
  it "is included in the helper object" do
    included_modules = (class << helper; self; end).send :included_modules
    included_modules.should include(ChildrenHelper)
  end

  describe "field_for_display" do
    it "should return the string value where set" do
      helper.field_value_for_display("Foo").should == "Foo"
    end
    it "should return empty string if field is nil or 0 length" do
      helper.field_value_for_display("").should == ""
      helper.field_value_for_display(nil).should == ""
      helper.field_value_for_display([]).should == ""
    end
    it "should comma separate values if field value is an array" do
      helper.field_value_for_display(["A", "B", "C"]).should == "A, B, C"
    end
  end

  describe "#text_to_identify_child" do
    it "should show the case id" do
      identifier = "00001234567"
      child = Child.create!(:unique_identifier => identifier)
      helper.text_to_identify_child(child).should == "1234567"
    end
  end

end
