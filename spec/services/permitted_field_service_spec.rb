# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService, search: true do
  before(:each) { clean_data(Agency, Role, User) }
  let(:agency) do
    Agency.create!(
      name: 'Test Agency',
      agency_code: 'TA',
      services: ['Test type']
    )
  end

  let(:role) do
    Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::INCIDENT_FROM_CASE]
        )
      ]
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

  it 'returns the incident_case_id if a user has the incident_from_case permission' do
    permitted_field_names = PermittedFieldService.new(user, Incident).permitted_field_names

    expect(permitted_field_names.include?('incident_case_id')).to be true
  end

  after(:each) { clean_data(Agency, Role, User) }
end
