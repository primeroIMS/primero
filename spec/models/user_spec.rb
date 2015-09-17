require 'spec_helper'

describe User do

  def build_user(options = {})
    options.reverse_merge!({
                               :user_name => "user_name_#{rand(10000)}",
                               :full_name => 'full name',
                               :password => 'password',
                               :password_confirmation => options[:password] || 'password',
                               :email => 'email@ddress.net',
                               :user_type => 'user_type',
                               :organization => 'TW',
                               :disabled => 'false',
                               :verified => true,
                               :role_ids => options[:role_ids] || ['random_role_id'],
                               :module_ids => options[:module_ids] || ['test_module_id']
                           })
    user = User.new(options)
    user
  end

  def build_and_save_user(options = {})
    user = build_user(options)
    user.save
    user
  end

  describe "validations" do
    it "should not be valid when username contains whitespace" do
      user = build_user :user_name => "in val id"
      user.should_not be_valid
      user.errors[:user_name].should == ["Please enter a valid user name"]
    end

    it "should be valid when password contains whitespace" do
      user = build_user :password => "valid with spaces"
      user.should be_valid
    end

    it "should not be valid when username already exists" do
      build_and_save_user :user_name => "existing_user"
      user = build_user :user_name => "existing_user"
      user.should_not be_valid
      user.errors[:user_name].should == ["User name has already been taken! Please select a new User name"]
    end

    it "should not be valid when email address is invalid" do
      user = build_user :email => "invalid_email"
      user.should_not be_valid
      user.errors[:email].should == ["Please enter a valid email address"]
    end

    it "should throw error if organization detail not entered" do
      user = build_user :organization => nil
      user.should_not be_valid
      user.errors[:organization].should == ["Please enter the user's organization name"]
      end

    it "should default disabled to false" do
      user = User.new :disabled => nil
      user.disabled.should be_false
    end

    it "should generate id" do
      user = create :user, :user_name => 'test_user_123', :_id => nil
      user.id.should == "user-test-user-123"
    end
  end

  it 'should validate uniqueness of username for new users' do
    User.all.each {|user| user.destroy}
    user = build_user(:user_name => 'the_user_name')
    user.should be_valid
    user.create!

    dupe_user = build_user(:user_name => 'the_user_name')
    dupe_user.should_not be_valid
  end

  it 'should consider a re-loaded user as valid' do
    user = build_user
    raise user.errors.full_messages.inspect unless user.valid?
    user.create!

    reloaded_user = User.get(user.id)
    raise reloaded_user.errors.full_messages.inspect unless reloaded_user.valid?
    reloaded_user.should be_valid
  end

  it "should reject saving a changed password if the confirmation doesn't match" do
    user = build_user
    user.create!
    user.password = 'foo'
    user.password_confirmation = 'not foo'

    user.valid?
    user.should_not be_valid
    user.errors[:password_confirmation].should include(I18n.t("errors.models.user.password_mismatch"))
  end

  it "should allow password update if confirmation matches" do
    user = build_user
    user.create!
    user.password = 'new_password'
    user.password_confirmation = 'new_password'

    user.should be_valid
  end

  it "doesn't use id for equality" do
    user = build_user
    user.create!

    reloaded_user = User.get(user.id)
    #Now couchrest_model use the id for equality.
    reloaded_user.should == user
    reloaded_user.should eql(user)
    reloaded_user.should_not equal(user)
  end

  it "can't authenticate which isn't saved" do
    user = build_user(:password => "thepass")
    lambda { user.authenticate("thepass") }.should raise_error
  end

  it "can authenticate with the right password" do
    user = build_and_save_user(:password => "thepass")
    user.authenticate("thepass").should be_true
  end

  it "can't authenticate with the wrong password" do
    user = build_and_save_user(:password => "onepassword")
    user.authenticate("otherpassword").should be_false
  end

  it "can't authenticate if disabled" do
    user = build_and_save_user(:disabled => "true", :password => "thepass")
    user.authenticate("thepass").should be_false
  end

  it "can't look up password in database" do
    user = build_and_save_user(:password => "thepass")
    User.get(user.id).password.should be_nil
  end

  it "can authenticate if not disabled" do
    user = build_and_save_user(:disabled => "false", :password => "thepass")
    user.authenticate("thepass").should be_true
  end

  it "should be able to store a mobile login event" do
    imei = "1337"
    mobile_number = "555-555"
    now = Time.parse("2008-06-21 13:30:00 UTC")

    user = build_user
    user.create!

    Clock.stub(:now).and_return(now)

    user.add_mobile_login_event(imei, mobile_number)
    user.save

    user = User.get(user.id)
    event = user.mobile_login_history.first

    event[:imei].should == imei
    event[:mobile_number].should == mobile_number
    event[:timestamp].should == now
  end

  it "should store list of devices when new device is used" do
    Device.all.each(&:destroy)
    user = build_user
    user.create!
    user.add_mobile_login_event("a imei", "a mobile")
    user.add_mobile_login_event("b imei", "a mobile")
    user.add_mobile_login_event("a imei", "a mobile")


    Device.all.map(&:imei).sort().should == (["a imei", "b imei"])
  end

  it "should create devices as not blacklisted" do
    Device.all.each(&:destroy)

    user = build_user
    user.create!
    user.add_mobile_login_event("an imei", "a mobile")

    Device.all.all? { |device| device.blacklisted? }.should be_false
  end

  it "should save blacklisted devices to the device list" do
    device = Device.new(:imei => "1234", :blacklisted => false, :user_name => "timothy")
    device.save!

    user = build_and_save_user(:user_name => "timothy")
    user.devices = [{"imei" => "1234", "blacklisted" => "true", :user_name => "timothy"}]
    user.save!

    blacklisted_device = user.devices.detect { |device| device.imei == "1234" }
    blacklisted_device.blacklisted.should == true

  end

  it "should have error on password_confirmation if no password_confirmation" do
    user = build_user({
                          :password => "timothy",
                          :password_confirmation => ""
                      })
    user.should_not be_valid
    user.errors[:password_confirmation].should_not be_nil
  end

  it "should localize date using user's timezone" do
    user = build_user({ :time_zone => "American Samoa"})
    user.localize_date("2011-11-12 21:22:23 UTC").should == "12 November 2011 at 10:22 (SST)"
  end

  it "should localize date using specified format" do
    user = build_user({ :time_zone => "UTC" })
    user.localize_date("2011-11-12 21:22:23 UTC", "%Y-%m-%d %H:%M:%S (%Z)").should == "2011-11-12 21:22:23 (UTC)"
  end

  it "should load roles only once" do
    role = double("roles")
    user = build_and_save_user
    couchdb_view = double("couchdb_view")
    couchdb_view.should_receive(:all).and_return([role])
    Role.should_receive(:all).with({keys: [user.role_ids.first]}).and_return(couchdb_view)
    user.roles.should == [role]
  end

  describe "user roles" do
    it "should store the roles and retrive them back as Roles" do
      permission_case_read_write = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
      admin_role = Role.create!(:name => "Admin", :permissions_list => Permission.all_permissions_list)
      field_worker_role = Role.create!(:name => "Field Worker", :permissions_list => [permission_case_read_write])
      user = User.create({:user_name => "user_123", :full_name => 'full', :password => 'password', :password_confirmation => 'password',
                          :email => 'em@dd.net', :organization => 'TW', :user_type => 'user_type', :role_ids => [admin_role.id, field_worker_role.id], :disabled => 'false'})

      User.find_by_user_name(user.user_name).roles.should == [admin_role, field_worker_role]
    end

    it "should require atleast one role for a verified user" do
      user = build_user(:role_ids => [])
      user.should_not be_valid
      user.errors[:role_ids].should == ["Please select at least one role"]
    end

    it "allow an unverified user to have no role" do
      build(:user, :role_ids => [], :verified => false).should be_valid
    end

  end

  describe "permitted forms" do

    before do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy
      Role.all.each &:destroy

      @form_section_a = FormSection.create!(unique_id: "A", name: "A")
      @form_section_b = FormSection.create!(unique_id: "B", name: "B")
      @form_section_c = FormSection.create!(unique_id: "C", name: "C")
      @primero_module = PrimeroModule.create!(program_id: "some_program", name: "Test Module", associated_form_ids: ["A", "B"], associated_record_types: ['case'])
      @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @role = Role.create!(permitted_form_ids: ["B", "C"], name: "Test Role", permissions_list: [@permission_case_read])
    end

    it "inherits the forms permitted by the modules" do
      user = User.new(user_name: "test_user", module_ids: [@primero_module.id])
      expect(user.permitted_form_ids).to match_array(["A", "B"])
    end

    it "will be permitted to only use forms granted by roles if such forms are explicitly set" do
      user = User.new(user_name: "test_user", role_ids: [@role.id], module_ids: [@primero_module.id])
      expect(user.permitted_form_ids).to match_array(["B", "C"])
    end
  end

  describe "manager" do

    before do
      User.all.each &:destroy
      Role.all.each &:destroy

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE])
      @permission_user_read = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      @manager_role = create :role, permissions_list: [@permission_user_read_write], group_permission: Permission::GROUP
      @grunt_role = create :role, permissions_list: [@permission_user_read]

      @manager = create :user, role_ids: [@manager_role.id], user_group_ids: ["GroupA", "GroupB"], is_manager: true
      @grunt1 = create :user, role_ids: [@grunt_role.id], user_group_ids: ["GroupA"], is_manager: false
      @grunt2 = create :user, role_ids: [@grunt_role.id], user_group_ids: ["GroupA"]
      @grunt3 = create :user, role_ids: [@grunt_role.id], user_group_ids: ["GroupB"]
      @grunt4 = create :user, role_ids: [@grunt_role.id], user_group_ids: ["GroupB"]
    end

    it "is a manager if set flag" do
      expect(@manager.is_manager?).to be_true
      expect(@grunt1.is_manager?).to be_false
      expect(@grunt2.is_manager?).to be_false
    end

    it "manages all people in its group including itself" do
      expect(@manager.managed_users).to match_array([@grunt1, @grunt2, @grunt3, @grunt4, @manager])
    end

    it "manages itself" do
      expect(@grunt1.managed_users).to eq([@grunt1])
    end

    it "has a record scope of 'all' if it an manage all users" do
      manager_role = create :role, permissions_list: [@permission_user_read_write], group_permission: Permission::ALL
      manager = create :user, role_ids: [manager_role.id]
      expect(manager.record_scope).to eq([Searchable::ALL_FILTER])
    end

    it "does not manage users who share an empty group with it" do
      manager = create :user, role_ids: [@manager_role.id], user_group_ids: ["GroupA", ""]
      grunt = create :user, role_ids: [@grunt_role.id], user_group_ids: ["GroupB", ""]
      expect(manager.managed_users).to match_array([@grunt1, @grunt2, @manager, manager])
    end

  end

  describe "unverified users" do
    it "should get all un-verified users" do
      unverified_user1 = build_and_save_user(:verified => false)
      unverified_user2 = build_and_save_user(:verified => false)
      verified_user = build_and_save_user(:verified => true)
      all_unverifed_users = User.all_unverified
      all_unverifed_users.map(&:id).should be_include unverified_user2.id
      all_unverifed_users.map(&:id).should be_include unverified_user1.id
      all_unverifed_users.map(&:id).should_not be_include verified_user.id
    end
  end

  describe "permissions" do
    before :each do
      @permission_list = [
                           Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SYNC_MOBILE]),
                           Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ]),
                         ]
      @user_perm = User.new(:user_name => 'fake_self')
      @user_perm.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::SELF)])
    end

    it "should have READ permission" do
      expect(@user_perm.has_permission? Permission::READ).to be_true
    end

    it "should have SYNC_MOBILE permission" do
      expect(@user_perm.has_permission? Permission::SYNC_MOBILE).to be_true
    end

    it "should not have WRITE permission" do
      expect(@user_perm.has_permission? Permission::WRITE).to be_false
    end
  end

  describe "group permissions" do
    before :each do
      @permission_list = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
    end

    context "when logged in with SELF permissions" do
      before do
        @user_group = User.new(:user_name => 'fake_self')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::SELF)])
      end

      it "should not have GROUP permission" do
        expect(@user_group.has_group_permission? Permission::GROUP).to be_false
      end

      it "should not have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_false
      end
    end

    context "when logged in with GROUP permissions" do
      before do
        @user_group = User.new(:user_name => 'fake_group')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::GROUP)])
      end

      it "should have GROUP permission" do
        expect(@user_group.has_group_permission? Permission::GROUP).to be_true
      end

      it "should not have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_false
      end
    end

    context "when logged in with ALL permissions" do
      before do
        @user_group = User.new(:user_name => 'fake_all')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::ALL)])
      end

      it "should not have GROUP permission" do
        expect(@user_group.has_group_permission? Permission::GROUP).to be_false
      end

      it "should have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_true
      end
    end
  end
end
