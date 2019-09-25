require 'rails_helper'

describe User do

  def build_user(options = {})
    options.reverse_merge!({
                               :user_name => "user_name_#{rand(10000)}",
                               :full_name => 'full name',
                               :password => 'b00h00h00',
                               :password_confirmation => options[:password] || 'b00h00h00',
                               :email => 'email@ddress.net',
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

  def login(user_name, date, params)
    user = build_user :user_name => user_name
    date_time = DateTime.parse(date)
    DateTime.stub(:now).and_return(date_time)
    User.stub(:find_by_user_name).and_return(user)
    user.stub(:authenticate).and_return true

    login = Login.new(params)
    login.authenticate_user
  end

  describe "last login timestamp" do
    before do
      LoginActivity.all.each &:destroy
    end

    it "shouldn't return last login activity if user has never logged in" do
      user = build_user :user_name => 'Billy'
      last_login = User.last_login_timestamp(user.user_name)
      last_login.should == nil
    end

    it "should return last login activity if user does have login activity" do
      imei = "1336"
      user_name = "Billy"
      date_1 = "2015/10/23 14:54:55 -0400"
      date_2 = "2015/11/28 14:54:55 -0400"
      params = {:imei => imei, user_name: user_name}

      login(user_name, date_1, params)
      login(user_name, date_2, params)
      last_login = User.last_login_timestamp(user_name)
      last_login.should_not == date_1
      last_login.should == date_2
    end
  end

  describe "validations" do
    it "should not be valid when username contains whitespace" do
      user = build_user :user_name => "in val id"
      user.should_not be_valid
      user.errors[:user_name].should == ["Please enter a valid user name"]
    end

    it "should be valid when password contains whitespace" do
      user = build_user :password => "v4lid with spaces"
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
      user.disabled.should be_falsey
    end

    it "should generate id" do
      user = create :user, :user_name => 'test_user_123', :_id => nil
      user.id.should == "user-test-user-123"
    end

    it "should require a module" do
      user = build_user(:module_ids => [])
      expect(user).not_to be_valid
      expect(user.errors[:module_ids]).to eq(["Please select at least one module"])
    end

    describe 'locale' do
      before do
        @locale_user = build_user
      end

      context 'when blank' do
        before do
          @locale_user.locale = nil
        end

        it "is valid" do
          expect(@locale_user).to be_valid
        end
      end

      context 'when present' do
        context 'and locale is in list of valid Primero locales' do
          before do
            @locale_user.locale = 'en'
          end

          it "is valid" do
            expect(@locale_user).to be_valid
          end
        end

        context 'and locale is not in list of valid Primero locales' do
          before do
            @locale_user.locale = 'zz'
          end

          it "is not valid" do
            expect(@locale_user).not_to be_valid
            expect(@locale_user.errors[:locale]).to eq(["Locale zz is not valid"])
          end
        end
      end
    end
  end

  it 'should validate uniqueness of username for new users' do
    User.all.each &:destroy
    user = build_user(:user_name => 'the_user_name')
    expect(user).to be_valid
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
    user.password = 'f00f00'
    user.password_confirmation = 'not f00f00'

    user.valid?
    user.should_not be_valid
    user.errors[:password_confirmation].should include(I18n.t("errors.models.user.password_mismatch"))
  end

  it "should allow password update if confirmation matches" do
    user = build_user
    user.create!
    user.password = 'new_password1'
    user.password_confirmation = 'new_password1'

    user.should be_valid
  end

  it "should reject passwords that are less than 8 characters or don't have at least one alpha and at least 1 numeric character" do
    user = build_user :password => "invalid"
    user.should_not be_valid

    user = build_user :password => 'sh0rt'
    user.should_not be_valid
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
    user = build_user(:password => "b00h00h00")
    expect { user.authenticate("thepass") }.to raise_error(Exception, "Can't authenticate an un-saved user")
  end

  it "can authenticate with the right password" do
    user = build_and_save_user(:password => "b00h00h00")
    user.authenticate("b00h00h00").should be_truthy
  end

  it "can't authenticate with the wrong password" do
    user = build_and_save_user(:password => "onepassw0rd")
    user.authenticate("otherpassw0rd").should be_falsey
  end

  it "can't authenticate if disabled" do
    user = build_and_save_user(:disabled => "true", :password => "thep4sswd")
    user.authenticate("thep4sswd").should be_falsey
  end

  it "can't look up password in database" do
    user = build_and_save_user(:password => "thep4sswd")
    User.get(user.id).password.should be_nil
  end

  it "can authenticate if not disabled" do
    user = build_and_save_user(:disabled => "false", :password => "thep4sswd")
    user.authenticate("thep4sswd").should be_truthy
  end

  it "should be able to select a user's mobile login events from a list of login events" do
    user = build_user
    user.create!

    LoginActivity.create!(user_name: user.user_name, imei: 'IMEI1', mobile_number: '123-456-7890')
    LoginActivity.create!(user_name: user.user_name, imei: nil, mobile_number: nil)
    LoginActivity.create!(user_name: 'billybob', imei: 'IMEI', mobile_number: '123-456-7890')
    LoginActivity.create!(user_name: 'billybob')
    sleep(1) #make sure we have a second gap in activities
    LoginActivity.create!(user_name: user.user_name, imei: 'IMEI2', mobile_number: '123-456-7890')
    LoginActivity.create!(user_name: 'sueanne', imei: 'IMEI', mobile_number: '123-456-7890')

    mobile_login_history = user.mobile_login_history

    expect(mobile_login_history).to have(2).events
    expect(mobile_login_history.first.imei).to eq('IMEI2')
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
                          :password => "t1mothy",
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
      permission_case_read_write = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
      admin_role = Role.create!(:name => "Admin", :permissions_list => Permission.all_permissions_list)
      field_worker_role = Role.create!(:name => "Field Worker", :permissions_list => [permission_case_read_write])
      user = User.create({:user_name => "user_123", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                          :email => 'em@dd.net', :organization => 'TW', :role_ids => [admin_role.id, field_worker_role.id],
                          :module_ids => ['primeromodule-cp'], :disabled => 'false'})

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

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
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
      expect(@manager.is_manager?).to be_truthy
      expect(@grunt1.is_manager?).to be_falsey
      expect(@grunt2.is_manager?).to be_falsey
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
                           Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SYNC_MOBILE, Permission::APPROVE_CASE_PLAN]),
                           Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ]),
                         ]
      @user_perm = User.new(:user_name => 'fake_self')
      @user_perm.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::SELF)])
    end

    it "should have READ permission" do
      expect(@user_perm.has_permission? Permission::READ).to be_truthy
    end

    it "should have SYNC_MOBILE permission" do
      expect(@user_perm.has_permission? Permission::SYNC_MOBILE).to be_truthy
    end

    it "should have APPROVE_CASE_PLAN permission" do
      expect(@user_perm.has_permission? Permission::APPROVE_CASE_PLAN).to be_truthy
    end

    it "should not have WRITE permission" do
      expect(@user_perm.has_permission? Permission::WRITE).to be_falsey
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
        expect(@user_group.has_group_permission? Permission::GROUP).to be_falsey
      end

      it "should not have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_falsey
      end
    end

    context "when logged in with GROUP permissions" do
      before do
        @user_group = User.new(:user_name => 'fake_group')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::GROUP)])
      end

      it "should have GROUP permission" do
        expect(@user_group.has_group_permission? Permission::GROUP).to be_truthy
      end

      it "should not have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_falsey
      end
    end

    context "when logged in with ALL permissions" do
      before do
        @user_group = User.new(:user_name => 'fake_all')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::ALL)])
      end

      it "should not have GROUP permission" do
        expect(@user_group.has_group_permission? Permission::GROUP).to be_falsey
      end

      it "should have ALL permission" do
        expect(@user_group.has_group_permission? Permission::ALL).to be_truthy
      end
    end
  end

  describe "agency_name" do
    context "when agency does not exist" do
      before do
        @user = build_and_save_user
      end

      it "should return nil" do
        expect(@user.agency_name).to be_nil
      end
    end

    context "when agency exists" do
      before do
        Agency.all.each {|a| a.destroy}
        agency = Agency.new(:name => "unicef", :agency_code => "12345")
        agency.save

        @user = build_and_save_user :organization => agency.id
      end

      it "should return the agency name" do
        expect(@user.agency_name).to eq('unicef')
      end
    end
  end

  describe "mailer" do
    before do
      ActiveJob::Base.queue_adapter = :inline
      @test_url = "http://test.com"
    end

    context 'when welcome email is enabled' do
      before do
        SystemSettings.all.each &:destroy
        @system_settings = SystemSettings.create(default_locale: "en", welcome_email_enabled: true)
      end

      context 'and user has an email address' do
        before do
          @user = build_and_save_user
        end

        it "sends a welcome email" do
          expect { @user.send_welcome_email(@test_url) }.to change { ActionMailer::Base.deliveries.count }.by(1)
        end
      end

      context 'and user does not have an email address' do
        before do
          @user = user = build_user(email: '')
        end

        it "does not send a welcome email" do
          expect { @user.send_welcome_email(@test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
        end
      end
    end

    context 'when welcome email is disabled' do
      before do
        SystemSettings.all.each &:destroy
        @system_settings = SystemSettings.create(default_locale: "en", welcome_email_enabled: false)
      end

      context 'and user has an email address' do
        before do
          @user = build_and_save_user
        end

        it "does not send a welcome email" do
          expect { @user.send_welcome_email(@test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
        end
      end

      context 'and user does not have an email address' do
        before do
          @user = user = build_user(email: '')
        end

        it "does not send a welcome email" do
          expect { @user.send_welcome_email(@test_url) }.to change { ActionMailer::Base.deliveries.count }.by(0)
        end
      end
    end
  end

  describe 'import' do
    before do
      User.all.each &:destroy
      Role.all.each &:destroy

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE])
      @role = create :role, permissions_list: [@permission_user_read_write], group_permission: Permission::GROUP
    end

    context 'when input has no password' do
      before do
        @input = {"disabled"=>false,
                  "full_name"=>"CP Administrator",
                  "user_name"=>"primero_admin_cp",
                  "verified"=>true,
                  "code"=>nil,
                  "phone"=>nil,
                  "email"=>"primero_admin_cp@primero.com",
                  "organization"=>"agency-unicef",
                  "position"=>nil,
                  "location"=>nil,
                  "role_ids"=>[@role.id],
                  "time_zone"=>"UTC",
                  "locale"=>nil,
                  "module_ids"=>[""],
                  "user_group_ids"=>[""],
                  "is_manager"=>true,
                  "updated_at"=>"2018-01-10T14:51:16.565Z",
                  "created_at"=>"2018-01-10T14:51:16.565Z",
                  "model_type"=>"User",
                  "_id"=>"user-primero-admin-cp"}
      end

      context 'and user does not exist' do
        it 'creates a user with a random password' do
          User.import(@input, nil).save!
          expect(User.find_by_user_name('primero_admin_cp').try(:crypted_password)).not_to be_empty
        end
      end

      context 'and user already exists' do
        before do
          @user = build_user({user_name: "primero_admin_cp"})
          @user.save
        end

        it 'retains the users current password' do
          User.import(@input, nil).save!
          expect(User.find_by_user_name('primero_admin_cp').try(:crypted_password)).to eq(@user.crypted_password)
        end
      end
    end
  end

  describe 'services' do
    context 'when agency with services exists for a new user' do
      before :each do
        Agency.all.each {|a| a.destroy}
        Agency.create(:id => 'unicef', :name => "unicef", :agency_code => "12345", :services => ['health_medical_service', 'shelter_service'])
        @user = build_user({:organization => 'unicef'})
      end
      context 'and user is created without services' do
        it 'should add agency services' do
          @user.save
          expect(@user.services).to eq(Agency.get('unicef').services)
        end
      end
      context 'and user is created with services' do
        it 'should not change user services' do
          user_services = ['livehood_services']
          @user.services = user_services
          @user.save
          expect(@user.services).to eq(user_services)
        end
      end
    end

    context 'when agency with services exists for an existing user' do
      before :each do
        Agency.all.each {|a| a.destroy}
        @user = build_user({:organization => 'unicef'})
        @user.save
        Agency.create(:id => 'unicef', :name => "unicef", :agency_code => "12345", :services => ['health_medical_service', 'shelter_service'])
      end

      context 'and user is updated without services' do
        it 'should not have services' do
          @user.services = []
          @user.save
          expect(@user.services).to eq([])
        end
      end

      context 'and user is updated with services' do
        it 'should only have user services' do
          user_services = ['family_service']
          @user.services = user_services
          @user.save
          expect(@user.services).to eq(user_services)
        end
      end
    end

    context 'when agency does not exist' do
      before :each do
        Agency.all.each {|a| a.destroy}
      end
      context 'and is a new user' do
        it 'should not have services' do
          @user = build_user({:organization => 'children'})
          @user.save
          expect(@user.services).to eq([])
        end
      end
    end
  end

  describe 'update user groups in the cases where the user is assigned', search: true do
    before do
      User.all.each(&:destroy)
      Child.all.each(&:destroy)

      Sunspot.setup(Child) do
        string 'associated_user_groups',  multiple: true
      end

      @current_user = User.create!(
                      :user_name => "user_name_#{rand(10000)}",
                      :full_name => 'full name',
                      :password => 'b00h00h00',
                      :password_confirmation => 'b00h00h00',
                      :email => 'email@ddress.net',
                      :organization => 'TW',
                      :disabled => 'false',
                      :verified => true,
                      :user_group_ids => ['user_group_1'],
                      :role_ids => ['random_role_id'],
                      :module_ids => ['test_module_id'])
      @child_1 = Child.create!(name: 'Child 1', assigned_user_names: [@current_user.user_name])
      @child_2 = Child.create!(name: 'Child 2', assigned_user_names: [@current_user.user_name])
      @child_3 = Child.create!(name: 'Child 3', assigned_user_names: [@current_user.user_name])

      Sunspot.commit
    end

    it "should update the associated_user_groups of the records" do
      @current_user.user_group_ids = ['user_group_2']
      @current_user.save!
      @child_1.reload
      @child_2.reload
      @child_3.reload
      expect(@child_1.associated_user_groups).to include('user_group_2')
      expect(@child_2.associated_user_groups).to include('user_group_2')
      expect(@child_3.associated_user_groups).to include('user_group_2')
    end
  end
end
