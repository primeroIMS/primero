require 'spec_helper'

describe "PropertyEvaluator" do

  before :all do
    @location_country = Location.create! placename: "Guinea", type: "country", location_code: "GUI", admin_level: 0
    @location_region = Location.create! placename:"Kindia", type: "region", location_code: "GUI01", hierarchy: ["GUI"]
    @permission_case_read_write = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
    admin_role = Role.create!(:name => "Admin", :permissions_list => Permission.all_permissions_list)
    field_worker_role = Role.create!(:name => "Field Worker", :permissions_list => [@permission_case_read_write])
    a_module = PrimeroModule.create name: "Test Module"
    user = User.create!({:user_name => "bob123", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                         :email => 'em@dd.net', :organization => 'TW', :role_ids => [admin_role.id, field_worker_role.id],
                         :module_ids => [a_module.id], :disabled => 'false', :location => @location_region.location_code})
    user2 = User.create!({:user_name => "joe456", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                          :email => 'em@dd.net', :organization => 'TW', :role_ids => [admin_role.id, field_worker_role.id],
                          :module_ids => [a_module.id], :disabled => 'false', :location => ''})

    @child = Child.new case_id: 'xyz123', created_by: 'bob123'
    @child2 = Child.new case_id: 'abc456', created_by: 'joe456'
  end

  it 'evaluates a test string on the test record' do
    test_string = "created_by_user.Location.ancestor_by_type(country).location_code"
    expect(PropertyEvaluator.evaluate(@child, test_string)).to eq "GUI"
  end

  it "doesn't break if a value in the evaluation chain is missing" do
    test_string = "created_by_user.Location.ancestor_by_type(country).location_code"
    expect(PropertyEvaluator.evaluate(@child2, test_string)).to be_nil
  end


end
