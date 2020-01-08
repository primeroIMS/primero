require 'rails_helper'

describe Exporters::JSONExporter do

  before :each do
    clean_data(User, Role, Field, FormSection, PrimeroModule)

    fields = [
      build(:field, name: 'name_first'),
      build(:field, name: 'estimated', type: Field::TICK_BOX),
      build(
        :subform_field,
        name: 'family_details_section',
        fields: [
          create(:field, name: 'relation_name'),
          create(:field, name: 'relation')
        ]
      )
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
    @record = Child.new(
      data: {
        name_first: 'Test',
        estimated: false,
        nickname: 'Testy',
        family_details_section: [
          { relation_name: 'John', relation: 'father' },
          { relation_name: 'Mary', relation: 'mother' }
        ]
      }
    )
  end

  let(:data_hash) { JSON.parse(Exporters::JSONExporter.export([@record], @user)) }

  it 'converts models to JSON format' do
    expect(data_hash.size).to eq(1)
    expect(data_hash[0]['id']).to eq(@record.id)
    expect(data_hash[0]['data']['name_first']).to eq('Test')
  end

  it 'handles nested data' do
    expect(data_hash[0]['data']['family_details_section'].size).to eq(2)
    expect(data_hash[0]['data']['family_details_section'][0]['relation_name']).to eq('John')
  end

  it 'excludes un-permitted properties' do
    expect(data_hash[0]['data']['nickname']).to be_nil
  end

  after :each do
    clean_data(User, Role, Field, FormSection, PrimeroModule)
  end
end