# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe CsvListViewExporter do
    before :each do
      clean_data(User, Role, Field, FormSection, PrimeroModule)

      field = Field.new(
        name: 'sex', display_name: 'Sex', type: Field::SELECT_BOX,
        option_strings_text_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ]
      )
      field.save(validate: false)
      fields = [
        build(:field, name: 'name', type: Field::TEXT_FIELD),
        build(:field, name: 'age', type: Field::NUMERIC_FIELD),
        field
      ]
      form = create(:form_section, unique_id: 'form_section_exporter', fields: fields)
      primero_module = PrimeroModule.new(name: 'CP')
      primero_module.save(validate: false)
      permissions = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role = Role.new(
        is_manager: false, modules: [primero_module],
        permissions: [permissions], form_sections: [form]
      )
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role: role)
      @user.save(validate: false)

      # fields = [
      # Field.new(name: 'name', type: Field::TEXT_FIELD).save(validate: false)
      # Field.new(name: 'age', type: Field::NUMERIC_FIELD).save(validate: false)
      # Field.new(
      #   name: 'sex', type: Field::SELECT_BOX,
      #   option_strings_text_en: [
      #     { id: 'male', display_text: 'Male' },
      #     { id: 'female', display_text: 'Female' }
      #   ]
      # ).save(validate: false)
      # form = create(:form_section, unique_id: 'form_section_exporter', fields: fields)
      case1 = Child.new(
        data: {
          name: 'Joe', age: 12, sex: 'male',
          registration_date: Date.new(2020, 1, 1),
          owned_by: @user.user_name, short_id: '123'
        }
      )
      case2 = Child.new(
        data: {
          name: 'Mo', age: 14, sex: 'male',
          registration_date: Date.new(2020, 1, 1),
          owned_by: @user.user_name, short_id: '456'
        }
      )
      @records = [case1, case2]
    end

    it 'converts data to CSV format' do
      data = CsvListViewExporter.export(@records, @user)

      parsed = CSV.parse(data)
      expect(parsed[0][1..5]).to eq ['ID#', 'Name', 'Age', 'Sex', 'Registration Date']
      expect(parsed[1][1..5]).to eq(%w[123 Joe 12 Male 01-Jan-2020])
      expect(parsed[2][1..5]).to eq(%w[456 Mo 14 Male 01-Jan-2020])
    end

    it 'sanitizes formula injections' do
      unsafe_record = Child.new(data: { name: '=10+10', age: 12, sex: 'male' })
      data = CsvListViewExporter.export([unsafe_record], @user)
      parsed = CSV.parse(data)
      expect(parsed[1][2..4]).to eq(%w['=10+10 12 Male])
    end

    after :each do
      clean_data(User, Role, Field, PrimeroModule)
    end
  end
end
