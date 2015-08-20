require 'spec_helper'

describe "PropertyEvaluator" do

  before :all do
    @location_country = Location.create! placename: "Guinea", type: "country", location_code: "GUI"
    @location_region = Location.create! placename:"Kindia", type: "region", hierarchy: ["Guinea"]
    @user = User.create! user_name: 'bob123', location: @location_region
    @child = Child.new case_id: 'xyz123', created_by: 'bob123'
  end

  it 'evaluates a test string on the test record' do
    test_string = "created_by_user.location.admin('country').location_code"
    expect(PropertyEvaluator.evaluate(test_string)).to eq "GUI"
  end

  it "doesn't break if a value in the evaluation chain is missing" do
  end


end