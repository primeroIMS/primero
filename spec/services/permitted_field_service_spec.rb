# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService, search: true do
  let(:form) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
  let(:field) { Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form.id) }
  let(:role) do
    Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::INCIDENT_FROM_CASE]
        )
      ],
      form_section_read_write: { form.unique_id => 'rw' }
    )
  end
  let(:agency) do
    Agency.create!(
      name: 'Test Agency',
      agency_code: 'TA',
      services: ['Test type']
    )
  end
  let(:user) do
    User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_2@localhost.com',
      agency_id: agency.id,
      role: role,
      services: ['Test type']
    )
  end

  before(:each) do
    clean_data(Agency, Role, User, FormSection, Field)
    form
    field
    role.save!
    agency
    user
  end

  it 'returns the incident_case_id if a user has the incident_from_case permission' do
    permitted_field_names = PermittedFieldService.new(user, Incident).permitted_field_names

    expect(permitted_field_names.include?('incident_case_id')).to be true
  end

  it 'returns the formsection permitted' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names

    expect(permitted_field_names.include?(field.name)).to be true
  end

  it 'returns should include fields for filters' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names

    expect((%w[sex age registration_date] - permitted_field_names).empty?).to be true
  end

  after(:each) { clean_data(Agency, Role, User, FormSection, Field) }
end
