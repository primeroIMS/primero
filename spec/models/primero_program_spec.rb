require 'rails_helper'

describe PrimeroProgram do
  it "should not be valid if name is empty" do
    program = PrimeroProgram.new
    program.should_not be_valid
    program.errors[:name].should == ["must not be blank"]
  end

  it "should generate id" do
    PrimeroProgram.destroy_all
    program = create :primero_program, :name => 'test program 1234'
    program.unique_id.should == "primeroprogram-test-program-1234"
  end
end