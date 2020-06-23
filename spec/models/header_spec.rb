# frozen_string_literal: true

require 'rails_helper'

describe Header do
  before :each do
    clean_data(User, Role, PrimeroProgram, FormSection, PrimeroModule, Agency)
    program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )
    form_section = FormSection.create!(
      unique_id: 'test_form',
      name: 'Test Form',
      fields: [
        Field.new(name: 'national_id_no', type: 'text_field', display_name: 'National ID No')
      ]
    )
    cp = PrimeroModule.create!(
      unique_id: PrimeroModule::CP,
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [form_section]
    )
    gbv = PrimeroModule.create!(
      unique_id: PrimeroModule::GBV,
      name: 'GBV',
      description: 'Gender Based Violence',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [form_section]
    )
    mrm = PrimeroModule.create!(
      unique_id: PrimeroModule::MRM,
      name: 'MRM',
      description: '',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [form_section]
    )
    agency = Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    role_cp_worker = Role.create!(
      name: 'Test Role 1', unique_id: 'test-role-1', is_manager: false, modules: [cp],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    role_cp_manager = Role.create!(
      name: 'Test Role 2', unique_id: 'test-role-2', is_manager: true, modules: [cp],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    role_gbv_worker = Role.create!(
      name: 'Test Role 3', unique_id: 'test-role-3', is_manager: false, modules: [gbv],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    role_gbv_manager = Role.create!(
      name: 'Test Role 4', unique_id: 'test-role-4', is_manager: true, modules: [gbv],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    role_mrm_worker = Role.create!(
      name: 'Test Role 5', unique_id: 'test-role-5', is_manager: false, modules: [mrm],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    role_mrm_manager = Role.create!(
      name: 'Test Role 6', unique_id: 'test-role-6', is_manager: true, modules: [mrm],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
    @user_cp_worker = User.create!(
      full_name: 'Test User 1', user_name: 'test_user_1', password: 'b12345678',
      password_confirmation: 'b12345678', email: 'test_user_1@localhost.com', agency_id: agency.id, role: role_cp_worker
    )
    @user_cp_manager = User.create!(
      full_name: 'Test User 2', user_name: 'test_user_2', password: 'b1234567',
      password_confirmation: 'b1234567', email: 'test_user_2@localhost.com', agency_id: agency.id, role: role_cp_manager
    )
    @user_gbv_worker = User.create!(
      full_name: 'Test User 3', user_name: 'test_user_3', password: 'b1234567',
      password_confirmation: 'b1234567', email: 'test_user_3@localhost.com', agency_id: agency.id, role: role_gbv_worker
    )
    @user_gbv_manager = User.create!(
      full_name: 'Test User 4', user_name: 'test_user_4', password: 'b1234567',
      password_confirmation: 'b1234567', email: 'test_user4@localhost.com', agency_id: agency.id, role: role_gbv_manager
    )
    @user_mrm_worker = User.create!(
      full_name: 'Test User 5', user_name: 'test_user_5', password: 'b1234567',
      password_confirmation: 'b1234567', email: 'test_user5@localhost.com', agency_id: agency.id, role: role_mrm_worker
    )
    @user_mrm_manager = User.create!(
      full_name: 'Test User 6', user_name: 'test_user_6', password: 'b1234567',
      password_confirmation: 'b1234567', email: 'test_user6@localhost.com', agency_id: agency.id, role: role_mrm_manager
    )
  end

  it 'Comparing headers of Case' do
    expect(Header.get_headers(@user_cp_worker, 'case')).to eq(
      [
        Header::CASE_ID_DISPLAY, Header::CASE_NAME, Header::AGE, Header::SEX, Header::REGISTRATION_DATE,
        Header::PHOTO, Header::ALERT_COUNT, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_cp_manager, 'case')).to eq(
      [
        Header::CASE_ID_DISPLAY, Header::AGE, Header::SEX, Header::REGISTRATION_DATE, Header::PHOTO,
        Header::SOCIAL_WORKER, Header::ALERT_COUNT, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_gbv_worker, 'case')).to eq(
      [
        Header::CASE_ID_DISPLAY, Header::SURVIVOR_CODE,
        Header::CASE_OPENING_DATE, Header::ALERT_COUNT, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_gbv_manager, 'case')).to eq(
      [
        Header::CASE_ID_DISPLAY, Header::CASE_OPENING_DATE,
        Header::SOCIAL_WORKER, Header::ALERT_COUNT, Header::FLAG_COUNT
      ]
    )
  end

  it 'Comparing headers of Incident' do
    expect(Header.get_headers(@user_cp_worker, 'incident')).to eq(
      [
        Header::SHORT_ID, Header::DATE_OF_INTERVIEW, Header::CP_DATE_OF_INCIDENT,
        Header::CP_VIOLENCE_TYPE, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_cp_manager, 'incident')).to eq(
      [
        Header::SHORT_ID, Header::DATE_OF_INTERVIEW, Header::CP_DATE_OF_INCIDENT,
        Header::CP_VIOLENCE_TYPE, Header::SOCIAL_WORKER, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_gbv_worker, 'incident')).to eq(
      [
        Header::SHORT_ID, Header::SURVIVOR_CODE, Header::DATE_OF_INTERVIEW,
        Header::GBV_DATE_OF_INCIDENT, Header::GBV_VIOLENCE_TYPE, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_gbv_manager, 'incident')).to eq(
      [
        Header::SHORT_ID, Header::DATE_OF_INTERVIEW, Header::GBV_DATE_OF_INCIDENT,
        Header::GBV_VIOLENCE_TYPE, Header::SOCIAL_WORKER, Header::FLAG_COUNT
      ]
    )

    expect(Header.get_headers(@user_mrm_worker, 'incident')).to eq(
      [Header::SHORT_ID, Header::DATE_OF_INCIDENT, Header::INCIDENT_LOCATION, Header::VIOLATIONS, Header::FLAG_COUNT]
    )

    expect(Header.get_headers(@user_mrm_manager, 'incident')).to eq(
      [
        Header::SHORT_ID, Header::DATE_OF_INCIDENT, Header::INCIDENT_LOCATION,
        Header::VIOLATIONS, Header::SOCIAL_WORKER, Header::FLAG_COUNT
      ]
    )
  end

  it 'comparing headers of tracing_request_headers' do
    expect(Header.tracing_request_headers).to eq(
      [
        Header::SHORT_ID, Header::NAME_OF_INQUIRER, Header::DATE_OF_INQUIRY,
        Header::TRACING_REQUESTS, Header::FLAG_COUNT
      ]
    )
  end
end
