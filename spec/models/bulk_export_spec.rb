require 'rails_helper'
require 'sunspot'

describe DuplicateBulkExport, search: true do
  before :each do
    Sunspot.remove_all(Child)
  end

  before do
    UserGroup.all.all.each &:destroy
    User.all.all.each &:destroy
    Role.all.all.each &:destroy
    FormSection.all.all.each &:destroy

    @bulk_exporter = BulkExport.new
    @bulk_exporter.record_type = "case"

    @form_section = create(:form_section,
      unique_id: 'test_form',
      fields: [
        build(:field, name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        build(:field, name: 'case_id', type: 'text_field', display_name: 'Case Id'),
        build(:field, name: 'unhcr_individual_no', type: 'text_field', display_name: 'Unh No'),
        build(:field, name: 'child_name_last_first', type: 'text_field', display_name: 'Name'),
        build(:field, name: 'age', type: 'numeric_field', display_name: 'Age'),
        build(:field, name: 'family_count_no', type: 'numeric_field', display_name: 'Family No'),
      ]
    )

    @group_1 = UserGroup.create!(name: "group 1")

    @user_admin = setup_user(
      form_sections: [@form_section],
      primero_module: {id: PrimeroModule::CP},
      is_manager: true,
      roles: Role.create!(
        name: 'admin_role',
        group_permission: Permission::ALL,
        permissions_list: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [
              Permission::MANAGE
            ]
          )
        ]
      )
    )

    @user_group = setup_user(
      form_sections: [@form_section],
      primero_module: {id: PrimeroModule::CP},
      user_groups: @group_1,
      roles: Role.create!(
        name: 'group_role',
        group_permission: Permission::GROUP,
        permissions_list: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [
              Permission::MANAGE
            ]
          )
        ]
      )
    )

    @user_self = setup_user(
      form_sections: [@form_section],
      primero_module: {id: PrimeroModule::CP},
      user_groups: @group_1,
      roles: Role.create!(
        name: 'self_role',
        group_permission: Permission::SELF,
        permissions_list: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [
              Permission::MANAGE
            ]
          )
        ]
      )
    )

    Sunspot.setup(Child) do
      string 'national_id_no', as: :national_id_no_sci
    end

    Child.refresh_form_properties

    Child.all.all.each &:destroy

    Child.new_with_user_name(@user_admin, { national_id_no: "admin case", age: 5 }).save!
    Child.new_with_user_name(@user_group, { national_id_no: "group case", age: 6 }).save!
    Child.new_with_user_name(@user_self, { national_id_no: "self case", age: 10 }).save!

    Sunspot.commit
  end

  context 'when user is admin' do
    it "export all cases" do
      bulk_export = BulkExport.new(
        owned_by: @user_admin.user_name,
        perrmited_properties: ['national_id_no'],
        record_type: 'case',
        order: {:created_at => :desc}
      )
      bulk_export.process_records_in_batches do |record_batches|
        expect(record_batches.count).to eq(3)
      end
    end
  end

  context 'when user has group permission' do
    it "export cases only in the same group" do
      bulk_export = BulkExport.new(
        owned_by: @user_group.user_name,
        perrmited_properties: ['national_id_no'],
        record_type: 'case',
        order: {:created_at => :desc}
      )
      bulk_export.process_records_in_batches do |record_batches|
        expect(record_batches.count).to eq(2)
      end
    end
  end

  context 'when user has self permission' do
    it "export only its own cases" do
      bulk_export = BulkExport.new(
        owned_by: @user_self.user_name,
        perrmited_properties: ['national_id_no'],
        record_type: 'case',
        order: {:created_at => :desc}
      )
      bulk_export.process_records_in_batches do |record_batches|
        expect(record_batches.count).to eq(1)
      end
    end
  end

end