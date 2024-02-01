# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

module Exporters
  describe CsvExporter do
    before :each do
      clean_data(Alert, Child, Family, User, UserGroup, Agency, Role, Field, FormSection, PrimeroModule, Referral)

      family = Family.create!(
        data: {
          family_number: 'FA-001',
          family_size: 5,
          family_notes: 'FamilyNotes',
          family_members: [
            { unique_id: '001', relation_name: 'George', relation_age: 10, relation_sex: 'male' },
            { unique_id: '002', relation_name: 'FirstName2 LastName2', relation_age: 12, relation_sex: 'female' }
          ]
        }
      )

      form_name = create(:form_section, unique_id: 'form_section_name', fields:
        [
          build(:field, name: 'name', type: Field::TEXT_FIELD)
        ], order: 1)

      form_age_sex = create(:form_section, unique_id: 'form_section_age_sex', fields:
        [
          build(:field, name: 'age', type: Field::NUMERIC_FIELD),
          build(:field, name: 'sex', type: Field::SELECT_BOX)
        ], order: 3)

      form_basic = FormSection.new(
        unique_id: 'form_basic',
        name: 'Form Basic',
        parent_form: 'case',
        visible: true,
        form_group_id: 'basic_1',
        order: 2,
        fields: [build(:field, name: 'address', type: Field::TEXT_FIELD)]
      )
      form_basic.save!

      family_details_section = FormSection.new(
        unique_id: 'family_details_section',
        name: 'Nested Family Details',
        parent_form: 'case',
        visible: true,
        is_nested: true,
        fields: [
          Field.new(name: 'relation_name', display_name: 'Name', type: 'text_field', visible: true),
          Field.new(name: 'relation_age', display_name: 'Age', type: 'numeric_field', visible: true),
          Field.new(name: 'relation_sex', display_name: 'Sex', type: 'text_field', visible: true),
          Field.new(name: 'relation', display_name: 'Relation', type: 'text_field', visible: true)
        ]
      )
      family_details_section.save!

      form_family = FormSection.new(
        unique_id: 'family_details',
        name: 'Family Details',
        parent_form: 'case',
        visible: true,
        form_group_id: 'case_form_1',
        order: 4,
        fields: [
          Field.new(name: 'family_number', display_name: 'Family Number', type: 'text_field', visible: true),
          Field.new(name: 'family_size', display_name: 'Family Size', type: 'numeric_field', visible: true),
          Field.new(name: 'family_notes', display_name: 'Family Notes', type: 'text_field', visible: true),
          Field.new(
            name: 'family_details_section',
            display_name_en: 'Family Details',
            type: 'subform',
            editable: true,
            subform_section_id: family_details_section.id,
            visible: true
          )
        ]
      )
      form_family.save!

      primero_module = PrimeroModule.new(unique_id: PrimeroModule::CP, name: 'CP')
      primero_module.save(validate: false)
      permissions = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ, Permission::RECEIVE_REFERRAL]
      )
      role = Role.new(
        is_manager: false, modules: [primero_module],
        permissions: [permissions], form_sections: [form_basic, form_family, form_name, form_age_sex]
      )
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role:)
      @user.save(validate: false)

      role_referral = Role.new(
        unique_id: 'role-referral', is_manager: false, form_sections: [form_name, form_age_sex],
        modules: [primero_module], permissions: [permissions]
      )
      role_referral.save(validate: false)
      @user_referral = User.new(user_name: 'fakerefer', role:)
      @user_referral.save(validate: false)

      case1 = Child.create!(
        data: {
          name: 'Joe',
          age: 12,
          sex: 'male',
          address: 'case_1_address',
          module_id: PrimeroModule::CP,
          family_details_section: [
            { unique_id: '004', relation_name: 'John', relation: 'father' },
            { unique_id: '005', relation_name: 'Mary', relation: 'mother' }
          ]
        }
      )
      case2 = Child.create!(data: { name: 'Mo', age: 14, sex: 'male', address: 'case_2_address' })
      @case3 = Child.create!(
        family:,
        data: {
          family_member_id: '001',
          family_number: 'CA-001',
          name: 'George',
          age: 10,
          sex: 'male',
          address: 'case_3_address',
          family_details_section: [{ unique_id: '002', relation: 'relation2' }]
        }
      )

      Referral.create!(
        transitioned_by: @user.user_name, transitioned_to: @user_referral.user_name, record: case1,
        consent_overridden: true, authorized_role_unique_id: role_referral.unique_id
      )

      @records = [case1, case2, @case3]
    end

    it 'converts data to CSV format' do
      data = CsvExporter.export(@records, nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[0]).to eq %w[id name address age sex family_number family_size family_notes family_details_section]
      expect(parsed[1][1..4]).to eq(%w[Joe case_1_address 12 male])
      expect(parsed[2][1..4]).to eq(%w[Mo case_2_address 14 male])
      expect(parsed[3][1..4]).to eq(%w[George case_3_address 10 male])
    end

    it 'exports the family_details_section' do
      data = CsvExporter.export(@records, nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[1][8]).to eq(
        '[{"unique_id"=>"004", "relation_name"=>"John", "relation"=>"father"}, ' \
        '{"unique_id"=>"005", "relation_name"=>"Mary", "relation"=>"mother"}]'
      )
      expect(parsed[3][8]).to eq(
        '[{"unique_id"=>"002", "relation"=>"relation2", "relation_name"=>"FirstName2 LastName2", ' \
        '"relation_age"=>12, "relation_sex"=>"female"}]'
      )
    end

    it 'exports the global family fields from the family record' do
      data = CsvExporter.export(@records, nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[0]).to eq %w[id name address age sex family_number family_size family_notes family_details_section]
      expect(parsed[3][5..7]).to eq(%w[FA-001 5 FamilyNotes])
    end

    it 'sanitizes formula injections' do
      unsafe_record = Child.new(data: { name: 'Joe', age: 12, sex: '=10+10' })
      data = CsvExporter.export([unsafe_record], nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[1][1..4]).to eq(['Joe', nil, '12', "'=10+10"])
    end

    context 'when the user was referred to a record' do
      it 'does not export non permitted fields for a referred record' do
        data = CsvExporter.export(@records, nil, { user: @user_referral })
        parsed = CSV.parse(data)

        expect(parsed[0]).to eq %w[id name address age sex family_number family_size family_notes family_details_section]
        expect(parsed[1][1..4]).to eq(['Joe', nil, '12', 'male'])
        expect(parsed[1][7]).to be_nil
        expect(parsed[2][1..4]).to eq(%w[Mo case_2_address 14 male])
        expect(parsed[3][1..4]).to eq(%w[George case_3_address 10 male])
        expect(parsed[3][7]).to be_present
      end

      context 'when is a single record is exported' do
        it 'exports the permitted fields for a referred record' do
          data = CsvExporter.export([@records.first], nil, { user: @user_referral, single_record_export: true })
          parsed = CSV.parse(data)

          expect(parsed[0]).to eq %w[id name age sex]
          expect(parsed[1][1..3]).to eq(%w[Joe 12 male])
        end
      end
    end

    after :each do
      clean_data(Alert, Child, Family, User, UserGroup, Agency, Role, Field, FormSection, PrimeroModule, Referral)
    end
  end
end
