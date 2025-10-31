# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe User do
  before :all do
    clean_data(
      Alert, Location, AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup
    )
  end

  def build_user(options = {})
    user_name = "user_name_#{rand(10_000)}"
    options.reverse_merge!(user_name:, full_name: 'full name', password: 'b00h00h00',
                           password_confirmation: options[:password] || 'b00h00h00', email: "#{user_name}@ddress.net",
                           agency_id: options[:agency_id] || Agency.try(:last).try(:id), disabled: 'false',
                           role_id: options[:role_id] || Role.try(:last).try(:id))
    User.new(options)
  end

  def build_and_save_user(options = {})
    user = build_user(options)
    user.save
    user
  end

  describe 'validations' do
    before do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, UserGroup)
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

    it 'should default unverified to false' do
      user = User.new unverified: nil
      user.unverified.should be_falsey
    end

    it 'should generate id' do
      user = create(:user, user_name: 'test_user_123')
      user.id.present?.should == true
    end

    it 'should be invalid if an agency is missing' do
      user = build_user(agency_id: nil)
      expect(user).to be_invalid
    end

    it 'should be valid if an agency is missing but this is a system user' do
      user = build_user(agency_id: nil)
      user.service_account = true
      expect(user).to be_valid
    end

    describe 'locale' do
      before do
        @locale_user = build_user
      end

      context 'when blank' do
        before do
          @locale_user.locale = nil
        end

        it 'is valid' do
          expect(@locale_user).to be_valid
        end
      end

      context 'when present' do
        context 'and locale is in list of valid Primero locales' do
          before do
            @locale_user.locale = 'en'
          end

          it 'is valid' do
            expect(@locale_user).to be_valid
          end
        end

        context 'and locale is not in list of valid Primero locales' do
          before do
            @locale_user.locale = 'zz'
          end

          it 'is not valid' do
            expect(@locale_user).not_to be_valid
          end
        end
      end
    end

    describe 'when limit_maximum_users_enabled' do
      before do
        clean_data(SystemSettings)
        SystemSettings.create!(
          maximum_users: 20,
          maximum_users_warning: 15
        )
        SystemSettings.stub(:current).and_return(SystemSettings.first)
        user_double = double('User')
        allow(User).to receive(:enabled).and_return(user_double)
        allow(user_double).to receive(:count).and_return(20)
      end

      it 'should validate limit_user_reached on create' do
        user = build_user(user_name: 'random_user')
        expect(user).to be_invalid

        expect(user.errors.full_messages[0]).to eq(
          'You have reached your limit of 20 enabled Users. You must disable one or more Users before creating more.'
        )
      end

      it 'should validate limit_user_reached on enabling' do
        user = build_user(disabled: true)
        user.save(validate: false)

        user.disabled = false
        expect(user).to be_invalid
        expect(user.errors.full_messages[0]).to eq(
          'You have reached your limit of 20 enabled Users. ' \
          'You must disable one or more Users before creating or enabling more.'
        )
      end

      after do
        clean_data(SystemSettings)
      end
    end

    after do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, UserGroup)
    end
  end

  describe 'other validations' do
    before do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection)
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
      dupe_user = build_user(user_name: 'the_user_name')
      expect(dupe_user).not_to be_valid
    end

    it 'should consider a re-loaded user as valid' do
      user = build_user
      raise user.errors.full_messages.inspect unless user.valid?

      user.save

      reloaded_user = User.find(user.id)
      raise reloaded_user.errors.full_messages.inspect unless reloaded_user.valid?

      expect(reloaded_user).to be_valid
    end

    it 'should reject saving a changed password if the confirmation does not match' do
      user = build_user
      user.save
      user.password = 'f00f00'
      user.password_confirmation = 'not f00f00'
      user.valid?
      expect(user).not_to be_valid
    end

    it 'should allow password update if confirmation matches' do
      user = build_user
      user.save
      user.password = 'new_password1'
      user.password_confirmation = 'new_password1'

      expect(user).to be_valid
    end

    it 'should allow passwords with all alpha characters' do
      user = build_user(password: 'allAlpha')
      expect(user).to be_valid
    end

    it 'should allow passwords with all numeric characters' do
      user = build_user(password: '18675309')
      expect(user).to be_valid
    end

    it 'should reject passwords that are less than 8 characters' do
      user = build_user(password: 'sh0rt')
      expect(user).not_to be_valid
    end

    it 'does not use id for equality' do
      user = build_user
      user.save
      reloaded_user = User.find(user.id)
      reloaded_user.should eql(user)
      reloaded_user.should_not equal(user)
    end

    it 'cannot look up password in database' do
      user = build_and_save_user(password: 'thep4sswd')
      User.find(user.id).try(:password).should be_nil
    end

    it 'should have error on password_confirmation if no password_confirmation' do
      user = build_user(password: 't1mothy', password_confirmation: '')
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
        clean_data(User, IdentityProvider)
      end
      after do
        clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection)
      end
    end
  end

  describe 'self registration' do
    before do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, SystemSettings)
      agency = create(:agency)
      user_group = create(:user_group)
      role = create(:role)
      primero_program = create(:primero_program)
      single_form = create(:form_section)
      create(:primero_module, primero_program_id: primero_program.id,
                              form_sections: [single_form],
                              id: 1)
      SystemSettings.create(
        registration_streams: [
          {
            unique_id: 'primero',
            role: role.unique_id,
            user_category: 'tier-1',
            user_groups: [user_group.name],
            agency: agency.unique_id
          }
        ]
      )

      @params = ActionController::Parameters.new({
                                                   full_name: 'Test User 1',
                                                   user_name: 'test_user_1',
                                                   email: 'test_user_1@example.com',
                                                   password: 'password123',
                                                   password_confirmation: 'password123',
                                                   registration_stream: 'primero'
                                                 }).permit!
    end
    before(:each) { clean_data(User, IdentityProvider) }

    it 'should validate data_processing_consent_provided_on is present for self-registration users' do
      Primero::Application.config.allow_self_registration = true

      user = build_user(user_name: 'the_user_name', registration_stream: 'primero')
      expect(user).not_to be_valid
    end

    it 'should not require data_processing_consent_provided_on for non self-registration users' do
      Primero::Application.config.allow_self_registration = false

      user = build_user(user_name: 'the_user_name')
      expect(user).to be_valid
    end

    it 'builds a self-registration user' do
      user = User.create_self_registration_user(@params)
      expect(user).to be_valid
      expect(user.unverified).to eq(true)
    end

    it 'sets user as verified on password reset' do
      user = User.create_self_registration_user(@params)
      user.save!
      user.update!(password: 'newpassword123', password_confirmation: 'newpassword123')
      expect(user).to be_valid
      expect(user.unverified).to eq(false)
    end
  end

  describe 'automatic password generation on user creation for native users' do
    before do
      clean_data(User, Role, Agency)
      create(:agency)
      create(:role)
    end

    it 'generates a random password when a password is not provided on user creation' do
      user = build_user
      user.password = nil
      user.password_confirmation = nil
      user.save!

      expect(user.password.length).to be > 40
      expect(user.password_confirmation.length).to be > 40
      expect(user.password).to eq(user.password_confirmation)
    end

    it 'does not generate a random password if a password is provided' do
      password = 'avalidpasswooo00rd'
      user = build_user(password:)
      user.save!

      expect(user.valid_password?(password)).to be_truthy
    end

    it 'sends a password reset email when a password is generated' do
      user = build_user
      user.password = nil
      user.password_confirmation = nil
      expect(Devise::Mailer).to receive(:reset_password_instructions).and_call_original
      user.save!
    end

    it 'sends a password reset email when a user has different locale' do
      user = build_user
      user.locale = 'ar-LB'
      user.password = nil
      user.password_confirmation = nil
      expect(Devise::Mailer).to receive(:reset_password_instructions).and_call_original
      user.save!
    end

    after do
      clean_data(User, Role, Agency)
    end
  end

  describe 'Dates' do
    it 'should load roles only once' do
      dbl = double('roles', role: create(:role))
      user = build_and_save_user
      user.role.should == dbl.role
    end
  end

  describe 'audit log' do
    before do
      clean_data(AuditLog, User)
      @user = build_user
      @user.save(validate: false)

      @user2 = build_user
      @user2.save(validate: false)
    end

    describe '.mobile_login_history' do
      it "should be able to select a user's mobile login events from a list of login events" do
        AuditLog.create!(user: @user, action: 'login', timestamp: DateTime.now,
                         metadata: { mobile_id: 'IMEI1', mobile_number: '123-456-7890' })
        AuditLog.create!(user: @user, metadata: { mobile_id: nil, mobile_number: nil })
        AuditLog.create!(user: @user2, action: 'login', timestamp: DateTime.now,
                         metadata: { mobile_id: 'IMEI', mobile_number: '123-456-7890' })
        AuditLog.create!(user: @user2)
        sleep(1) # make sure we have a second gap in activities
        AuditLog.create!(user: @user, action: 'login', timestamp: DateTime.now,
                         metadata: { mobile_id: 'IMEI2', mobile_number: '123-456-7890' })
        AuditLog.create!(user: @user2, action: 'login', timestamp: DateTime.now,
                         metadata: { mobile_id: 'IMEI', mobile_number: '123-456-7890' })

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
    after do
      clean_data(AuditLog, User)
    end
  end

  describe 'user roles' do
    before do
      clean_data(User, Role)
    end

    it 'should load roles only once' do
      dbl = double('roles', role: create(:role))
      user = build_and_save_user
      user.role.should == dbl.role
    end

    it 'should store the roles and retrive them back as Roles' do
      admin_role = create(:role, name: 'Admin')
      user = create(:user, role_id: admin_role.id)
      User.find_by(user_name: user.user_name).role.should == admin_role
    end

    it 'should require at least one role for a verified user' do
      user = build_user(role_id: nil)
      user.should_not be_valid
    end

    after do
      clean_data(User, Role)
    end
  end

  describe 'manager' do
    before do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)

      @permission_user_read_write = Permission.new(resource: Permission::USER,
                                                   actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
      @permission_user_read = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      @manager_role = create(:role, permissions: [@permission_user_read_write], group_permission: Permission::GROUP,
                                    is_manager: true)
      @grunt_role = create :role, permissions: [@permission_user_read]
      @group_a = create(:user_group, name: 'A')
      @group_b = create(:user_group, name: 'B')

      @manager = create(:user, role_id: @manager_role.id, user_group_ids: [@group_a.id, @group_b.id])
      @grunt1 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_a.id])
      @grunt2 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_a.id])
      @grunt3 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_b.id])
      @grunt4 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_b.id])
    end

    it 'is a manager if set flag' do
      expect(@manager.manager?).to be_truthy
      expect(@grunt1.manager?).to be_falsey
      expect(@grunt2.manager?).to be_falsey
    end

    it 'manages all people in its group including itself' do
      expect(@manager.managed_users).to match_array([@grunt1, @grunt2, @grunt3, @grunt4, @manager])
    end

    it 'manages itself' do
      expect(@grunt1.managed_users).to eq([@grunt1])
    end

    it 'does not manage users who share an empty group with it' do
      manager = create :user, role_id: @manager_role.id, user_group_ids: [@group_a.id, nil]
      expect(manager.managed_users).to match_array([@grunt1, @grunt2, @manager, manager])
    end

    context 'when user belongs multiple user_groups and managers' do
      before(:each) do
        @group_c = create(:user_group, name: 'C')
        @manager2 = create(:user, role_id: @manager_role.id, user_group_ids: [@group_a.id, @group_b.id, @group_c.id])
        @user5 = create(:user, role_id: @grunt_role.id, user_group_ids: [@group_a.id, @group_b.id, @group_c.id])
      end
      it 'return managers' do
        expect(@user5.user_managers).to match_array([@manager, @manager2])
      end
    end

    after do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
    end
  end

  describe 'permissions' do
    before do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
      @permission_list = [Permission.new(resource: Permission::CASE,
                                         actions: [Permission::READ, Permission::SYNC_MOBILE,
                                                   Permission::APPROVE_CASE_PLAN, Permission::APPROVE_ASSESSMENT]),
                          Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ])]
      @role = create(:role, permissions: @permission_list, group_permission: Permission::SELF)
      @user_perm = create(:user, user_name: 'fake_self', role: @role)
    end

    it 'should have READ permission' do
      expect(@user_perm.permission?(Permission::READ)).to be_truthy
    end

    it 'should have SYNC_MOBILE permission' do
      expect(@user_perm.permission?(Permission::SYNC_MOBILE)).to be_truthy
    end

    it 'should have APPROVE_CASE_PLAN permission' do
      expect(@user_perm.permission?(Permission::APPROVE_CASE_PLAN)).to be_truthy
    end

    it 'should not have WRITE permission' do
      expect(@user_perm.permission?(Permission::WRITE)).to be_falsey
    end

    it 'should can_approve_assessment? equals true' do
      expect(@user_perm.can_approve_assessment?).to be_truthy
    end

    after do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
    end
  end

  describe 'group permissions' do
    before do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
      @permission_list = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
    end

    context 'when logged in with SELF permissions' do
      before :each do
        @user_group = User.new(user_name: 'fake_self')
        @user_group.stub(:roles).and_return([Role.new(permissions: @permission_list,
                                                      group_permission: Permission::SELF)])
      end

      it 'should not have GROUP permission' do
        expect(@user_group.group_permission?(Permission::GROUP)).to be_falsey
      end

      it 'should not have ALL permission' do
        expect(@user_group.group_permission?(Permission::ALL)).to be_falsey
      end
    end

    context 'when logged in with GROUP permissions' do
      before :each do
        @role = create(:role, permissions: @permission_list, group_permission: Permission::GROUP)
        @user_group = create(:user, user_name: 'fake_group', role: @role)
      end

      it 'should have GROUP permission' do
        expect(@user_group.group_permission?(Permission::GROUP)).to be_truthy
      end

      it 'should not have ALL permission' do
        expect(@user_group.group_permission?(Permission::ALL)).to be_falsey
      end
    end

    context 'when logged in with ALL permissions' do
      before do
        @role = create(:role, permissions: @permission_list, group_permission: Permission::ALL)
        @user_group = create(:user, user_name: 'fake_all', role: @role)
      end

      it 'should not have GROUP permission' do
        expect(@user_group.group_permission?(Permission::GROUP)).to be_falsey
      end

      it 'should have ALL permission' do
        expect(@user_group.group_permission?(Permission::ALL)).to be_truthy
      end
    end

    after do
      clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
    end
  end

  describe 'agency_name' do
    context 'when agency does not exist' do
      before do
        clean_data(Agency, Role, User, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
        @user = build_and_save_user
      end

      it 'should return nil' do
        expect(@user.agency.try(:name)).to be_nil
      end

      after do
        clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)
      end
    end

    context 'when agency exists' do
      before do
        Agency.destroy_all
        agency = create(:agency, name: 'unicef')

        @user = build_and_save_user(agency_id: agency.id)
      end

      it 'should return the agency name' do
        expect(@user.agency.name).to eq('unicef')
      end

      after do
        clean_data(Agency)
      end
    end
  end

  xdescribe 'import' do
    before do
      clean_data(User, Role)
      @permission_user_read_write = Permission.new(resource: Permission::USER,
                                                   actions: [Permission::READ, Permission::WRITE])
      @role = create :role, permissions: [@permission_user_read_write], group_permission: Permission::GROUP
    end

    # TODO: Fix on importer
    context 'when input has no password' do
      before do
        @input = { 'disabled' => false, 'full_name' => 'CP Administrator', 'user_name' => 'primero_admin_cp',
                   'code' => nil, 'phone' => nil, 'email' => 'primero_admin_cp@primero.com',
                   'organization' => 'agency-unicef', 'position' => nil, 'location' => nil, 'role_id' => [@role.id],
                   'time_zone' => 'UTC', 'locale' => nil, 'user_group_ids' => [''], 'is_manager' => true,
                   'updated_at' => '2018-01-10T14:51:16.565Z', 'created_at' => '2018-01-10T14:51:16.565Z',
                   'model_type' => 'User', 'unique_id' => 'user-primero-admin-cp', 'id' => 1 }
      end

      context 'and user does not exist' do
        it 'creates a user with a random password' do
          User.import(@input, nil).save!
          expect(User.find_by_user_name('primero_admin_cp').try(:crypted_password)).not_to be_empty
        end
      end

      context 'and user already exists' do
        before do
          @user = build_user(user_name: 'primero_admin_cp')
          @user.save
        end

        it 'retains the users current password' do
          User.import(@input, nil).save!
          expect(User.find_by(user_name: 'primero_admin_cp').try(:crypted_password)).to eq(@user.crypted_password)
        end
      end
    end

    after do
      clean_data(User, Role)
    end
  end

  describe 'services' do
    before do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection)
      create(:agency, name: 'unicef', agency_code: 'unicef', services: %w[health_medical_service shelter_service])
      create(:role)
      primero_program = create(:primero_program)
      single_form = create(:form_section)
      create(:primero_module, primero_program_id: primero_program.id, form_sections: [single_form], id: 1)
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
        agency = Agency.create(name: 'unicef', agency_code: 'unicef',
                               services: %w[health_medical_service shelter_service])
        @user = build_user(agency_id: agency.id)
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
          @user = build_user(agency_id: 2)
          @user.save
          expect(@user.services).to eq(nil)
        end
      end
    end

    after do
      clean_data(AuditLog, User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection)
    end
  end

  describe 'reporting location' do
    before do
      clean_data(User, Role, Location, SystemSettings)
      allow(I18n).to receive(:available_locales) { %i[en fr] }

      @country = create(:location, placename_all: 'MyCountry', type: 'country', location_code: 'MC01')
      @province1 = create(:location, hierarchy_path: "#{@country.location_code}.PR01", placename_all: 'Province 1',
                                     type: 'province', location_code: 'PR01')
      @district = create(:location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.D01",
                                    placename_all: 'District 1', type: 'district', location_code: 'D01')
      @role_province = Role.create!(name: 'Admin',
                                    permissions: [Permission.new(resource: Permission::CASE,
                                                                 actions: [Permission::MANAGE])],
                                    reporting_location_level: 1)
      @role_district = Role.create!(name: 'Field Worker',
                                    permissions: [Permission.new(resource: Permission::CASE,
                                                                 actions: [Permission::MANAGE])],
                                    reporting_location_level: 2)
      @role_no_level = Role.create!(name: 'Field Worker 2',
                                    permissions: [Permission.new(resource: Permission::CASE,
                                                                 actions: [Permission::MANAGE])])
      reporting_location = ReportingLocation.new(field_key: 'test', admin_level: 2)
      @system_settings = SystemSettings.create(default_locale: 'en', reporting_location_config: reporting_location)
    end

    context 'when role does not specify reporting location level' do
      before do
        @user = build_user(location: @district.location_code, role_id: @role_no_level.id)
      end

      it 'returns the admin level location specified in System Settings' do
        expect(@user.reporting_location).to eq(@district)
      end
    end

    context 'when role specifies reporting location level' do
      context 'and specified location level is district' do
        before do
          @user = build_user(location: @district.location_code, role_id: @role_district.id)
        end

        it 'returns the district location' do
          expect(@user.reporting_location).to eq(@district)
        end
      end

      context 'and specified location level is province' do
        before do
          @user = build_user(location: @district.location_code, role_id: @role_province.id)
        end

        it 'returns the province location' do
          expect(@user.reporting_location).to eq(@province1)
        end
      end
    end

    after do
      clean_data(User, Role, Location, SystemSettings)
    end
  end

  describe '#user_query_scope' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      @program = PrimeroProgram.create!(unique_id: 'primeroprogram-primero', name: 'Primero',
                                        description: 'Default Primero Program')
      @form_section = FormSection.create!(unique_id: 'test_form', name: 'Test Form',
                                          fields: [Field.new(name: 'national_id_no', type: 'text_field',
                                                             display_name: 'National ID No')])
      @cp = PrimeroModule.create!(unique_id: PrimeroModule::CP, name: 'CP', description: 'Child Protection',
                                  associated_record_types: %w[case tracing_request incident], primero_program: @program,
                                  form_sections: [@form_section])
      @role1 = Role.create!(name: 'Admin role', unique_id: 'role_admin',
                            form_sections: [@form_section], modules: [@cp],
                            permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])])
      @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @group1 = UserGroup.create!(name: 'group 1')
      @current_user = User.create!(full_name: 'Admin User', user_name: 'user_admin', password: 'a12345678',
                                   password_confirmation: 'a12345678', email: 'user_admin@localhost.com',
                                   agency_id: @agency1.id, role: @role1, user_groups: [@group1])
      @child1 = Child.new_with_user(@current_user, name: 'Child 3')
      @child1.save!
    end

    it 'return the scope of the user' do
      expect(@current_user.user_query_scope(@child1)).to eql(Permission::USER)
    end

    after do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe '#record_query_scope' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      @agency_test = Agency.create!(name: 'Agency test1', agency_code: 'agency_test1')
      @group_test = UserGroup.create!(name: 'group test')
      @role_test = Role.create!(name: 'Admin role1', unique_id: 'role_test1', group_permission: 'group',
                                permissions: [Permission.new(resource: Permission::CASE,
                                                             actions: [Permission::MANAGE])])
      @current_user = User.create!(full_name: 'user_record_query_scope', user_name: 'user_record_query_scope',
                                   password: 'a12345678', password_confirmation: 'a12345678',
                                   email: 'user_record_query_scope@localhost.com',
                                   user_groups: [@group_test], agency_id: @agency_test.id, role: @role_test)
    end

    it 'return the query scope of the user' do
      expect(@current_user.record_query_scope(Child)).to eql(user: { 'group' => [@group_test.unique_id] })
    end

    after do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe 'when user groups are updated for a user', search: true do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      create(:agency)
      create(:role)
      @user1 = build_user
      @user2 = build_user
      @user_group1 = UserGroup.create!(name: 'User Group 1')

      @user1.user_groups = [@user_group1]
      @user1.save!

      @user2.save!

      @case1 = Child.new_with_user(@user1, first_name: 'Case 1')
      @case1.assigned_user_names = [@user2.user_name]
      @case1.save!
    end

    it 'should not update cases if the user groups are already there' do
      last_updated_at = @case1.last_updated_at
      @user2.user_groups = [@user_group1]
      @user2.save!

      @case1.reload

      expect(@case1.last_updated_at).to eq(last_updated_at)
    end

    after do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe 'authorized_referral_roles' do
    let(:primero_module_cp) do
      PrimeroModule.create!(
        primero_program: PrimeroProgram.first,
        name: 'PrimeroModule',
        unique_id: PrimeroModule::CP,
        associated_record_types: ['case'],
        form_sections: []
      )
    end
    let(:role1) do
      role1 = Role.new_with_properties(
        name: 'permission_role_1',
        unique_id: 'permission_role_1',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      )
      role1.save!
      role1
    end

    let(:role2) do
      role2 = Role.new_with_properties(
        name: 'permission_role_2',
        unique_id: 'permission_role_2',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      )
      role2.save!
      role2
    end

    let(:role3) do
      role3 = Role.new_with_properties(
        name: 'permission_role_3',
        unique_id: 'permission_role_3',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [
              Permission::REFERRAL, Permission::RECEIVE_REFERRAL, Permission::MANAGE
            ]
          )
        ]
      )
      role3.save!
      role3
    end

    let(:role4) do
      role4 = Role.new(
        name: 'permission_role_4',
        group_permission: Permission::SELF,
        modules: [primero_module_cp]
      )
      role4.save(validate: false)
      role4.unique_id = nil
      role4.save(validate: false)
      role4
    end

    let(:child) do
      Child.create!(
        data: {
          name: 'Test',
          owned_by: 'user_creator',
          module_id: PrimeroModule::CP,
          consent_for_services: true,
          disclosure_other_orgs: true
        }
      )
    end

    let(:user_referred) do
      user_referred = build_user(user_name: 'user_referred', role_id: role3.id)
      user_referred.save(validate: false)
      user_referred
    end

    let(:user_creator) do
      user_creator = build_user(user_name: 'user_creator', role_id: role1.id)
      user_creator.save(validate: false)
      user_creator
    end

    before do
      clean_data(Alert, Referral, User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      role1
      role2
      role3
      role4
      user_creator
      user_referred
    end

    context 'when the all the referrals specify an authorized_role' do
      it 'returns the roles specified in the referrals' do
        Referral.create!(
          transitioned_by: 'user_creator',
          transitioned_to: 'user_referred',
          record: child,
          authorized_role_unique_id: role1.unique_id
        )
        Referral.create!(
          transitioned_by: 'user_creator',
          transitioned_to: 'user_referred',
          record: child,
          authorized_role_unique_id: role2.unique_id
        )

        expect(user_referred.authorized_referral_roles(child).ids).to match_array([role1.id, role2.id])
      end
    end

    context 'when one referral does not specify an authorized_role' do
      it 'returns the roles specified in the referrals including the user role' do
        Referral.create!(
          transitioned_by: 'user_creator',
          transitioned_to: 'user_referred',
          record: child,
          authorized_role_unique_id: role1.unique_id
        )
        Referral.create!(
          transitioned_by: 'user_creator',
          transitioned_to: 'user_referred',
          record: child
        )

        expect(user_referred.authorized_referral_roles(child).ids).to match_array([role1.id, role3.id])
      end
    end

    after do
      clean_data(Alert, Referral, User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe '.by_resource_and_permission' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      @module_cp = PrimeroModule.new(name: 'CP')
      @module_cp.save(validate: false)

      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE, Permission::CREATE,
          Permission::REFERRAL, Permission::RECEIVE_REFERRAL,
          Permission::ASSIGN, Permission::TRANSFER, Permission::RECEIVE_TRANSFER
        ]
      )
      permission_incident_assign = Permission.new(
        resource: Permission::INCIDENT, actions: [Permission::ASSIGN]
      )
      permission_incident = Permission.new(
        resource: Permission::INCIDENT,
        actions: [
          Permission::READ
        ]
      )
      @role = Role.new(permissions: [permission_case], modules: [@module_cp])
      @role.save(validate: false)
      @role_case_incident = Role.new(permissions: [permission_case, permission_incident_assign], modules: [@module_cp])
      @role_case_incident.save(validate: false)
      @role_incident = Role.new(permissions: [permission_incident], modules: [@module_cp])
      @role_incident.save(validate: false)
      @group1 = UserGroup.create!(name: 'Group1')
      @user1 = User.new(user_name: 'user1', role: @role_case_incident, user_groups: [@group1])
      @user1.save(validate: false)
      @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group1])
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'user3', role: @role_incident, user_groups: [@group1])
      @user3.save(validate: false)
      @user4 = User.new(user_name: 'user4', role: @role, user_groups: [@group1])
      @user4.save(validate: false)
      @user5 = User.new(user_name: 'user5', role: @role, user_groups: [@group1])
      @user5.save(validate: false)
      @user6 = User.new(user_name: 'user6', role: @role_incident, user_groups: [@group1])
      @user6.save(validate: false)
    end

    it 'return the query scope of the user' do
      expect(
        User.by_resource_and_permission(Permission::CASE, [Permission::ASSIGN]).pluck(:user_name)
      ).to match_array(%w[user1 user2 user4 user5])
    end

    after do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe '.permitted_api_params' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      @module_cp = PrimeroModule.new(name: 'CP')
      @module_cp.save(validate: false)

      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      @role = Role.new(permissions: [permission_case], modules: [@module_cp])
      @role.save(validate: false)
      @group1 = UserGroup.create!(name: 'Group1')
      @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
      @user1.save(validate: false)
    end
    context 'when user is not admin' do
      it 'should not returm that are not allowed' do
        expect(User.permitted_api_params(@user1, @user1)).not_to include(
          *User.self_hidden_attributes
        )
      end
    end

    after do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end
  end

  describe '.with_audit_dates' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
      @module_cp = PrimeroModule.new(name: 'CP')
      @module_cp.save(validate: false)

      permission_case = Permission.new(
        resource: Permission::CASE,
        actions: [Permission::MANAGE]
      )
      @role = Role.new(permissions: [permission_case], modules: [@module_cp])
      @role.save(validate: false)
      @group1 = UserGroup.create!(name: 'Group1')
      @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
      @user1.save(validate: false)
      @other_user = User.new(user_name: 'other_user', role: @role, user_groups: [@group1])
      @other_user.save(validate: false)
    end

    let!(:login_log) do
      AuditLog.create!(
        user_id: @user1.id,
        action: 'login',
        timestamp: Time.utc(2023, 1, 1, 10, 0, 0)
      )
    end

    let!(:case_viewed_log) do
      AuditLog.create!(
        user_id: @user1.id,
        record_type: 'Child',
        action: 'show',
        timestamp: Time.utc(2023, 2, 1, 10, 0, 0)
      )
    end

    let!(:case_updated_log) do
      AuditLog.create!(
        user_id: @user1.id,
        record_type: 'Child',
        action: 'update',
        timestamp: Time.utc(2023, 3, 1, 10, 0, 0)
      )
    end
    it 'returns last_access, last_case_viewed, and last_case_updated for each user' do
      results = User.with_audit_dates.where(id: @user1.id).first

      expect(results.last_access.iso8601(3)).to eq('2023-01-01T10:00:00.000Z')
      expect(results.last_case_viewed.iso8601(3)).to eq('2023-02-01T10:00:00.000Z')
      expect(results.last_case_updated.iso8601(3)).to eq('2023-03-01T10:00:00.000Z')
    end

    it 'returns nil for audit fields if there are no logs for that user/event' do
      results = User.with_audit_dates.where(id: @other_user.id).first

      expect(results.last_access).to eq(nil)
      expect(results.last_case_viewed).to eq(nil)
      expect(results.last_case_updated).to eq(nil)
    end
  end

  describe '.with_audit_date_between' do
    before do
      clean_data(AuditLog, User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end

    let(:primero_module) do
      create(:primero_module, name: 'CP')
    end

    let(:role) do
      create(:role, is_manager: true, modules: [primero_module], permissions: [Permission.new(
        resource: Permission::CASE,
        actions: [Permission::MANAGE]
      )])
    end

    let!(:user1) do
      create(:user, user_name: 'user1', role: role, full_name: 'Test User 1', email: 'owner@primero.dev')
    end

    let!(:other_user) do
      create(:user, user_name: 'other_user', role:, full_name: 'Test User 2', email: 'other_user@primero.dev')
    end

    let!(:child) do
      create(:child, name: 'Test', owned_by: user1.user_name, consent_for_services: true,
                     disclosure_other_orgs: true, module_id: PrimeroModule::CP)
    end

    let!(:login_log) do
      AuditLog.create!(
        user_id: user1.id,
        action: 'login',
        record_type: 'User',
        timestamp: Time.utc(2023, 2, 10, 10, 0, 0)
      )
    end

    let!(:case_viewed_log) do
      AuditLog.create!(
        user_id: user1.id,
        record_type: 'Child',
        action: 'show',
        timestamp: Time.utc(2023, 2, 1, 10, 0, 0)
      )
    end

    let!(:case_updated_log) do
      AuditLog.create!(
        user_id: user1.id,
        record_type: 'Child',
        action: 'update',
        timestamp: Time.utc(2023, 3, 1, 10, 0, 0)
      )
    end

    it 'returns last_access for a user' do
      results = User.with_audit_dates.with_audit_date_between(
        **User::AUDIT_LAST_DATE[:last_access],
        from: Time.utc(2023, 2, 1, 10, 0, 0),
        to: Time.utc(2023, 4, 1, 10, 0, 0)
      )
      expect(results.size).to eq(1)
      expect(results.first.last_access.iso8601(3)).to eq('2023-02-10T10:00:00.000Z')
    end

    it 'returns last_case_viewed for a user' do
      results = User.with_audit_dates.with_audit_date_between(
        **User::AUDIT_LAST_DATE[:last_case_viewed],
        from: Time.utc(2023, 2, 1, 10, 0, 0),
        to: Time.utc(2023, 3, 1, 10, 0, 0)
      )
      expect(results.size).to eq(1)
      expect(results.first.last_case_viewed.iso8601(3)).to eq('2023-02-01T10:00:00.000Z')
    end

    it 'returns last_case_updated for a user' do
      results = User.with_audit_dates.with_audit_date_between(
        **User::AUDIT_LAST_DATE[:last_case_updated],
        from: Time.utc(2023, 2, 1, 10, 0, 0),
        to: Time.utc(2023, 3, 1, 10, 0, 0)
      )

      expect(results.size).to eq(1)
      expect(results.first.last_case_updated.iso8601(3)).to eq('2023-03-01T10:00:00.000Z')
    end
  end

  describe '.apply_date_filters' do
    before do
      clean_data(AuditLog, User, Role, PrimeroModule, PrimeroProgram, FormSection, Agency, UserGroup, Child)
    end

    let(:primero_module) do
      create(:primero_module, name: 'CP')
    end

    let(:role) do
      create(:role, is_manager: true, modules: [primero_module], permissions: [Permission.new(
        resource: Permission::CASE,
        actions: [Permission::MANAGE]
      )])
    end

    let!(:user1) do
      create(:user, user_name: 'user1', role: role, full_name: 'Test User 1', email: 'owner@primero.dev')
    end

    let!(:other_user) do
      create(:user, user_name: 'other_user', role:, full_name: 'Test User 2', email: 'other_user@primero.dev')
    end

    let!(:child) do
      create(:child, name: 'Test', owned_by: user1.user_name, consent_for_services: true,
                     disclosure_other_orgs: true, module_id: PrimeroModule::CP)
    end

    let!(:login_log) do
      AuditLog.create!(
        user_id: user1.id,
        action: 'login',
        record_type: 'User',
        timestamp: Time.utc(2023, 2, 10, 10, 0, 0)
      )
    end

    let!(:case_viewed_log) do
      AuditLog.create!(
        user_id: user1.id,
        record_type: 'Child',
        record_id: child.id,
        action: 'show',
        timestamp: Time.utc(2023, 2, 1, 10, 0, 0)
      )
    end

    let!(:case_updated_log) do
      AuditLog.create!(
        user_id: user1.id,
        record_type: 'Child',
        record_id: child.id,
        action: 'update',
        timestamp: Time.utc(2023, 3, 1, 10, 0, 0)
      )
    end

    it 'returns last_access for a user' do
      users = User.with_audit_dates
      results = User.apply_date_filters(users,
                                        { last_access: { 'from' => Time.utc(2023, 2, 1, 10, 0, 0).iso8601(3),
                                                         'to' => Time.utc(2023, 4, 1, 10, 0, 0).iso8601(3) } })
      expect(results.size).to eq(1)
      expect(results.first.last_access.iso8601(3)).to eq('2023-02-10T10:00:00.000Z')
    end
  end

  describe '.who_accessed_record' do
    before do
      clean_data(AuditLog, User, Role, PrimeroModule, Child)
    end

    let(:primero_module) do
      create(:primero_module, name: 'CP')
    end

    let(:role) do
      create(:role, is_manager: true, modules: [primero_module], permissions: [Permission.new(
        resource: Permission::CASE,
        actions: [Permission::MANAGE]
      )])
    end

    let!(:user1) do
      create(:user, user_name: 'user1', role:, full_name: 'Test User 1', email: 'owner@primero.dev')
    end

    let!(:user2) do
      create(:user, user_name: 'user2', role:, full_name: 'Test User 2', email: 'user2@primero.dev')
    end

    let!(:user_login) do
      create(:user, user_name: 'user_login', role:, full_name: 'Test User 2', email: 'user_login@primero.dev')
    end

    let!(:child) do
      create(:child, name: 'Test', owned_by: user1.user_name, consent_for_services: true,
                     disclosure_other_orgs: true, module_id: PrimeroModule::CP)
    end

    let!(:login_log) do
      AuditLog.create!(
        user_id: user_login.id,
        action: 'login',
        record_type: 'User',
        timestamp: Time.utc(2023, 2, 10, 10, 0, 0)
      )
    end

    let!(:case_viewed_log) do
      AuditLog.create!(
        user_id: user1.id,
        record_type: 'Child',
        record_id: child.id,
        action: 'show',
        timestamp: Time.utc(2023, 2, 1, 10, 0, 0)
      )
    end

    let!(:case_updated_log) do
      AuditLog.create!(
        user_id: user2.id,
        record_type: 'Child',
        record_id: child.id,
        action: 'update',
        timestamp: Time.utc(2023, 3, 1, 10, 0, 0)
      )
    end

    let!(:case_updated_log2) do
      AuditLog.create!(
        user_id: user2.id,
        record_type: 'Child',
        record_id: child.id,
        action: 'update',
        timestamp: Time.utc(2023, 3, 3, 10, 0, 0)
      )
    end

    it 'returns uniq users who accessed the child' do
      result = User.who_accessed_record(child)
      expect(result.ids).to match_array(
        [user1.id, user2.id]
      )
    end
  end

  describe '#referred_record_ids' do
    before :each do
      clean_data(User, Role, Agency, Child, Referral)

      @agency = Agency.create!(name: 'Test Agency', agency_code: 'test_agency', unique_id: 'agency_test_1')
      role = create(:role)

      @user1 = User.create!(
        user_name: 'user1',
        full_name: 'Test User 1',
        password: 'password123',
        password_confirmation: 'password123',
        email: 'user1@example.com',
        agency_id: @agency.id,
        role_id: role.id
      )

      @user2 = User.create!(
        user_name: 'user2',
        full_name: 'Test User 2',
        password: 'password123',
        password_confirmation: 'password123',
        email: 'user2@example.com',
        agency_id: @agency.id,
        role_id: role.id
      )

      @child1 = Child.create!(data: { name: 'Child 1', age: 10, sex: 'male',
                                      consent_for_services: true,
                                      disclosure_other_orgs: true })
      @child2 = Child.create!(data: { name: 'Child 2', age: 12, sex: 'female',
                                      consent_for_services: true,
                                      disclosure_other_orgs: true })
      @child3 = Child.create!(data: { name: 'Child 3', age: 8, sex: 'male',
                                      consent_for_services: true,
                                      disclosure_other_orgs: true })
    end

    it 'returns record_ids with active referrals to the user' do
      Referral.create!(
        record: @child1,
        transitioned_to: @user1.user_name,
        transitioned_by: @user2.user_name,
        status: Transition::STATUS_INPROGRESS
      )

      Referral.create!(
        record: @child2,
        transitioned_to: @user1.user_name,
        transitioned_by: @user2.user_name,
        status: Transition::STATUS_ACCEPTED
      )

      Referral.create!(
        record: @child1,
        transitioned_to: @user1.user_name,
        transitioned_by: @user2.user_name,
        status: Transition::STATUS_REJECTED
      )

      Referral.create!(
        record: @child1,
        transitioned_to: @user2.user_name,
        transitioned_by: @user1.user_name,
        status: Transition::STATUS_INPROGRESS
      )

      record_ids = [@child1.id, @child2.id, @child3.id]
      result = @user1.referred_record_ids(record_ids, 'Child')

      expect(result).to match_array([@child1.id, @child2.id])
    end

    it 'returns empty array when no referrals exist' do
      record_ids = [@child1.id, @child2.id]
      result = @user1.referred_record_ids(record_ids, 'Child')

      expect(result).to be_empty
    end

    it 'returns empty array when record_ids is empty' do
      result = @user1.referred_record_ids([], 'Child')

      expect(result).to be_empty
    end
  end

  after do
    clean_data(Alert, User, Agency, Role, FormSection, Field)
  end
end
