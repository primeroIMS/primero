require 'rails_helper'

describe Session do
  describe "user" do
    it "should load the user only once" do
      user = User.new(:user_name => "some_name")
      User.should_receive(:find_by_user_name).with(user.user_name).and_return(user)
      session = Session.for_user(user, "")
      session.user.should == user
      User.should_not_receive(:find_by_user_name)
      session.user.should == user
    end
  end
end
