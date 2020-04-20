# frozen_string_literal: true

require 'rails_helper'

describe RecordHistory do
  before :each do
    clean_data(Agency, Role, User)
    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )
    @agency_a = Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      services: %w[services_a services_b],
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: @agency_a.id,
      role: role
    )
    @record_history = RecordHistory.new(datetime: DateTime.new(2010, 1, 1, 1, 1, 2), user_name: @user_a.user_name)
  end

  context 'Methos from the model' do
    it 'Get the user of a RecordHistory' do
      expect(@record_history.user).to eq(@user_a)
    end

    it 'Get the user_organization of a RecordHistory' do
      expect(@record_history.user_organization).to eq(@agency_a)
    end
  end

  after :each do
    clean_data(Agency, Role, User)
  end
end
