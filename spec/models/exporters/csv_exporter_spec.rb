# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe CsvExporter do
    before :each do
      clean_data(Child, Family, User, Role, Field, FormSection, PrimeroModule)

      family = Family.create!(
        data: {
          family_members: [
            { unique_id: '001', relation_name: 'George', relation_age: 10, relation_sex: 'male' },
            { unique_id: '002', relation_name: 'FirstName2 LastName2', relation_age: 12, relation_sex: 'female' }
          ]
        }
      )

      fields = [
        build(:field, name: 'name', type: Field::TEXT_FIELD),
        build(:field, name: 'age', type: Field::NUMERIC_FIELD),
        build(:field, name: 'sex', type: Field::SELECT_BOX)
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
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role = Role.new(
        is_manager: false, modules: [primero_module],
        permissions: [permissions], form_sections: [form, form_family]
      )
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role:)
      @user.save(validate: false)

      case1 = Child.new(
        data: {
          name: 'Joe',
          age: 12,
          sex: 'male',
          family_details_section: [
            { relation_name: 'John', relation: 'father' },
            { relation_name: 'Mary', relation: 'mother' }
          ]
        }
      )
      case2 = Child.new(data: { name: 'Mo', age: 14, sex: 'male' })
      @case3 = Child.create!(
        family:,
        data: {
          family_member_id: '001',
          name: 'George',
          age: 10,
          sex: 'male',
          family_details_section: [{ unique_id: '002', relation: 'relation2' }]
        }
      )
      @records = [case1, case2, @case3]
    end

    it 'converts data to CSV format' do
      data = CsvExporter.export(@records, nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[0]).to eq %w[id name age sex family_details_section]
      expect(parsed[1][1..3]).to eq(%w[Joe 12 male])
      expect(parsed[2][1..3]).to eq(%w[Mo 14 male])
      expect(parsed[3][1..3]).to eq(%w[George 10 male])
    end

    it 'export the family_details_section' do
      data = CsvExporter.export(@records, nil, { user: @user })
      parsed = CSV.parse(data)

      expect(parsed[1][4]).to eq(
        '[{"relation_name"=>"John", "relation"=>"father"}, {"relation_name"=>"Mary", "relation"=>"mother"}]'
      )
      expect(parsed[3][4]).to eq(
        '[{"unique_id"=>"002", "relation"=>"relation2", "relation_name"=>"FirstName2 LastName2", ' \
        '"relation_age"=>12, "relation_sex"=>"female"}]'
      )
    end

    it 'sanitizes formula injections' do
      unsafe_record = Child.new(data: { name: 'Joe', age: 12, sex: '=10+10' })
      data = CsvExporter.export([unsafe_record], nil, { user: @user })
      parsed = CSV.parse(data)
      expect(parsed[1][1..3]).to eq(%w[Joe 12 '=10+10])
    end
  end
end
