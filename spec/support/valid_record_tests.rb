shared_examples "a valid record" do  
    
  it "should allow date fields formatted as dd/mm/yyyy" do
    record['a_datefield'] = '27/Feb/2010'
    record.should be_valid
  end
  
  it "should not allow invalid formatted dates" do
    record['a_datefield'] = '27 Feb 10'
    record.should_not be_valid
    record.errors[:a_datefield].should == ["Please enter a valid date for this field (format: dd/mm/yyyy)"]
  end
  
  it "should allow text area values to be 400,000 chars" do
    record['a_textarea'] = ('a' * 400_000)
    record.should be_valid
  end
  
  it "should disallow text area values to be more than 400,000 chars" do
    record['a_textarea'] = ('a' * 400_001)
    record.should_not be_valid
    record.errors[:a_textarea].should == ["A text area cannot be more than 400000 characters long"]
  end
  
  it "should disallow text field values to be more than 200 chars" do
    record['a_textfield'] = ('a' * 201)
    record.should_not be_valid
    record.errors[:a_textfield].should == ["A text field cannot be more than 200 characters long"]
  end
  
  it "should validate numeric types" do
    record['a_numericfield'] = 'ABCDEFG'
    record.should_not be_valid
    record.errors[:a_numericfield].should == ["A numeric field must be a valid number"]
  end
  
  it "should validate multiple numeric types" do
    record['a_numericfield'] = 'ABCDEFG'
    record['a_numericfield_2'] = 'XYZ'
    record.should_not be_valid
    record.errors[:a_numericfield].should == ["A numeric field must be a valid number"]
    record.errors[:a_numericfield_2].should == ["A second numeric field must be a valid number"]
  end
  
  it "should pass numeric fields that are valid numbers to 1 dp" do
    record['a_numericfield'] = '10.2'
    record.should be_valid
  end     
  
end
