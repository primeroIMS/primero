require 'rails_helper'

describe TracingRequestHistoriesController do
  before do
    fake_admin_login
  end

  it "should create tracing request variable for view" do
    tracing_request = build :tracing_request
    get :index, params: { :id => tracing_request.id }
    assigns(:tracing_request).should == tracing_request
  end

  it "should set the page name to the tracing request short ID" do
    tracing_request = build :tracing_request
    get :index, params: { :id => tracing_request.id }
    assigns(:page_name).should == "History of #{tracing_request.short_id}"
  end

end
