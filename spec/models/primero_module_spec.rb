require 'rails_helper'

describe PrimeroModule do
  before :each do
    clean_data(FormSection, PrimeroModule, PrimeroProgram)
  end

  it "should not be valid if name is empty" do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:name].should == ["Name must not be blank"]
  end

  it "should not be valid if assigned forms are empty" do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:form_sections].should == ["At least one form must be associated with this module"]
  end

  it "should not be valid if a module name has been taken already" do
    create(:primero_module, :name => "Unique")
    primero_module = build(:primero_module, :name => "Unique")
    primero_module.should_not be_valid
    primero_module.errors[:name].should == ["A module with that name already exists, please enter a different name"]
  end

  it "should not be valid if it assigned record types are missing" do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:associated_record_types].should == ["At least one record type must be associated with this module"]
  end

  it "should not be valid if it doesnt have an associated program" do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:primero_program_id].should == ["There must be a program associated with this module"]
  end

  it "should generate id" do
    primero_module = create(:primero_module, :name => 'test module 1234')
    primero_module.unique_id.should == "primeromodule-test-module-1234"
  end
end
