require 'rails_helper'

describe PasswordRecoveryRequest do
  context 'a new request' do

    it "should display requests that were not hidden" do
      request = PasswordRecoveryRequest.create! :user_name => "evilduck"

      PasswordRecoveryRequest.create! :user_name => "goodduck", :hidden => true

      PasswordRecoveryRequest.to_display.map(&:user_name).should include("evilduck")
      PasswordRecoveryRequest.to_display.map(&:user_name).should_not   include("goodduck")
    end

    it "should raise error if username is empty" do
      expect {PasswordRecoveryRequest.create! :user_name => ""}.to raise_error(CouchRest::Model::Errors::Validations,
                                                                               'Validation Failed: User name Please enter a valid user name')
    end

    it "should hide password requests" do
      request = PasswordRecoveryRequest.create! :user_name => "moderateduck"
      request.hide!

      expect(PasswordRecoveryRequest.to_display.map(&:user_name)).not_to include("moderateduck")
    end
  end
end
