# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::UsersIdentifiedController, type: :request do
  let(:primero_program) do
    PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )
  end

  let(:primero_module) do
    PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program:,
      form_sections: []
    )
  end

  let(:attribute_role) do
    role = Role.new(
      permissions: [
        Permission.new(resource: Permission::CASE, actions: [Permission::ATTRIBUTE])
      ],
      user_category: Role::CATEGORY_IDENTIFIED,
      primero_modules: [primero_module]
    )
    role.save(validate: false)
    role
  end

  let(:agency1) { Agency.create!(unique_id: 'fake-agency', name: 'Fake Agency', agency_code: 'fkagency') }

  let(:group1) { UserGroup.create!(name: 'Group1') }

  let(:user1) do
    user1 = User.new(
      user_name: 'user1', disabled: false, role: attribute_role, agency: agency1, user_groups: [group1],
      full_name: 'User 1 Full Name', email: 'user1@email.com'
    )
    user1.save(validate: false)
  end

  let(:user2) do
    user2 = User.new(
      user_name: 'user2', disabled: false, role: attribute_role, agency: agency1, user_groups: [group1],
      full_name: 'User 2 Full Name', email: 'user2@email.com'
    )
    user2.save(validate: false)
  end

  let(:user3) do
    user3 = User.new(
      user_name: 'user3', disabled: true, role: attribute_role, agency: agency1, user_groups: [group1],
      full_name: 'User 3 Full Name', email: 'user3@email.com'
    )
    user3.save(validate: false)
  end

  before do
    clean_data(UserGroup, User, Agency, Role, PrimeroModule, PrimeroProgram)
    user1
    user2
    user3
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/users/identified' do
    it 'lists the enabled users with the identified user_category' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::ATTRIBUTE])
        ]
      )

      get '/api/v2/users/identified'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data']).to match_array(
        [
          { 'user_name' => 'user1', 'full_name' => 'User 1 Full Name', 'email' => 'user1@email.com' },
          { 'user_name' => 'user2', 'full_name' => 'User 2 Full Name', 'email' => 'user2@email.com' }
        ]
      )
    end
  end
end
