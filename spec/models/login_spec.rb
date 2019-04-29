require 'rails_helper'

describe Login do
  describe "authenticate" do
    it "should not save mobile login event on failed authentication" do
      imei = "1334"
      mobile_number = "555-555"

      user = double(User).as_null_object
      User.stub(:find_by_user_name).and_return(user)
      user.stub(:authenticate).and_return false
      user.stub(:devices).and_return([])

      params = {:imei => imei, :mobile_number => mobile_number}
      login = Login.new(params)
      login.authenticate_user
    end

    it "should not save mobile login events for non-mobile logins" do
      user = double(User).as_null_object
      User.stub(:find_by_user_name).and_return(user)
      user.stub(:authenticate).and_return true
      user.stub(:devices).and_return([])

      params = {}
      login = Login.new(params)
      login.authenticate_user
    end
  end
end
