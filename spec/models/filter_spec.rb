# frozen_string_literal: true

require 'rails_helper'

describe Filter do
  before :each do
    clean_data(PrimeroProgram, Field, FormSection, PrimeroModule, Role, Agency, User, SystemSettings)
    @program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )
    @gbv = PrimeroModule.create!(
      unique_id: 'primeromodule-gbv',
      name: 'GBV',
      description: 'Gender Based Violence',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [FormSection.create!(name: 'form_2')]
    )
    @cp = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [FormSection.create!(name: 'form_1')]
    )
    @role_a = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ],
      modules: [@cp]
    )
    @role_b = Role.create!(
      name: 'Test Role 2',
      unique_id: 'test-role-2',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ],
      modules: [@cp, @gbv]
    )
    @agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: @agency_a.id,
      role: @role_a
    )
    @user_b = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: 'test_user_2@localhost.com',
      agency_id: @agency_a.id,
      role: @role_b
    )
    SystemSettings.create!(
      primary_age_range: 'primary',
      age_ranges: { 'primary' => [1..2, 3..4] },
      default_locale: 'en'
    )
    @system_settings = SystemSettings.current
    SystemSettings.current(true)
  end

  it 'filter' do
    filters_cp = %w[case incident tracing_request].map { |record_type| { record_type.pluralize => Filter.filters(@user_a, record_type) } }
    filter_by_date_cp = [
      { id: 'registration_date', display_name: 'Date of Registration' },
      { id: 'assessment_requested_on', display_name: 'Date of Assessment' },
      { id: 'date_case_plan', display_name: 'Date of Case Plan' },
      { id: 'date_closure', display_name: 'Date of Case Closure ' },
      { id: 'created_at', display_name: 'Date of Creation' }
    ]
    expect(filters_cp[0]['cases'][13].options[:en]).to eq(filter_by_date_cp)
    filters_cp_gbv = %w[case incident tracing_request].map { |record_type| { record_type.pluralize => Filter.filters(@user_b, record_type) } }
    filter_by_date_cp_gbv = [
      { id: 'registration_date', display_name: 'Date of Registration' },
      { id: 'assessment_requested_on', display_name: 'Date of Assessment' },
      { id: 'date_case_plan', display_name: 'Date of Case Plan' },
      { id: 'date_closure', display_name: 'Date of Case Closure ' },
      { id: 'created_at', display_name: 'Case Open Date' }
    ]
    expect(filters_cp_gbv[0]['cases'][14].options[:en]).to eq(filter_by_date_cp_gbv)
  end

  it 'approvals.assessment will be present on filters' do
    filters_assessment = %w[case incident tracing_request].map { |record_type| { record_type.pluralize => Filter.filters(@user_a, record_type) } }
    filters_approval_assessment = [
      {id: 'pending', display_name: 'Pending'},
      {id: 'approved', display_name: 'Approved'},
      {id: 'rejected', display_name: 'Rejected'}]
    expect(filters_assessment[0]['cases'][6].options[:en]).to eq(filters_approval_assessment)
  end

  after do
    clean_data(PrimeroProgram, Field, FormSection, PrimeroModule, Role, Agency, User, SystemSettings)
    @system_settings.save!
    SystemSettings.current(true)
  end
end
