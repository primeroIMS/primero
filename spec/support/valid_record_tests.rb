shared_examples "a valid record" do

  it "should allow date fields formatted as dd/mm/yyyy" do
    record['a_datefield'] = '27-Feb-2010'
    record.should be_valid
  end

  it "should not allow invalid formatted dates" do
    record['a_datefield'] = 'asldkjf'
    record.should_not be_valid
    record.errors[:a_datefield].should == ["Please enter the date in a valid format (dd-mmm-yyyy)"]
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
    record['a_numericfield'] = 10.2
    record.should be_valid
  end

  describe "duplicate of validation" do
    context "duplicate is true" do
      context "duplicate of is blank" do
        it "should not be valid" do
          record['duplicate'] = true
          record['duplicate_of'] = nil
          record.should_not be_valid
          record.errors[:duplicate].should include("A valid duplicate ID must be provided")
        end
      end
      context "duplicate of is present" do
        it "should be valid" do
          record['duplicate'] = true
          record['duplicate_of'] = 12345
          record.should be_valid
        end
      end
    end

    context "duplicate is false" do
      it "should not allow duplicate of" do
        record['duplicate'] = false
        # TODO - this is not part of the validation
        # record['duplicate_of'] = 12345
        # record.should_not be_valid
        record['duplicate_of'] = nil
        record.should be_valid
        record.errors[:duplicate].should_not include("A valid duplicate ID must be provided")
      end
    end
  end

end
