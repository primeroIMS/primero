# frozen_string_literal: true

require 'rails_helper'

describe Filter do
  before :each do
    clean_data(PrimeroProgram, Field, FormSection, PrimeroModule, Role, Agency, User, UserGroup, SystemSettings)
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
      form_sections: [FormSection.create!(name: 'form_2')],
      module_options: {
        user_group_filter: true
      },
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
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])],
      modules: [@cp]
    )
    @role_b = Role.create!(
      name: 'Test Role 2',
      unique_id: 'test-role-2',
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])],
      modules: [@cp, @gbv]
    )
    @agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @group1 = UserGroup.create!(name: 'Group1')
    @group2 = UserGroup.create!(name: 'Group2')
    @group3 = UserGroup.create!(name: 'Group3')
    @group4 = UserGroup.create!(name: 'Group4')
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
      default_locale: 'en',
      reporting_location_config: { field_key: 'owned_by_location', admin_level: 2,
                                   admin_level_map: { '1' => ['region'], '2' => ['district'] } }
    )
    @system_settings = SystemSettings.current
    SystemSettings.current(true)
  end

  context 'when CP' do
    before do
      @filters_cp = %w[case incident tracing_request].map do |record_type|
        { record_type.pluralize => Filter.filters(@user_a, record_type) }
      end
    end

    it 'returns filters' do
      expect(@filters_cp.count).to eq(3)
    end

    describe 'case filters' do
      it 'has 17 filters' do
        expect(@filters_cp[0]['cases'].count).to eq(17)
      end

      it 'has filters' do
        expect(@filters_cp[0]['cases'].first).to be_a(Filter)
      end

      it 'has flag filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.flag', field_name: 'flagged',
                                                                   type: 'toggle'))
      end

      it 'has my cases filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.my_cases',
                                                                   field_name: 'my_cases', type: 'checkbox'))
      end

      it 'has workflow filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.workflow',
                                                                   field_name: 'workflow', type: 'multi_toggle'))
      end

      it 'has status filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.status',
                                                                   field_name: 'status', type: 'checkbox'))
      end

      it 'has age filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.age_range', field_name: 'age',
                                                                   type: 'multi_toggle'))
      end

      it 'has sex filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.sex', field_name: 'sex',
                                                                   type: 'checkbox'))
      end

      it 'has approvals assessment' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'approvals.assessment',
                                                                   field_name: 'approval_status_assessment',
                                                                   type: 'multi_toggle'))
      end

      it 'has risk level filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.risk_level',
                                                                   field_name: 'risk_level', type: 'chips'))
      end

      it 'has current location filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.current_location',
                                                                   field_name: 'location_current',
                                                                   type: 'multi_select'))
      end

      # TODO: test with different reporting location levels
      it 'has reporting location filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'location.base_types.district',
                                                                   field_name: 'owned_by_location2',
                                                                   type: 'multi_select'))
      end

      it 'has No Activity filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.no_activity',
                                                                   field_name: 'last_updated_at', type: 'checkbox'))
      end

      it 'has date filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.by_date',
                                                                   field_name: 'cases_by_date', type: 'dates'))
      end

      it 'has record state filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'cases.filter_by.enabled_disabled',
                                                                   field_name: 'record_state', type: 'multi_toggle'))
      end
    end

    # TODO: test incident & tracing_request filters
  end

  context 'when CP and GBV' do
    before do
      @filters_cp_gbv = %w[case incident tracing_request].map do |record_type|
        { record_type.pluralize => Filter.filters(@user_b, record_type) }
      end
    end

    it 'returns filters' do
      expect(@filters_cp_gbv.count).to eq(3)
    end

    describe 'case filters' do
      it 'has 19 filters' do
        expect(@filters_cp_gbv[0]['cases'].count).to eq(19)
      end

      it 'has filters' do
        expect(@filters_cp_gbv[0]['cases'].first).to be_a(Filter)
      end

      it 'has sex filter' do
        expect(@filters_cp_gbv[0]['cases']).to include(have_attributes(name: 'cases.filter_by.sex', field_name: 'sex',
                                                                       type: 'checkbox'))
      end

      it 'has agency office filter' do
        expect(@filters_cp_gbv[0]['cases']).to include(have_attributes(name: 'user.agency_office',
                                                                       field_name: 'owned_by_agency_office',
                                                                       type: 'checkbox'))
      end

      it 'has date filter' do
        expect(@filters_cp_gbv[0]['cases']).to include(have_attributes(name: 'cases.filter_by.by_date',
                                                                       field_name: 'cases_by_date',
                                                                       type: 'dates'))
      end

      it 'has user_group filter' do
        expect(@filters_cp_gbv[0]['cases']).to include(have_attributes(name: 'permissions.permission.user_group',
                                                                       field_name: 'owned_by_groups',
                                                                       type: 'checkbox'))
      end

      it 'has date options' do
        filter_by_date_cp = [
          { id: 'registration_date', display_name: 'Date of Registration' },
          { id: 'assessment_requested_on', display_name: 'Date of Assessment' },
          { id: 'date_case_plan', display_name: 'Date of Case Plan' },
          { id: 'date_closure', display_name: 'Date of Case Closure ' },
          { id: 'created_at', display_name: 'Case Open Date' }
        ]
        expect(
          @filters_cp_gbv.dig(0, 'cases')
                        .find { |filter| filter.name == 'cases.filter_by.by_date' }
                        .options[:en]).to eq(filter_by_date_cp)
      end
    end
  end

  after do
    clean_data(PrimeroProgram, Field, FormSection, PrimeroModule, Role, Agency, User, UserGroup, SystemSettings)
    @system_settings.save!
    SystemSettings.current(true)
  end
end
