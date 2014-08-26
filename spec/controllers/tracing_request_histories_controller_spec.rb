require 'spec_helper'

describe TracingRequestHistoriesController do
  before do
    fake_admin_login
  end

  it "should create tracing request variable for view" do
    tracing_request = build :tracing_request
    get :index, :id => tracing_request.id
    assigns(:tracing_request).should == tracing_request
  end

  it "should set the page name to the tracing request short ID" do
    tracing_request = build :tracing_request, :unique_identifier => "1234"
    get :index, :id => tracing_request.id
    assigns(:page_name).should == "History of 1234"
  end

end
