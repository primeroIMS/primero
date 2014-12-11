require 'spec_helper'

describe SessionsController do

  before :each do
    @admin_role = create :role
    @user = create :user, :password => 'test_password', :password_confirmation => 'test_password', :role_ids => [ @admin_role.name ]
  end

  it 'routes /api/login to the session create action' do
    { :post => "/api/login" }.should route_to(:controller => "sessions", :action => "create", :format => :json)
  end

  it 'routes /api/logout to the sessions delete action' do
    { :post => "/api/logout" }.should route_to(:controller => "sessions", :action => "destroy", :format => :json)
  end

end
