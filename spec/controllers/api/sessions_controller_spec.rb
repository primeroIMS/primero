require 'rails_helper'

describe SessionsController do

  before :each do
    permission_case = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @session_role = Role.create(permissions_list: [permission_case])
    @user = create :user, :password => 'test_passw0rd', :password_confirmation => 'test_passw0rd', :role_ids => [ @session_role.name ]
  end

  it 'routes /api/login to the session create action' do
    { :post => "/api/login" }.should route_to(:controller => "sessions", :action => "create", :format => :json)
  end

  it 'routes /api/logout to the sessions delete action' do
    { :post => "/api/logout" }.should route_to(:controller => "sessions", :action => "destroy", :format => :json)
  end

end
