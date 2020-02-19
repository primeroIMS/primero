require 'rails_helper'

describe User do

  before :all do
    clean_data(AuditLog, Agency, Role, PrimeroProgram, PrimeroModule, Field, FormSection)
  end

  def build_user(options = {})
    user_name = "user_name_#{rand(10_000)}"
    options.reverse_merge!(
      user_name: user_name,
      full_name: 'full name',
      password: 'b00h00h00',
      password_confirmation: options[:password] || 'b00h00h00',
      email: "#{user_name}@ddress.net",
      agency_id: options[:agency_id] || Agency.try(:last).try(:id),
      disabled: 'false',
      role_id: options[:role_id] || Role.try(:last).try(:id)
    )
    user = User.new(options)
    user
  end

  def build_and_save_user(options = {})
    user = build_user(options)
    user.save
    user
  end

  describe 'transition queries' do

    describe 'users_for_assign' do
      before :each do
        [UserGroup, User, Agency, Role].each(&:destroy_all)
        @group1 = UserGroup.create!(name: 'Group1')
        @group2 = UserGroup.create!(name: 'Group2')
        @group3 = UserGroup.create!(name: 'Group3')
        @agency1 = Agency.create!(name: 'Agency1', agency_code: 'A1')
        @agency2 = Agency.create!(name: 'Agency2', agency_code: 'A2')
        @user1 = User.new(user_name: 'user1', user_groups: [@group1, @group2], agency: @agency1)
        @user2 = User.new(user_name: 'user2', user_groups: [@group1], agency: @agency1)
        @user2.save(validate: false)
        @user3 = User.new(user_name: 'user3', user_groups: [@group2], agency: @agency1)
        @user3.save(validate: false)
        @user4 = User.new(user_name: 'user4', user_groups: [@group3], agency: @agency2)
        @user4.save(validate: false)
      end

      it 'shows all users for a user with the :assign permission' do
        permission = Permission.new(
          resource: Permission::CASE, actions: [Permission::ASSIGN]
        )
        role = Role.new(permissions: [permission])
        role.save(validate: false)
        @user1.role = role
        @user1.save(validate: false)


        users = User.users_for_assign(@user1, Child)
        expect(users.map(&:user_name)).to match_array(%w[user2 user3 user4])
      end

      it 'shows only users in the agency for a user with the :assign_within_agency permission' do
        permission = Permission.new(
          resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_AGENCY]
        )
        role = Role.new(permissions: [permission])
        role.save(validate: false)
        @user1.role = role
        @user1.save(validate: false)

        users = User.users_for_assign(@user1, Child)
        expect(users.map(&:user_name)).to match_array(%w[user2 user3])
      end

      it 'shows only users in the user groups for a user with the :assign_within_user_group permission' do
        permission = Permission.new(
          resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_USER_GROUP]
        )
        role = Role.new(permissions: [permission])
        role.save(validate: false)
        @user1.role = role
        @user1.save(validate: false)

        users = User.users_for_assign(@user1, Child)
        expect(users.map(&:user_name)).to match_array(%w[user2 user3])
      end

    end

    describe 'users_for_referral' do
      before :each do
        permission_receive = Permission.new(
          resource: Permission::CASE, actions: [Permission::RECEIVE_REFERRAL]
        )
        role_receive = Role.new(permissions: [permission_receive])
        role_receive.save(validate: false)

        permission_cannot = Permission.new(
          resource: Permission::CASE, actions: [Permission::READ]
        )
        role_cannot = Role.new(permissions: [permission_cannot])
        role_cannot.save(validate: false)


        @user1 = User.new(user_name: 'user1', role: role_receive)
        @user1.save(validate: false)
        @user2 = User.new(user_name: 'user2', role: role_receive, services: %w[safehouse_service])
        @user2.save(validate: false)
        @user3 = User.new(user_name: 'user3', role: role_receive)
        @user3.save(validate: false)
        @user4 = User.new(user_name: 'user4', role: role_cannot)
        @user4.save(validate: false)
      end

      it 'shows all users that can be referred to based on permission' do
        users = User.users_for_referral(@user1, Child, {})
        expect(users.map(&:user_name)).to match_array(%w[user2 user3])
      end

      it 'filters users based on service' do
        users = User.users_for_referral(@user1, Child, 'services' => 'safehouse_service')
        expect(users.map(&:user_name)).to match_array(%w[user2])
      end
    end

    describe 'users_for_transfer' do
      before :each do
        permission_receive = Permission.new(
          resource: Permission::CASE, actions: [Permission::RECEIVE_TRANSFER]
        )
        role_receive = Role.new(permissions: [permission_receive])
        role_receive.save(validate: false)

        permission_cannot = Permission.new(
          resource: Permission::CASE, actions: [Permission::READ]
        )
        role_cannot = Role.new(permissions: [permission_cannot])
        role_cannot.save(validate: false)


        @user1 = User.new(user_name: 'user1', role: role_receive)
        @user1.save(validate: false)
        @user2 = User.new(user_name: 'user2', role: role_receive)
        @user2.save(validate: false)
        @user3 = User.new(user_name: 'user3', role: role_receive)
        @user3.save(validate: false)
        @user4 = User.new(user_name: 'user4', role: role_cannot)
        @user4.save(validate: false)
      end

      it 'shows all users that can be referred to based on permission' do
        users = User.users_for_transfer(@user1, Child, {})
        expect(users.map(&:user_name)).to match_array(%w[user2 user3])
      end
    end

    after :each do
      [UserGroup, User, Agency, Role].each(&:destroy_all)
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
    it 'should not be valid when username contains whitespace' do
      user = build_user user_name: 'in val id'
      user.should_not be_valid
    end

    it 'should be valid when password contains whitespace' do
      user = build_user password: 'v4lid with spaces'
      user.should be_valid
    end

    it 'should not be valid when username already exists' do
      build_and_save_user user_name: 'existing_user'
      user = build_user user_name: 'existing_user'
      user.should_not be_valid
    end

    it 'should not be valid when email address is invalid' do
      user = build_user email: 'invalid_email'
      user.should_not be_valid
    end

    it 'should throw error if agency detail not entered' do
      user = build_user agency: nil
      user.should_not be_valid
    end

    it 'should default disabled to false' do
      user = User.new disabled: nil
      user.disabled.should be_falsey
    end

    it 'should generate id' do
      user = create(:user, user_name: 'test_user_123')
      user.id.present?.should == true
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
    before(:each) { clean_data(User, IdentityProvider) }

    it 'should validate uniqueness of username for new users' do
      user = build_user(user_name: 'the_user_name')
      expect(user).to be_valid
      user.save
      dupe_user = build_user(:user_name => 'the_user_name')
      dupe_user.should_not be_valid
    end

    it 'should consider a re-loaded user as valid' do
      user = build_user
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
    end

    it "should allow password update if confirmation matches" do
      user = build_user
      user.save
      user.password = 'new_password1'
      user.password_confirmation = 'new_password1'

      user.should be_valid
    end

    it "should reject passwords that don't have at least one alpha and at least 1 numeric character" do
      user = build_user :password => 'invalid'
      user.should_not be_valid
    end

    it 'should reject passwords that are less than 8 characters' do
      user = build_user :password => 'sh0rt'
      user.should_not be_valid
    end

    it "doesn't use id for equality" do
      user = build_user
      user.save

      reloaded_user = User.find(user.id)
      reloaded_user.should == user
      reloaded_user.should eql(user)
      reloaded_user.should_not equal(user)
    end

    it "can't look up password in database" do
      user = build_and_save_user(:password => "thep4sswd")
      User.find(user.id).try(:password).should be_nil
    end


    it "should have error on password_confirmation if no password_confirmation" do
      user = build_user({
                            :password => "t1mothy",
                            :password_confirmation => ""
                        })
      user.should_not be_valid
      user.errors[:password_confirmation].should_not be_nil
    end

    describe 'Enabled external identity providers' do

      before :each do
        @idp = IdentityProvider.create!(name: 'primero', unique_id: 'primeroims')
        allow_any_instance_of(User).to receive(:using_idp?).and_return(true)
      end

      it 'enforces email format for user names' do
        user = build_user(
          user_name: 'test',
          identity_provider_id: @idp.id
        )
        expect(user).to_not be_valid
      end

      it 'allows a user to be saved without a password' do
        user = build_user(
          user_name: 'test@primero.org',
          password: nil, password_confirmation: nil,
          identity_provider_id: @idp.id
        )
        expect(user).to be_valid
      end

      after :each do
        clean_data(IdentityProvider)
      end

    end

  end

  describe 'Dates' do
    it "should load roles only once" do
      dbl = double("roles", role: create(:role))
      user = build_and_save_user
      user.role.should == dbl.role
    end
  end

  describe 'audit log' do
    before :each do
      clean_data(AuditLog, User)
      @user = build_user
      @user.save(validate: false)

      @user2 = build_user
      @user2.save(validate: false)
    end

    describe '.mobile_login_history' do

      it "should be able to select a user's mobile login events from a list of login events" do
        AuditLog.create!(user: @user, action: 'login', timestamp: DateTime.now, metadata: {mobile_id: 'IMEI1', mobile_number: '123-456-7890'})
        AuditLog.create!(user: @user, metadata: {mobile_id: nil, mobile_number: nil})
        AuditLog.create!(user: @user2, action: 'login', timestamp: DateTime.now, metadata: {mobile_id: 'IMEI', mobile_number: '123-456-7890'})
        AuditLog.create!(user: @user2)
        sleep(1) #make sure we have a second gap in activities
        AuditLog.create!(user: @user, action: 'login', timestamp: DateTime.now, metadata: {mobile_id: 'IMEI2', mobile_number: '123-456-7890'})
        AuditLog.create!(user: @user2, action: 'login', timestamp: DateTime.now, metadata: {mobile_id: 'IMEI', mobile_number: '123-456-7890'})

        mobile_login_history = @user.mobile_login_history
        expect(mobile_login_history).to have(2).events
        expect(mobile_login_history.first.metadata['mobile_id']).to eq('IMEI2')
      end
    end

    describe 'last login timestamp' do
      it 'should not return last login activity if user has never logged in' do
        expect(@user.last_login).to be_nil
      end

      it 'should return last login activity if user does have login activity' do
        AuditLog.create(user: @user, action: 'login', timestamp: DateTime.new(2015, 10, 23, 14, 54, 55))
        login = AuditLog.create(user: @user, action: 'login', timestamp: DateTime.new(2015, 11, 23, 14, 54, 55))

        expect(@user.last_login).to eq(login.timestamp)
      end
    end
  end

  describe "user roles" do
    before :each do
      clean_data(Role, User)
    end

    it "should load roles only once" do
      dbl = double("roles", role: create(:role))
      user = build_and_save_user
      user.role.should == dbl.role
    end

    it "should store the roles and retrive them back as Roles" do
      admin_role = create(:role, name: "Admin")
      user = create(:user, role_id: admin_role.id)
      User.find_by(user_name: user.user_name).role.should == admin_role
    end

    it 'should require at least one role for a verified user' do
      user = build_user(role_id: nil)
      user.should_not be_valid
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
      @role = Role.create!(
        form_sections: [@form_section_b, @form_section_c],
        name: "Test Role", permissions: [@permission_case_read],
        modules: [@primero_module])
    end

    let(:user) { build(:user, user_name: "test_user", role: @role) }

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
      @manager_role = create(:role, permissions: [@permission_user_read_write], group_permission: Permission::GROUP, is_manager: true)
      @grunt_role = create :role, permissions: [@permission_user_read]
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
      @role = create(:role, permissions: @permission_list, group_permission: Permission::SELF)
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
        @user_group.stub(:roles).and_return([Role.new(permissions: @permission_list, group_permission: Permission::SELF)])
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
        @role = create(:role, permissions: @permission_list, group_permission: Permission::GROUP)
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
        @role = create(:role, permissions: @permission_list, group_permission: Permission::ALL)
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

  xdescribe 'import' do
    before do
      User.all.each &:destroy
      Role.all.each &:destroy

      @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE])
      @role = create :role, permissions: [@permission_user_read_write], group_permission: Permission::GROUP
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

  describe 'update user_groups in the cases where the user is assigned', search: true do
    before do
      clean_data(
        PrimeroProgram, PrimeroModule, Role, FormSection,
        Agency, UserGroup, User, Child
      )

      @program = PrimeroProgram.create!(
        unique_id: "primeroprogram-primero",
        name: "Primero",
        description: "Default Primero Program"
      )

      @form_section = FormSection.create!(
        unique_id: 'test_form',
        name: 'Test Form',
        fields: [
          Field.new(name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        ]
      )

      @cp = PrimeroModule.create!(
        unique_id: PrimeroModule::CP,
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form_section]
      )

      @role_admin = Role.create!(
        name: 'Admin role',
        unique_id: 'role_admin',
        group_permission: Permission::ALL,
        form_sections: [@form_section],
        modules: [@cp],
        permissions: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [Permission::MANAGE]
          )
        ]
      )

      @agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @agency_2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
      @group_1 = UserGroup.create!(name: 'group 1')
      @group_2 = UserGroup.create!(name: 'group 2')

      @associated_user = User.create!(
        full_name: 'User Test',
        user_name: 'user_test',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'user_test@localhost.com',
        agency_id: @agency_1.id,
        role: @role_admin,
        user_groups: [@group_1]
      )

      @current_user = User.create!(
        full_name: 'Admin User',
        user_name: 'user_admin',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'user_admin@localhost.com',
        agency_id: @agency_1.id,
        role: @role_admin,
        user_groups: [@group_1]
      )

      @child_1 = Child.new_with_user(@current_user, {
        name: 'Child 1',
        assigned_user_names: [@associated_user.user_name]
      })
      @child_2 = Child.new_with_user(@current_user, {
        name: 'Child 2',
        assigned_user_names: [@associated_user.user_name]
      })
      @child_3 = Child.new_with_user(@current_user, { name: 'Child 3' })
      [@child_1, @child_2, @child_3].each(&:save!)
      Sunspot.commit
    end

    it 'should update the associated_user_groups of the records' do
      @associated_user.user_groups = [@group_2]
      @associated_user.save!
      @child_1.reload
      @child_2.reload
      @child_3.reload
      expect(@child_1.associated_user_groups).to include(@group_1.unique_id, @group_2.unique_id)
      expect(@child_2.associated_user_groups).to include(@group_1.unique_id, @group_2.unique_id)
      expect(@child_3.associated_user_groups).to include(@group_1.unique_id)
    end
  end

  describe 'update agencies in the cases where the user is assigned', search: true do
    before do
      clean_data(
        PrimeroProgram, PrimeroModule, Role,
        FormSection, Agency, UserGroup, User, Child
      )

      @program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: "Default Primero Program"
      )

      @form_section = FormSection.create!(
        unique_id: 'test_form',
        name: 'Test Form',
        fields: [
          Field.new(name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        ]
      )

      @cp = PrimeroModule.create!(
        unique_id: PrimeroModule::CP,
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form_section]
      )

      @role_admin = Role.create!(
        name: 'Admin role',
        unique_id: "role_admin",
        group_permission: Permission::ALL,
        form_sections: [@form_section],
        modules: [@cp],
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])
        ]
      )

      @agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @agency_2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')

      @associated_user = User.create!(
        full_name: 'User Test',
        user_name: 'user_test',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'user_test@localhost.com',
        agency: @agency_1,
        role: @role_admin
      )

      @current_user = User.create!(
        full_name: 'Admin User',
        user_name: 'user_admin',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'user_admin@localhost.com',
        agency: @agency_1,
        role: @role_admin
      )

      @child_1 = Child.new_with_user(@current_user, {
         name: 'Child 1',
         assigned_user_names: [@associated_user.user_name]
       })
      @child_2 = Child.new_with_user(@current_user, {
         name: 'Child 2',
         assigned_user_names: [@associated_user.user_name]
       })
      @child_3 = Child.new_with_user(@current_user, { name: 'Child 3' })
      [@child_1, @child_2, @child_3].each(&:save!)
      Sunspot.commit
    end

    it 'should update the associated_user_agencies of the records' do
      @associated_user.agency = @agency_2
      @associated_user.save!
      @child_1.reload
      @child_2.reload
      @child_3.reload
      expect(@child_1.associated_user_agencies).to include(@agency_1.unique_id, @agency_2.unique_id)
      expect(@child_2.associated_user_agencies).to include(@agency_1.unique_id, @agency_2.unique_id)
      expect(@child_3.associated_user_agencies).to include(@agency_1.unique_id)
    end
  end
end
