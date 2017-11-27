require 'rails_helper'

describe PrimeroProgram do
  it "should not be valid if name is empty" do
    program = PrimeroProgram.new
    program.should_not be_valid
    program.errors[:name].should == ["Name must not be blank"]
  end

  it "should generate id" do
    PrimeroProgram.all.each {|program| program.destroy}
    program = create :primero_program, :name => 'test program 1234', :_id => nil
    program.id.should == "primeroprogram-test-program-1234"
  end
end