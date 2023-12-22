# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Exporters::JsonExporter do
  before :each do
    clean_data(Alert, Child, Family, User, Role, Field, FormSection, PrimeroModule, Referral)

    family = Family.create!(
      data: {
        family_number: 'FA-001',
        family_size: 5,
        family_notes: 'FamilyNotes',
        family_members: [
          { unique_id: '001', relation_name: 'FirstName1 LastName1', relation_age: 10, relation_sex: 'male' },
          { unique_id: '002', relation_name: 'FirstName2 LastName2', relation_age: 12, relation_sex: 'female' }
        ]
      }
    )

    fields = [
      build(:field, name: 'name_first'),
      build(:field, name: 'estimated', type: Field::TICK_BOX)
    ]
    form = create(:form_section, unique_id: 'form_section_exporter', fields:)
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
      order: 7,
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
    primero_module = PrimeroModule.new(name: 'CP')
    primero_module.save(validate: false)
    permissions = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ, Permission::RECEIVE_REFERRAL]
    )
    role = Role.new(
      is_manager: false, modules: [primero_module],
      permissions: [permissions], form_sections: [form, form_family]
    )
    role.save(validate: false)
    role_referral = Role.new(
      unique_id: 'role-referral', is_manager: false, form_sections: [form], modules: [primero_module],
      permissions: [permissions]
    )
    role_referral.save(validate: false)
    @user_referral = User.new(user_name: 'fakerefer', role:)
    @user_referral.save(validate: false)

    @user = User.new(user_name: 'user1', role:)
    @user.save(validate: false)
    @record = Child.new(
      data: {
        name_first: 'Test',
        estimated: false,
        nickname: 'Testy',
        module_id: PrimeroModule::CP,
        family_details_section: [
          { relation_name: 'John', relation: 'father' },
          { relation_name: 'Mary', relation: 'mother' }
        ]
      }
    )
    @record2 = Child.create!(
      family:,
      data: {
        family_member_id: '001',
        family_number: 'CA-001',
        family_size: 0,
        family_notes: 'CaseNotes',
        first_name: 'FirstName1',
        last_name: 'LastName1',
        age: 10,
        sex: 'male',
        family_details_section: [{ unique_id: '002', relation: 'relation2' }]
      }
    )
    Referral.create!(
      transitioned_by: @user.user_name, transitioned_to: @user_referral.user_name, record: @record,
      consent_overridden: true, authorized_role_unique_id: role_referral.unique_id
    )
  end

  let(:data_hash) { JSON.parse(Exporters::JsonExporter.export([@record], nil, { user: @user })) }
  let(:data_hash2) { JSON.parse(Exporters::JsonExporter.export([@record2], nil, { user: @user })) }

  it 'converts models to JSON format' do
    expect(data_hash.size).to eq(1)
    expect(data_hash[0]['id']).to eq(@record.id)
    expect(data_hash[0]['data']['name_first']).to eq('Test')
  end

  it 'handles nested data' do
    expect(data_hash[0]['data']['family_details_section'].size).to eq(2)
    expect(data_hash[0]['data']['family_details_section'][0]['relation_name']).to eq('John')
    expect(data_hash[0]['data']['family_details_section'][0]['relation']).to eq('father')
    expect(data_hash[0]['data']['family_details_section'][1]['relation_name']).to eq('Mary')
    expect(data_hash[0]['data']['family_details_section'][1]['relation']).to eq('mother')
  end

  it 'excludes un-permitted properties' do
    expect(data_hash[0]['data']['nickname']).to be_nil
  end

  it 'handles family linked data' do
    expect(data_hash2[0]['data']['family_number']).to eq('FA-001')
    expect(data_hash2[0]['data']['family_size']).to eq(5)
    expect(data_hash2[0]['data']['family_notes']).to eq('FamilyNotes')
    expect(data_hash2[0]['data']['family_details_section'].size).to eq(1)
    expect(data_hash2[0]['data']['family_details_section'].size).to eq(1)
    expect(data_hash2[0]['data']['family_details_section'][0]['relation_name']).to eq('FirstName2 LastName2')
    expect(data_hash2[0]['data']['family_details_section'][0]['relation']).to eq('relation2')
    expect(data_hash2[0]['data']['family_details_section'][0]['relation_sex']).to eq('female')
    expect(data_hash2[0]['data']['family_details_section'][0]['relation_age']).to eq(12)
  end

  context 'when the user was referred to a record' do
    it 'does not export non permitted fields for a referred record' do
      result = JSON.parse(Exporters::JsonExporter.export([@record], nil, { user: @user_referral }))

      expect(result.size).to eq(1)
      expect(result[0]['id']).to eq(@record.id)
      expect(result[0]['data']).to have_key('name_first')
      expect(result[0]['data']).to have_key('estimated')
      expect(result[0]['data']).not_to have_key('nickname')
      expect(result[0]['data']).not_to have_key('family_details_section')
    end
  end

  after :each do
    clean_data(Alert, User, Role, Field, FormSection, PrimeroModule, Referral)
  end
end
