# frozen_string_literal: true

require 'rails_helper'

describe Role do
  before :each do
    clean_data(Role, PrimeroModule)
  end

  describe 'Validations' do
    it 'should not be valid if name is empty' do
      role = Role.new
      role.should_not be_valid
      role.errors[:name].should == ['errors.models.role.name_present']
    end

    it 'should not be valid if permissions is empty' do
      role = Role.new
      role.should_not be_valid
      role.errors[:permissions].should == ['errors.models.role.permission_presence']
    end

    it 'should sanitize and check for permissions' do
      role = Role.new(name: 'Name', permissions: [])
      role.save
      role.should_not be_valid
      role.errors[:permissions].should == ['errors.models.role.permission_presence']
    end

    it 'should not be valid if a role name has been taken already' do
      Role.create(
        name: 'Unique', permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      )
      role = Role.new(
        name: 'Unique', permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      )
      role.should_not be_valid
      role.errors[:name].should == ['errors.models.role.unique_name']
    end

    describe 'reporting_location_level' do
      before do
        clean_data(SystemSettings)
        SystemSettings.create(default_locale: 'en',
                              reporting_location_config: { field_key: 'owned_by_location', admin_level: 2,
                                                           admin_level_map: { '1' => ['region'],
                                                                              '2' => ['district'] } })
        @role = Role.new(name: 'some_role',
                         permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])])
      end

      context 'with a valid reporting_location_level' do
        before :each do
          @role.reporting_location_level = 1
        end

        it 'is valid' do
          expect(@role).to be_valid
        end

        describe '.reporting_location_config' do
          it 'returns the reporting location of the role' do
            expect(@role.reporting_location_config.admin_level).to eq(1)
          end

          it 'returns the reporting location label_keys of the role' do
            expect(@role.reporting_location_config.label_keys).to eq(['region'])
          end
        end
      end

      context 'with an invalid reporting_location_level' do
        before :each do
          @role.reporting_location_level = 6
        end

        it 'returns an error message' do
          @role.valid?
          expect(@role.errors.messages[:reporting_location_level])
            .to eq(['errors.models.role.reporting_location_level'])
        end
      end

      context 'with a no reporting_location_level' do
        before :each do
          @role.reporting_location_level = nil
        end

        it 'is valid' do
          expect(@role).to be_valid
        end

        describe '.reporting_location_config' do
          it 'returns the default reporting location from SystemSettings' do
            expect(@role.reporting_location_config.admin_level).to eq(2)
          end

          it 'returns the default reporting location label_keys from SystemSettings' do
            expect(@role.reporting_location_config.label_keys).to eq(['district'])
          end
        end
      end
    end
  end

  describe 'creation' do
    it 'should create a valid role' do
      Role.new(
        name: 'some_role', permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      ).should be_valid
    end

    it 'should create a valid transfer role' do
      Role.new(
        name: 'some_role', transfer: true,
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      ).should be_valid
    end

    it 'should create a valid referral role' do
      Role.new(
        name: 'some_role', referral: true,
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      ).should be_valid
    end

    it 'should generate unique_id' do
      role = Role.new(
        name: 'test role 1234',
        permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
      )
      role.save(validate: false)
      expect(role.unique_id).to match(/^role-test-role-1234-[0-9a-f]{7}$/)
    end
  end

  describe '.super_user_role?' do
    before do
      super_user_permissions_to_manage = [
        Permission::CASE, Permission::INCIDENT, Permission::REPORT,
        Permission::ROLE, Permission::USER, Permission::USER_GROUP,
        Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
      ]
      @permissions_super_user =
        super_user_permissions_to_manage.map { |p| Permission.new(resource: p, actions: [Permission::MANAGE]) }
      @permission_not_super_user = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
    end

    context 'depending on the permissions of a role' do
      before do
        @role_super_user = Role.new(name: 'super_user_role', permissions: @permissions_super_user)
        @role_not_super_user = Role.new(name: 'not_super_user_role', permissions: [@permission_not_super_user])
      end
      context 'if the role manages all of the permissions of the super user' do
        it 'should return true for super_user_role?' do
          expect(@role_super_user.super_user_role?).to be_truthy
        end
      end

      context 'if the role does not manage all of the permissions of the super user' do
        it 'should return false for super_user_role?' do
          expect(@role_not_super_user.super_user_role?).to be_falsey
        end
      end
    end
  end

  describe 'user_admin_role?' do
    before do
      user_admin_permissions_to_manage = [
        Permission::ROLE, Permission::USER, Permission::USER_GROUP,
        Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
      ]
      @permissions_user_admin =
        user_admin_permissions_to_manage.map { |p| Permission.new(resource: p, actions: [Permission::MANAGE]) }
      @permission_not_user_admin = Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
    end

    context 'depending on the permissions of a role' do
      before do
        @role_user_admin = Role.new(name: 'super_user_role', permissions: @permissions_user_admin)
        @role_not_user_admin = Role.new(name: 'not_super_user_role', permissions: [@permission_not_user_admin])
      end
      context 'if the role manages all of the permissions of the user admin' do
        it 'should return true for user_admin_role?' do
          expect(@role_user_admin.user_admin_role?).to be_truthy
        end
      end

      context 'if the role does not manage all of the permissions of the user admin' do
        it 'should return false for user_admin_role?' do
          expect(@role_not_user_admin.user_admin_role?).to be_falsey
        end
      end
    end
  end

  describe 'associate_all_forms' do
    before do
      clean_data(Role, Field, FormSection, PrimeroModule, PrimeroProgram)
      @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
      @form_section_b = FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'x')
      @form_section_child =
        FormSection.create!(unique_id: 'child', name: 'child_form', is_nested: true, parent_form: 'case')
      @field_subform = Field.create!(
        name: 'field_subform', display_name: 'child_form', type: Field::SUBFORM, subform: @form_section_child
      )

      role_case_permissions = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
      @role = Role.create!(name: 'Role', permissions: role_case_permissions)
    end
    context 'when the role has permission to case' do
      it 'should associate all the forms_sections to the role' do
        @role.associate_all_forms
        @role.reload
        @role.form_sections.size.should eql 3
        expect(@role.form_sections.to_a).to match_array [@form_section_a, @form_section_b, @form_section_child]
      end
    end
    context 'when the form_section has subform' do
      it 'Reject forms from another primero-module with the associate_all_forms method' do
        primero_module = create(
          :primero_module, name: 'CP', description: 'Child Protection', associated_record_types: ['case']
        )
        @form_section_c = FormSection.create!(
          unique_id: 'parent', name: 'parent_form', parent_form: 'case', fields: [@field_subform],
          primero_modules: [primero_module]
        )
        @role.associate_all_forms
        @role.reload
        @role.form_sections.size.should eql 2
        expect(@role.form_sections).to match_array [@form_section_a, @form_section_b]
      end
    end
    context 'form from another primero-module' do
      before do
        clean_data(PrimeroModule, PrimeroProgram, Role)
        @primero_module = create(
          :primero_module, name: 'CP', description: 'Child Protection', associated_record_types: ['case']
        )
        @primero_module_gbv = create(
          :primero_module, name: 'GBV', description: 'gbv', associated_record_types: ['case']
        )
        @form_section_c = FormSection.create!(
          unique_id: 'C', name: 'C', parent_form: 'case', form_group_id: 'x', primero_modules: [@primero_module_gbv]
        )
      end
      it 'When save, reject forms from another primero-module' do
        role = create(:role, modules: [@primero_module], form_sections: [@form_section_c])
        expect(role.form_sections).to eq([])
      end
      it "When save, eject forms from any primero-module if the role doesn't have primero-module" do
        role = create(:role, modules: [], form_sections: [@form_section_c])
        expect(role.form_sections).to eq([])
      end
      it 'When update, reject forms from another primero-module' do
        role = create(:role, modules: [@primero_module])
        role.update(form_sections: [@form_section_c])
        expect(role.form_sections).to eq([])
      end
      it "When update, reject forms from any primero-module if the role doesn't have primero-module" do
        role = create(:role, modules: [])
        role.update(form_sections: [@form_section_c])
        expect(role.form_sections).to eq([])
      end
      after do
        clean_data(PrimeroModule, PrimeroProgram, Role)
      end
    end
  end

  describe '#update_properties' do
    before :each do
      clean_data(Field, FormSection, Role, PrimeroProgram, PrimeroModule)
      @program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: 'Default Primero Program'
      )
      @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
      @module_cp = PrimeroModule.create!(
        unique_id: 'primeromodule-cp-a',
        name: 'CPA',
        description: 'Child Protection A',
        associated_record_types: %w[case tracing_request incident],
        primero_program: @program,
        form_sections: [@form_section_a]
      )
      @permissions_test = [
        Permission.new(
          resource: Permission::ROLE,
          actions: [
            Permission::EXPORT_PDF,
            Permission::CREATE
          ],
          role_unique_ids: %w[
            role-cp-case-worker
            role-cp-manager
          ]
        ),
        Permission.new(
          resource: Permission::USER,
          actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::CREATE
          ]
        )
      ]
      Role.create(
        unique_id: 'role_test_01',
        name: 'name_test_01',
        description: 'description_test_01',
        group_permission: 'all',
        referral: false,
        transfer: false,
        is_manager: true,
        permissions: @permissions_test,
        form_sections: [@form_section_a],
        modules: [@module_cp]
      )
    end
    let(:full_properties) do
      {
        name: 'CP Administrator 00',
        description: 'updating full attributes',
        group_permission: 'all',
        referral: false,
        transfer: false,
        is_manager: true,
        form_section_read_write: { A: 'rw' },
        module_unique_ids: [@module_cp.unique_id],
        permissions: {
          agency: %w[
            read
            delete
          ],
          role: %w[
            delete
            read
          ],
          objects: {
            agency: %w[
              test_update_agency_00
              test_update_agency_01
            ],
            role: %w[
              test_update_role_01
              test_update_role_02
            ]
          }
        }
      }
    end
    let(:properties_without_permission) do
      {
        name: 'CP Administrator 01',
        description: 'no updating permission',
        group_permission: 'all',
        referral: false,
        transfer: false,
        is_manager: true,
        form_section_read_write: { A: 'rw' },
        module_unique_ids: [@module_cp.unique_id]
      }
    end
    let(:properties_without_module) do
      {
        name: 'CP Administrator 02',
        description: 'no updating module',
        group_permission: 'all',
        referral: false,
        transfer: false,
        is_manager: true,
        form_section_read_write: { A: 'rw' }
      }
    end
    let(:properties_without_forms) do
      {
        name: 'CP Administrator 03',
        description: 'no updating forms',
        group_permission: 'all',
        referral: false,
        transfer: false,
        is_manager: true
      }
    end
    subject { Role.last }

    context 'when update all attributes' do
      before do
        subject.update_properties(full_properties)
        subject.save
      end

      it 'should update the role' do
        expect(subject.name).to eq('CP Administrator 00')
        expect(subject.description).to eq('updating full attributes')
      end
    end

    context 'when update attributes but not permission' do
      before do
        subject.update_properties(properties_without_permission)
        subject.save
      end

      it 'should update the role' do
        expect(subject.name).to eq('CP Administrator 01')
        expect(subject.description).to eq('no updating permission')
        expect(subject.permissions.size).to eq(2)
      end
    end

    context 'when update attributes but not module' do
      before do
        subject.update_properties(properties_without_module)
        subject.save
      end

      it 'should update the role' do
        expect(subject.name).to eq('CP Administrator 02')
        expect(subject.description).to eq('no updating module')
        expect(subject.modules).to eq([@module_cp])
      end
    end

    context 'when update attributes but not forms' do
      before do
        subject.update_properties(properties_without_forms)
        subject.save
      end

      it 'should update the role' do
        expect(subject.name).to eq('CP Administrator 03')
        expect(subject.description).to eq('no updating forms')
        expect(subject.form_sections).to eq([@form_section_a])
      end
    end
  end

  describe 'ConfigurationRecord' do
    let(:form1) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
    let(:form2) { FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'x') }
    let(:module1) do
      PrimeroModule.create!(
        unique_id: 'primeromodule-cp-a',
        name: 'CPA',
        description: 'Child Protection A',
        associated_record_types: %w[case tracing_request incident],
        primero_program: PrimeroProgram.new(name: 'program'),
        form_sections: [form1, form2]
      )
    end
    let(:role) do
      Role.create!(
        name: 'Role',
        unique_id: 'role-test',
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        ],
        form_sections: [form1, form2],
        primero_modules: [module1]
      )
    end

    before(:each) do
      clean_data(Role, Field, FormSection, PrimeroModule, PrimeroProgram)
      form1
      form2
      module1
      role
    end

    describe '#configuration_hash' do
      it 'returns a role with permissions, associated forms, and associated modules in a hash' do
        configuration_hash = role.configuration_hash
        expect(configuration_hash['name']).to eq(role.name)
        expect(configuration_hash['permissions'][Permission::CASE]).to eq([Permission::READ])
        expect(configuration_hash['form_section_read_write']).to eq('A' => 'rw', 'B' => 'rw')
        expect(configuration_hash['module_unique_ids']).to eq([module1.unique_id])
      end
    end

    describe '.create_or_update!' do
      it 'creates a new role from a configuration hash' do
        configuration_hash = {
          'unique_id' => 'role-test2',
          'name' => 'Role2',
          'permissions' => { 'case' => ['read'], 'objects' => {} },
          'form_section_read_write' => { A: 'rw', B: 'r' },
          'module_unique_ids' => [module1.unique_id]
        }
        new_role = Role.create_or_update!(configuration_hash)
        expect(new_role.configuration_hash['unique_id']).to eq(configuration_hash['unique_id'])
        expect(new_role.configuration_hash['permissions']['case']).to eq(['read'])
        expect(new_role.configuration_hash['form_section_read_write']).to eq('A' => 'rw', 'B' => 'r')
        expect(new_role.configuration_hash['module_unique_ids']).to eq([module1.unique_id])
        expect(new_role.id).not_to eq(role.id)
      end

      it 'updates an existing form from a configuration hash' do
        configuration_hash = {
          'unique_id' => 'role-test',
          'name' => 'Role',
          'permissions' => { 'case' => %w[read write], 'objects' => {} },
          'form_section_read_write' => { A: 'rw' },
          'module_unique_ids' => [module1.unique_id]
        }

        role2 = Role.create_or_update!(configuration_hash)
        expect(role2.id).to eq(role.id)
        expect(role2.permissions.size).to eq(1)
        expect(role2.permissions[0].actions).to eq(%w[read write])
        expect(role2.form_section_unique_ids).to eq(%w[A])
        expect(role2.form_section_permission).to eq('A' => 'rw')
      end
    end

    describe '#form_section_permission' do
      let(:form1) { FormSection.create!(unique_id: 'F1', name: 'F1', parent_form: 'case', form_group_id: 'm') }
      let(:form2) { FormSection.create!(unique_id: 'F2', name: 'F2', parent_form: 'case', form_group_id: 'n') }
      let(:role) do
        Role.new_with_properties(
          name: 'Role A',
          unique_id: 'role-A',
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::READ]
            )
          ],
          form_section_read_write: { form1.unique_id => 'rw', form2.unique_id => 'rw' }
        )
      end

      before(:each) do
        role.save!
      end
      it 'returns form_section_permission' do
        expect(role.form_section_permission).to eq('F1' => 'rw', 'F2' => 'rw')
      end
    end
  end

  describe 'versioning' do
    before :each do
      clean_data(Field, FormSection, FormPermission, Role, PrimeroModule)
      @form_section1 = FormSection.create(
        unique_id: 'form_section1', parent_form: 'case', name_en: 'form_section1',
        fields: [
          Field.new(name: 'name', type: Field::TEXT_FIELD, display_name_en: 'A'),
          Field.new(name: 'age', type: Field::NUMERIC_FIELD, display_name_en: 'A'),
          Field.new(name: 'sex', type: Field::SELECT_BOX, display_name_en: 'A'),
          Field.new(name: 'national_id_no', type: Field::TEXT_FIELD, display_name_en: 'A'),
          Field.new(name: 'consent_for_services', type: Field::TICK_BOX, display_name_en: 'A'),
          Field.new(name: 'current_address', type: Field::TEXT_AREA, display_name_en: 'A'),
          Field.new(name: 'protection_concerns', type: Field::SELECT_BOX, multi_select: true, display_name_en: 'A'),
          Field.new(name: 'registration_date', type: Field::DATE_FIELD, display_name_en: 'A'),
          Field.new(name: 'created_on', type: Field::DATE_FIELD, date_include_time: true, display_name_en: 'A'),
          Field.new(name: 'separator1', type: Field::SEPARATOR, display_name_en: 'A'),
          Field.new(name: 'other_documents', type: Field::DOCUMENT_UPLOAD_BOX, display_name_en: 'A'),
          Field.new(
            name: 'family_details',
            display_name_en: 'A',
            type: Field::SUBFORM,
            subform: FormSection.new(
              fields: [
                Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
                Field.new(name: 'relation_type', type: Field::SELECT_BOX)
              ]
            )
          )
        ]
      )
      @form_section2 = FormSection.create(
        unique_id: 'form_section2', parent_form: 'case', name_en: 'form_section2',
        fields: [
          Field.new(name: 'interview_date', type: Field::DATE_FIELD, display_name_en: 'A'),
          Field.new(name: 'consent_for_referral', type: Field::TICK_BOX, display_name_en: 'A')
        ]
      )
      @role = Role.create(
        unique_id: 'role_test_01',
        name: 'name_test_01',
        description: 'description_test_01',
        group_permission: 'all',
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
        ],
        form_sections: [@form_section1, @form_section2],
        modules: [
          PrimeroModule.new(
            unique_id: 'primeromodule-cp-a', name: 'CPA', description: 'Child Protection A',
            associated_record_types: %w[case tracing_request incident],
            primero_program: PrimeroProgram.new(name: 'program'),
            form_sections: [@form_section1, @form_section2]
          )
        ]
      )
      @old_version = @role.cache_key_with_version
    end

    let(:new_version) { @role.reload.cache_key_with_version }

    it 'changes the role version every time the role changes' do
      @role.update(name: 'new_name')
      expect(new_version).not_to eq(@old_version)
    end

    it 'changes the role version every time a form section changes visibility' do
      @form_section1.update(visible: false)
      expect(new_version).not_to eq(@old_version)
    end

    describe 'change of fields' do
      it 'changes the role version every time a field is added to a form' do
        @form_section1.fields << Field.new(name: 'foo', type: Field::TEXT_FIELD, display_name_en: 'A')
        expect(new_version).not_to eq(@old_version)
      end

      it 'changes the role version when fields change on a form' do
        @form_section2.fields = [Field.new(name: 'foo', type: Field::TEXT_FIELD, display_name_en: 'A')]
        @form_section2.save
        expect(new_version).not_to eq(@old_version)
      end
    end

    it 'changes the role version when a form is marked as readonly' do
      form_permission = @role.form_permissions.first
      form_permission.permission = FormPermission::PERMISSIONS[:read]
      form_permission.save
      expect(new_version).not_to eq(@old_version)
    end
  end
end
