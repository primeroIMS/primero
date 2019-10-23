require 'rails_helper'

describe FieldSelectionService do

  before :each do
    @user = User.new(user_name: 'user')
    @user.stub(:can_preview?) { true }
  end

  let(:permitted_field_names) { %w(sex age protection_concerns) }

  it 'selects all permitted fields' do
    field_names = FieldSelectionService.select_fields_to_show({}, Child, permitted_field_names, @user)
    expect(field_names).to match_array(permitted_field_names)
  end

  it 'selects only permitted requested fields' do
    params = {fields: 'name,sex,age'}
    field_names = FieldSelectionService.select_fields_to_show(params, Child, permitted_field_names, @user)
    expect(field_names).to match_array(%w(sex age))
  end

  it 'selects only the permitted fields when a record summary is requested' do
    params = {fields: 'short'}
    field_names = FieldSelectionService.select_fields_to_show(params, Child, permitted_field_names, @user)
    expect(field_names).to match_array(%w(sex age))
  end

  describe 'preview' do
    before :each do
      fs = FormSection.new(
        parent_form: 'case',
        fields: [
          Field.new(name: 'field1', show_on_minify_form: true),
          Field.new(name: 'field2', show_on_minify_form: false)
        ]
      )
      fs.save(validate: false)
    end


    it 'selects preview fields when the id search parameter is included and the user is permitted to review' do
      params = { fields: 'short', id_search: true }
      field_names = FieldSelectionService.select_fields_to_show(
        params, Child, permitted_field_names + %w[field1 field2], @user
      )
      expect(field_names).to match_array(%w[sex age field1])
    end

    after :each do
      FormSection.destroy_all
      Field.destroy_all
    end

  end

end