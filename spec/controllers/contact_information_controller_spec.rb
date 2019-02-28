require 'rails_helper'

describe ContactInformationController do
  describe "GET show" do
    before :each do
      ContactInformation.all.each(&:destroy)
      controller.stub(:current_session).and_return(nil)
    end

    it "returns the JSON representation if showing a contact information that exists" do
      @request.env["HTTP_ACCEPT"] = "application/json"
      contact_information = {"name"=>"Bob"}
      ContactInformation.should_receive(:current).and_return(contact_information)

      get :show, params: {:id => "administrator"}

      response_as_json =  JSON.parse @response.body
      response_as_json.should == contact_information
    end

    it "returns a 404 response if showing a contact information that does not exist" do
      get :show, params: {:id => "foo"}

      response.status.should == 404
    end
  end

  describe "GET edit" do
    it "populates the contact information when logged in as an admin" do
      fake_admin_login
      contact_information = {"name"=>"Bob"}
      ContactInformation.should_receive(:first).and_return(contact_information)

      get :edit, params: {:id => "bob"}

      assigns[:contact_information].should == contact_information
    end
  end
end
