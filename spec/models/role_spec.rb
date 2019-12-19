require 'rails_helper'

describe Role do
  describe 'Validations' do
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

    describe 'reporting_location_level' do
      before do
        @role = Role.new(name: "some_role", permissions_list: Permission.all_permissions_list)

        ReportingLocation.stub(:reporting_location_levels).and_return(['district', 'province', 'governorate'])
      end

      context 'with a valid admin_level' do
        before :each do
          @role.reporting_location_level = 'district'
        end

        it 'is valid' do
          expect(@role).to be_valid
        end
      end

      context 'with an invalid admin_level' do
        before :each do
          @role.reporting_location_level = 'bad_level'
        end

        it 'returns an error message' do
          @role.valid?
          expect(@role.errors.messages[:reporting_location_level]).to eq(['Location Level must be one of ReportingLocation Level values'])
        end
      end
    end
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
      @permission_incident_read_write = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
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

  describe "is_super_user_role?" do
    before do
      super_user_permissions_to_manage = [
        Permission::CASE, Permission::INCIDENT, Permission::REPORT,
        Permission::ROLE, Permission::USER, Permission::USER_GROUP,
        Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
      ]
      @permissions_super_user = super_user_permissions_to_manage.map{|p| Permission.new(resource: p, actions: [Permission::MANAGE])}
      @permission_not_super_user = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
    end

    context 'depending on the permissions of a role' do
      before do
        @role_super_user = Role.new(name: "super_user_role", permissions_list: @permissions_super_user)
        @role_not_super_user = Role.new(name: "not_super_user_role", permissions_list: [@permission_not_super_user])
      end
      context 'if the role manages all of the permissions of the super user' do
        it "should return true for is_super_user_role?" do
          expect(@role_super_user.is_super_user_role?).to be_truthy
        end
      end

      context 'if the role does not manage all of the permissions of the super user' do
        it "should return false for is_super_user_role?" do
          expect(@role_not_super_user.is_super_user_role?).to be_falsey
        end
      end
    end
  end

  describe "is_user_admin_role?" do
    before do
      user_admin_permissions_to_manage = [
        Permission::ROLE, Permission::USER, Permission::USER_GROUP,
        Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
      ]
      @permissions_user_admin = user_admin_permissions_to_manage.map{|p| Permission.new(resource: p, actions: [Permission::MANAGE])}
      @permission_not_user_admin = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
    end

    context 'depending on the permissions of a role' do
      before do
        @role_user_admin = Role.new(name: "super_user_role", permissions_list: @permissions_user_admin)
        @role_not_user_admin = Role.new(name: "not_super_user_role", permissions_list: [@permission_not_user_admin])
      end
      context 'if the role manages all of the permissions of the user admin' do
        it "should return true for is_user_admin_role?" do
          expect(@role_user_admin.is_user_admin_role?).to be_truthy
        end
      end

      context 'if the role does not manage all of the permissions of the user admin' do
        it "should return false for is_user_admin_role?" do
          expect(@role_not_user_admin.is_user_admin_role?).to be_falsey
        end
      end
    end
  end

  describe "class methods" do
    before do
      Role.all.each &:destroy
      role_permissions = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
      @referral_role = Role.create!(name: "Referral Role", permissions_list: role_permissions, referral: true)
      @transfer_role = Role.create!(name: "Transfer Role", permissions_list: role_permissions, transfer: true)
      @referral_transfer_role = Role.create!(name: "Referral Transfer Role", permissions_list: role_permissions, referral: true, transfer: true)
      @neither_role = Role.create!(name: "Neither Role", permissions_list: role_permissions)
    end

    describe "names_and_ids_by_referral" do
      it 'returns Names and IDs of all roles with referral permission' do
        expect(Role.names_and_ids_by_referral).to include(["Referral Role", "role-referral-role"], ["Referral Transfer Role", "role-referral-transfer-role"])
      end

      it 'does not return Names and IDs of roles that do not have referral permission' do
        expect(Role.names_and_ids_by_referral).not_to include(["Transfer Role", "role-transfer-role"], ["Neither Role", "role-neither-role"])
      end
    end

    describe "names_and_ids_by_transfer" do
      it 'returns Names and IDs of all roles with transfer permission' do
        expect(Role.names_and_ids_by_transfer).to include(["Transfer Role", "role-transfer-role"], ["Referral Transfer Role", "role-referral-transfer-role"])
      end

      it 'does not return Names and IDs of roles that do not have transfer permission' do
        expect(Role.names_and_ids_by_transfer).not_to include(["Referral Role", "role-referral-role"], ["Neither Role", "role-neither-role"])
      end
    end
  end

  describe '#update_users_with_current_role', search: true do

    before do
      Role.all.each(&:destroy)
      User.all.each(&:destroy)
      Sunspot.remove_all!
      @case_permission = Permission.new(:resource => Permission::CASE, :actions => [Permission::READ, Permission::WRITE])
      @main_role = Role.create(name: "National Administrator", permissions_list: [@case_permission])
      @user = User.create(:user_name => 'primero_cp_a',
                          :full_name => "Primero CP A",
                          :organization => "UNICEF",
                          :password => "Password0001",
                          :password_confirmation => "Password0001",
                          :module_ids => [PrimeroModule::CP],
                          :role_ids => [Role.by_name(key: "National Administrator").first.id])
      @user_b = User.create(:user_name => 'primero_cp_b',
                            :full_name => "Primero CP B",
                            :organization => "UNICEF",
                            :password => "Password0001",
                            :password_confirmation => "Password0001",
                            :module_ids => [PrimeroModule::CP],
                            :role_ids => [Role.by_name(key: "National Administrator").first.id])
      Sunspot.commit
    end

    context 'when user has role' do
      context 'with referral permission' do
        before :each do
          @case_permission[:actions] << Permission::RECEIVE_REFERRAL
          @main_role.description = "Some description"
          @main_role.permissions_list = [@case_permission]
          @main_role.save!
        end
        it 'should reindex users with current role when adding referral permission' do
          expect(@main_role.valid?).to be_truthy
          expect(User.find_by_criteria({ can_receive_referrals: true }).results.length).to eq(2)
        end
        it 'should reindex users with current role when removing referral permission' do
          @case_permission[:actions].tap(&:pop)
          @main_role.permissions_list = [@case_permission]
          @main_role.save!
          expect(User.find_by_criteria({ can_receive_referrals: true }).results.length).to eq(0)
        end
      end
      context 'with transfer permission' do
        before :each do
          @case_permission[:actions] << Permission::RECEIVE_TRANSFER
          @main_role.description = "Some description"
          @main_role.permissions_list = [@case_permission]
          @main_role.save!
        end
        it 'should reindex users with current role' do
          expect(@main_role.valid?).to be_truthy
          expect(User.find_by_criteria({ can_receive_transfers: true }).results.length).to eq(2)
        end
        it 'should reindex users with current role when removing transfer permission' do
          @case_permission[:actions].tap(&:pop)
          @main_role.permissions_list = [@case_permission]
          @main_role.save!
          expect(User.find_by_criteria({ can_receive_transfers: true }).results.length).to eq(0)
        end
      end
    end
  end

end
