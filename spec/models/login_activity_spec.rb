require 'rails_helper'

describe LoginActivity do
  describe "authenticate" do
    it "should set timestamp before save" do
      date_time = DateTime.parse("2015/10/23 14:54:55 -0400")
      DateTime.stub(:now).and_return(date_time)
      login_activity = LoginActivity.create(user_name: 'some user', imei: '1234')
      login_activity.login_timestamp.should == date_time
    end
  end
end