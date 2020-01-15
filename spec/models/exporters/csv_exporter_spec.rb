require 'rails_helper'

module Exporters
  describe CSVExporter do
    before :each do
      clean_data(User, Role, Field, FormSection, PrimeroModule)

      fields = [
        build(:field, name: 'name', type: Field::TEXT_FIELD),
        build(:field, name: 'age', type: Field::NUMERIC_FIELD),
        build(:field, name: 'sex', type: Field::SELECT_BOX)
      ]
      form = create(:form_section, unique_id: 'form_section_exporter', fields: fields)
      primero_module = PrimeroModule.new(name: 'CP')
      primero_module.save(validate: false)
      permissions = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role = Role.new(
        is_manager: false, modules: [primero_module],
        permissions: [permissions], form_sections: [form])
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role: role)
      @user.save(validate: false)


      case1 = Child.new(data: { name: 'Joe', age: 12, sex: 'male' })
      case2 = Child.new(data: { name: 'Mo', age: 14, sex: 'male' })
      @records = [case1, case2]
    end

    it 'converts data to CSV format' do
      data = CSVExporter.export(@records, @user)

      parsed = CSV.parse(data)
      expect(parsed[0]).to eq %w[id name age sex]
      expect(parsed[1][1..3]).to eq(%w[Joe 12 male])
      expect(parsed[2][1..3]).to eq(%w[Mo 14 male])
    end
  end
end
