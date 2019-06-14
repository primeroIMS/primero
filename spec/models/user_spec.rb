require 'rails_helper'

describe User do

  before :all do
    clean_data(AuditLog, Agency, Role, PrimeroProgram, PrimeroModule, Field, FormSection)
  end

  def build_user(options = {})
    options.reverse_merge!({
                               user_name: "user_name_#{rand(10000)}",
                               full_name: 'full name',
                               password: 'b00h00h00',
                               password_confirmation: options[:password] || 'b00h00h00',
                               email: 'email@ddress.net',
                               agency_id: options[:agency_id] || Agency.try(:last).try(:id),
                               disabled: 'false',
                               role_id: options[:role_id] || Role.try(:last).try(:id),
                               module_ids: [options[:module_ids] || PrimeroModule.try(:last).try(:id)]
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
    user = build_user(user_name: user_name)
    user.save
    date_time = DateTime.parse(date)
    DateTime.stub(:now).and_return(date_time)
    login_as(user, scope: Devise::Mapping.find_scope!(user))
    User.stub(:find_by_user_name).and_return(user)
    user.stub(:authenticate).and_return true
    AuditLog.create(user_name: user_name, action_name: 'login', record_type: 'user')
  end

  describe "last login timestamp" do
    before :each do
      clean_data(AuditLog, Agency, Role, PrimeroProgram, PrimeroModule, FormSection)
      create(:agency)
      create(:role)
      create(:primero_module)
    end

    it "shouldn't return last login activity if user has never logged in" do
      user = build_user(user_name: 'Billy')
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
    before :each do
      clean_data(AuditLog, Agency, Role, PrimeroProgram, PrimeroModule, FormSection, User, UserGroup)
      create(:agency)
      create(:role)
      primero_program = create(:primero_program)
      single_form = create(:form_section)
      create(:primero_module, primero_program_id: primero_program.id,
                              form_sections: [single_form])
    end
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
      user.errors[:email].should == ["is invalid", "Please enter a valid email address"]
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

    it "should generate _id" do
      user = create(:user, :user_name => 'test_user_123')
      user.id.present?.should == true
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

  describe "other validations" do
    before(:all) do
      clean_data(AuditLog, Agency, Role, PrimeroProgram,PrimeroModule, FormSection, User)
      create(:agency)
      create(:role)
      primero_program = create(:primero_program)
      single_form = create(:form_section)
      create(:primero_module, primero_program_id: primero_program.id,
                              form_sections: [single_form],
                              id: 1)
    end
    before(:each) { User.destroy_all }

    it 'should validate uniqueness of username for new users' do
      user = build_user(user_name: 'the_user_name')
      expect(user).to be_valid
      user.save
      dupe_user = build_user(:user_name => 'the_user_name')
      dupe_user.should_not be_valid
    end

    it 'should consider a re-loaded user as valid' do
      user = build_user(module_ids: 1)
      raise user.errors.full_messages.inspect unless user.valid?
      user.save

      reloaded_user = User.find(user.id)
      raise reloaded_user.errors.full_messages.inspect unless reloaded_user.valid?
      reloaded_user.should be_valid
    end

    it "should reject saving a changed password if the confirmation doesn't match" do
      user = build_user
      user.save
      user.password = 'f00f00'
      user.password_confirmation = 'not f00f00'

      user.valid?
      user.should_not be_valid
      user.errors[:password_confirmation].should include(I18n.t("errors.models.user.password_mismatch"))
    end

    it "should allow password update if confirmation matches" do
      user = build_user
      user.save
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
      user.save

      reloaded_user = User.find(user.id)
      #Now couchrest_model use the id for equality.
      reloaded_user.should == user
      reloaded_user.should eql(user)
      reloaded_user.should_not equal(user)
    end

    it "can't look up password in database" do
      user = build_and_save_user(:password => "thep4sswd")
      User.find(user.id).try(:password).should be_nil
    end

    # it "can authenticate if not disabled" do
    #   user = build_and_save_user(:disabled => "false", :password => "thep4sswd")
    #   user.authenticate("thep4sswd").should be_truthy
    # end

    it "should be able to select a user's mobile login events from a list of login events" do
      user = build_user
      user.save

      AuditLog.create!(user_name: user.user_name, action_name: 'login', timestamp: DateTime.now, mobile_data: {mobile_id: 'IMEI1', mobile_number: '123-456-7890'})
      AuditLog.create!(user_name: user.user_name, mobile_data: {mobile_id: nil, mobile_number: nil})
      AuditLog.create!(user_name: 'billybob', action_name: 'login', timestamp: DateTime.now, mobile_data: {mobile_id: 'IMEI', mobile_number: '123-456-7890'})
      AuditLog.create!(user_name: 'billybob')
      sleep(1) #make sure we have a second gap in activities
      AuditLog.create!(user_name: user.user_name, action_name: 'login', timestamp: DateTime.now, mobile_data: {mobile_id: 'IMEI2', mobile_number: '123-456-7890'})
      AuditLog.create!(user_name: 'sueanne', action_name: 'login', timestamp: DateTime.now, mobile_data: {mobile_id: 'IMEI', mobile_number: '123-456-7890'})

      mobile_login_history = user.mobile_login_history
      expect(mobile_login_history).to have(2).events
      expect(mobile_login_history.first.mobile_data['mobile_id']).to eq('IMEI2')
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
      dbl = double("roles", role: create(:role))
      user = build_and_save_user
      user.role.should == dbl.role
    end
  end

  describe "user roles" do
     before :each do
      clean_data(Role, User)
    end
    it "should store the roles and retrive them back as Roles" do
      admin_role = create(:role, name: "Admin")
      user = create(:user, role_id: admin_role.id)
      User.find_by(user_name: user.user_name).role.should == admin_role
    end

    it "should require atleast one role for a verified user" do
      user = build_user(:role_id => [])
      user.should_not be_valid
      user.errors[:role_id].should == ["Please select at least one role"]
    end
  end

  describe "permitted forms" do

    before :all do
      clean_data(FormSection, PrimeroModule, Role, PrimeroProgram, User, UserGroup)
      @form_section_a = create(:form_section, unique_id: "A", name: "A")
      @form_section_b = create(:form_section, unique_id: "B", name: "B")
      @form_section_c = create(:form_section, unique_id: "C", name: "C")
      @primero_module = create(:primero_module, form_sections: [@form_section_a, @form_section_b])
      @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @role = Role.create!(form_sections: [@form_section_b, @form_section_c], name: "Test Role", permissions_list: [@permission_case_read])
    end

    let(:user) { build(:user, user_name: "test_user", role: @role, module_ids: [@primero_module.id]) }

    it "not inherits the forms permitted by the modules" do
      expect(user.permitted_forms).to_not match_array([@form_section_a, @form_section_b])
    end

    it "will be permitted to only use forms granted by roles if such forms are explicitly set" do
      expect(user.permitted_forms).to match_array([@form_section_b, @form_section_c])
    end
  end

  describe "manager" do

    before :each do
      clean_data(Agency, Role, User, FormSection, PrimeroModule, PrimeroProgram, UserGroup)

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
      @permission_user_read = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      @manager_role = create(:role, permissions_list: [@permission_user_read_write], group_permission: Permission::GROUP, is_manager: true)
      @grunt_role = create :role, permissions_list: [@permission_user_read]
      @group_a = create(:user_group, name: "A")
      @group_b = create(:user_group, name: "B")

      @manager = create(:user, role_id: @manager_role.id, user_group_ids: [@group_a.id, @group_b.id])
      @grunt1 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_a.id])
      @grunt2 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_a.id])
      @grunt3 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_b.id])
      @grunt4 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_b.id])
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
      manager_role = create(:role, permissions_list: [@permission_user_read_write], group_permission: Permission::ALL, is_manager: true)
      manager = create :user, role_id: manager_role.id
      expect(manager.record_scope).to eq([Searchable::ALL_FILTER])
    end

    it "does not manage users who share an empty group with it" do
      manager = create :user, role_id: @manager_role.id, user_group_ids: [@group_a.id, nil]
      grunt = create :user, role_id: @grunt_role.id, user_group_ids: [@group_b.id, nil]
      expect(manager.managed_users).to match_array([@grunt1, @grunt2, @manager, manager])
    end

  end

  describe "permissions" do
    before :each do
      clean_data(Agency, Role, User, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
      @permission_list = [
                           Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SYNC_MOBILE, Permission::APPROVE_CASE_PLAN]),
                           Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ]),
                         ]
      @role = create(:role, permissions_list: @permission_list, group_permission: Permission::SELF)
      @user_perm = create(:user, user_name: 'fake_self', role: @role)
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
      clean_data(Agency, Role, User, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
      @permission_list = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
    end

    context "when logged in with SELF permissions" do
      before :each do
        @user_group = User.new(:user_name => 'fake_self')
        @user_group.stub(:roles).and_return([Role.new(permissions_list: @permission_list, group_permission: Permission::SELF)])
      end

      it "should not have GROUP permission" do
        expect(@user_group.group_permission? Permission::GROUP).to be_falsey
      end

      it "should not have ALL permission" do
        expect(@user_group.group_permission? Permission::ALL).to be_falsey
      end
    end

    context "when logged in with GROUP permissions" do
      before :each do
        @role = create(:role, permissions_list: @permission_list, group_permission: Permission::GROUP)
        @user_group = create(:user, user_name: 'fake_group', role: @role)
      end

      it "should have GROUP permission" do
        expect(@user_group.group_permission? Permission::GROUP).to be_truthy
      end

      it "should not have ALL permission" do
        expect(@user_group.group_permission? Permission::ALL).to be_falsey
      end
    end

    context "when logged in with ALL permissions" do
      before do
        @role = create(:role, permissions_list: @permission_list, group_permission: Permission::ALL)
        @user_group = create(:user, user_name: 'fake_all', role: @role)
      end

      it "should not have GROUP permission" do
        expect(@user_group.group_permission? Permission::GROUP).to be_falsey
      end

      it "should have ALL permission" do
        expect(@user_group.group_permission? Permission::ALL).to be_truthy
      end
    end
  end

  describe "agency_name" do
    context "when agency does not exist" do
      before do
        clean_data(Agency, Role, User, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
        @user = build_and_save_user
      end

      it "should return nil" do
        expect(@user.agency.try(:name)).to be_nil
      end
    end

    context "when agency exists" do
      before do
        Agency.destroy_all
        agency = create(:agency, name: "unicef")

        @user = build_and_save_user :agency_id => agency.id
      end

      it "should return the agency name" do
        expect(@user.agency.name).to eq('unicef')
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
        SystemSettings.destroy_all
        @system_settings = SystemSettings.create(default_locale: "en", welcome_email_enabled: true)
      end

      context 'and user has an email address' do
        before do
          @user = create(:user)
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

  xdescribe 'import' do
    before do
      User.all.each &:destroy
      Role.all.each &:destroy

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE])
      @role = create :role, permissions_list: [@permission_user_read_write], group_permission: Permission::GROUP
    end

    # TODO Fix on importer
    context 'when input has no password' do
      before do
        @input = {"disabled"=>false,
                  "full_name"=>"CP Administrator",
                  "user_name"=>"primero_admin_cp",
                  "code"=>nil,
                  "phone"=>nil,
                  "email"=>"primero_admin_cp@primero.com",
                  "organization"=>"agency-unicef",
                  "position"=>nil,
                  "location"=>nil,
                  "role_id"=>[@role.id],
                  "time_zone"=>"UTC",
                  "locale"=>nil,
                  "module_ids"=>[""],
                  "user_group_ids"=>[""],
                  "is_manager"=>true,
                  "updated_at"=>"2018-01-10T14:51:16.565Z",
                  "created_at"=>"2018-01-10T14:51:16.565Z",
                  "model_type"=>"User",
                  "unique_id"=>"user-primero-admin-cp",
                  "id" => 1}
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
          expect(User.find_by(user_name: 'primero_admin_cp').try(:crypted_password)).to eq(@user.crypted_password)
        end
      end
    end
  end

  describe 'services' do
    before(:all) do
      clean_data(AuditLog, Agency, Role, PrimeroProgram,PrimeroModule, FormSection, User)
      create(:agency, name: "unicef",
                      agency_code: "unicef",
                      services: ['health_medical_service', 'shelter_service'])
      create(:role)
      primero_program = create(:primero_program)
      single_form = create(:form_section)
      create(:primero_module, primero_program_id: primero_program.id,
                              form_sections: [single_form],
                              id: 1)
    end

    context 'when agency with services exists for a new user' do
      before(:each) { @user = build_user(agency_id: Agency.last.id, role_id: Role.last.id) }
      context 'and user is created without services' do
        it 'should add agency services' do
          @user.save
          expect(@user.services).to eq(Agency.find_by(agency_code: 'unicef').services)
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
        Agency.destroy_all
        agency = Agency.create(name: "unicef",
                               agency_code: "unicef",
                               services: ['health_medical_service', 'shelter_service'])
        @user = build_user({agency_id: agency.id})
        @user.save
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
        Agency.destroy_all
      end
      context 'and is a new user' do
        it 'should not have services' do
          @user = build_user({agency_id: 2})
          @user.save
          expect(@user.services).to eq(nil)
        end
      end
    end
  end
end
