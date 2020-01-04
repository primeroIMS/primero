require 'rails_helper'

module Exporters
  describe CSVListViewExporter do
    before :each do
      clean_data(User, Role, Field, PrimeroModule)
      primero_module = PrimeroModule.new(name: 'CP')
      primero_module.save(validate: false)
      permissions = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role = Role.new(is_manager: false, modules: [primero_module], permissions: [permissions])
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role: role)
      @user.save(validate: false)

      Field.new(name: 'name', type: Field::TEXT_FIELD).save(validate: false)
      Field.new(name: 'age', type: Field::NUMERIC_FIELD).save(validate: false)
      Field.new(
        name: 'sex', type: Field::SELECT_BOX,
        option_strings_text_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ]
      ).save(validate: false)

      case1 = Child.new(
        data: {
          name: 'Joe', age: 12, sex: 'male',
          registration_date: Date.new(2020, 1, 1),
          owned_by: @user.user_name }
      )
      case2 = Child.new(
        data: {
          name: 'Mo', age: 14, sex: 'male',
          registration_date: Date.new(2020, 1, 1),
          owned_by: @user.user_name
        }
      )
      @records = [case1, case2]
    end

    it 'converts data to CSV format' do
      data = CSVListViewExporter.export(@records, nil, @user)

      parsed = CSV.parse(data)
      expect(parsed[0][0..4]).to eq ['ID#', 'Name', 'Age', 'Sex', 'Registration Date']
      expect(parsed[1][1..4]).to eq(%w[Joe 12 Male 01-Jan-2020])
      expect(parsed[2][1..4]).to eq(%w[Mo 14 Male 01-Jan-2020])
    end

    after :each do
      clean_data(User, Role, Field, PrimeroModule)
    end
  end
end
