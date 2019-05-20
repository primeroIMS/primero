require 'rails_helper'

describe FieldSelectionService do

  let(:permitted_field_names) { %w(sex age protection_concerns) }

  it 'selects all permitted fields' do
    field_names = FieldSelectionService.select_fields_to_show({}, Child, permitted_field_names)
    expect(field_names).to match_array(permitted_field_names)
  end

  it 'selects only permitted requested fields' do
    params = {fields: 'name,sex,age'}
    field_names = FieldSelectionService.select_fields_to_show(params, Child, permitted_field_names)
    expect(field_names).to match_array(%w(sex age))
  end

  it 'selects only the permitted fields when a record summary is requested' do
    params = {fields: 'short'}
    field_names = FieldSelectionService.select_fields_to_show(params, Child, permitted_field_names)
    expect(field_names).to match_array(%w(sex age))
  end

end