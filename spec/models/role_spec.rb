require 'rails_helper'

describe Role do
  it "should not be valid if name is empty" do
    role = Role.new
    role.should_not be_valid
    role.errors[:name].should == ["Name must not be blank"]
  end

  it "should not be valid if permissions is empty" do
    role = Role.new
    role.should_not be_valid
    role.errors[:permissions_list].should == ["Please select at least one permission"]
  end

  it "should sanitize and check for permissions" do
    role = Role.new(:name => "Name", :permissions_list => [])
    role.save
    role.should_not be_valid
    role.errors[:permissions_list].should == ["Please select at least one permission"]
  end

  it "should not be valid if a role name has been taken already" do
    Role.create({:name => "Unique", :permissions_list => Permission.all_permissions_list})
    role = Role.new({:name => "Unique", :permissions => Permission.all_permissions_list})
    role.should_not be_valid
    role.errors[:name].should == ["A role with that name already exists, please enter a different name"]
  end

  it "should create a valid role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list).should be_valid
  end

  it "should create a valid transfer role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list, :transfer => true).should be_valid
  end

  it "should create a valid referral role" do
    Role.new(:name => "some_role", :permissions_list => Permission.all_permissions_list, :referral => true).should be_valid
  end



  it "should generate id" do
    Role.all.each {|role| role.destroy}
    role = create :role, :name => 'test role 1234', :permissions_list => Permission.all_permissions_list, :_id => nil
    role.id.should == "role-test-role-1234"
  end

  describe "has_permission" do
    before do
      @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @permission_incident_read_write = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::WRITE])
      @permission_role_assign = Permission.new(resource: Permission::ROLE, actions: [Permission::ASSIGN])
    end

    context 'when a role has a single permission' do
      before do
        @role = Role.new(name: "some_role", permissions_list: [@permission_case_read])
      end
      context 'and a single action string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role).to be_valid
          expect(@role.has_permission(Permission::READ)).to be_truthy
          expect(@role.has_permission(Permission::WRITE)).to be_falsey
        end
      end

      context 'and a colon separated action string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role.has_permission("actions:#{Permission::READ}")).to be_truthy
          expect(@role.has_permission("actions:#{Permission::WRITE}")).to be_falsey
        end
      end

      context 'and a colon separated resource string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role.has_permission("resource:#{Permission::CASE}")).to be_truthy
          expect(@role.has_permission("resource:#{Permission::INCIDENT}")).to be_falsey
        end
      end
    end

    context 'when a role has multiple permissions' do
      before do
        @role = Role.new(name: "some_role",
                         permissions_list: [@permission_case_read, @permission_incident_read_write, @permission_role_assign],
                         group_permission: Permission::GROUP)
      end
      context 'and a single action string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role).to be_valid
          expect(@role.has_permission(Permission::READ)).to be_truthy
          expect(@role.has_permission(Permission::WRITE)).to be_truthy
          expect(@role.has_permission(Permission::ASSIGN)).to be_truthy
          expect(@role.has_permission(Permission::FLAG)).to be_falsey
        end
      end

      context 'and a colon separated action string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role.has_permission("actions:#{Permission::READ}")).to be_truthy
          expect(@role.has_permission("actions:#{Permission::WRITE}")).to be_truthy
          expect(@role.has_permission("actions:#{Permission::ASSIGN}")).to be_truthy
          expect(@role.has_permission("actions:#{Permission::FLAG}")).to be_falsey
        end
      end

      context 'and a colon separated resource string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role.has_permission("resource:#{Permission::CASE}")).to be_truthy
          expect(@role.has_permission("resource:#{Permission::INCIDENT}")).to be_truthy
          expect(@role.has_permission("resource:#{Permission::ROLE}")).to be_truthy
          expect(@role.has_permission("resource:#{Permission::TRACING_REQUEST}")).to be_falsey
        end
      end

      context 'amd a colon separated management string is passed in' do
        it "should only grant permissions that are assigned to a role" do
          expect(@role.has_permission("management:#{Permission::SELF}")).to be_falsey
          expect(@role.has_permission("management:#{Permission::GROUP}")).to be_truthy
          expect(@role.has_permission("management:#{Permission::ALL}")).to be_falsey
        end
      end
    end
  end
end
