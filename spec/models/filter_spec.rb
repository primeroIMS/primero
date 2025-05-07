# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Filter do
  before :each do
    clean_data(User, Agency, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, SystemSettings)
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
      }
    )
    @cp = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [FormSection.create!(name: 'form_1')]
    )
    @mrm = PrimeroModule.create!(
      unique_id: 'primeromodule-mrm',
      name: 'MRM',
      description: 'Child Protection',
      associated_record_types: %w[incident],
      primero_program: @program,
      form_sections: [FormSection.create!(name: 'form_3')]
    )
    @custom_module = PrimeroModule.create!(
      unique_id: 'primeromodule-custom',
      name: 'CUSTOM-MODULE',
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
    @role_c = Role.create!(
      name: 'Test Role 3',
      unique_id: 'test-role-3',
      permissions: [
        Permission.new(resource: Permission::INCIDENT, actions: [Permission::MANAGE])
      ],
      modules: [@mrm]
    )
    @role_d = Role.create!(
      name: 'Test Role 4',
      unique_id: 'test-role-4',
      permissions: [
        Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])
      ],
      modules: [@custom_module]
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
    @user_c = User.create!(
      full_name: 'Test User 3',
      user_name: 'test_user_3',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_3@localhost.com',
      agency_id: @agency_a.id,
      role: @role_c
    )
    @user_d = User.create!(
      full_name: 'Test User 4',
      user_name: 'test_user_4',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_4@localhost.com',
      agency_id: @agency_a.id,
      role: @role_d
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

  shared_examples 'default filters' do
    before do
      @filters_cp = %w[case incident tracing_request].map do |record_type|
        { record_type.pluralize => Filter.filters(user, record_type) }
      end
    end

    it 'returns filters' do
      expect(@filters_cp.count).to eq(3)
    end

    describe 'case filters' do
      it 'has 26 filters' do
        expect(@filters_cp[0]['cases'].count).to eq(26)
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
                                                                   field_name: 'workflow', type: 'workflow'))
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
                                                                   field_name: 'loc:location_current',
                                                                   type: 'multi_select',
                                                                   unique_id: 'location_current'))
      end

      # TODO: test with different reporting location levels
      it 'has reporting location filter' do
        expect(@filters_cp[0]['cases']).to include(have_attributes(name: 'location.base_types.district',
                                                                   field_name: 'loc:owned_by_location2',
                                                                   type: 'multi_select',
                                                                   unique_id: 'reporting_location'))
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
  end

  context 'when CP' do
    it_should_behave_like 'default filters' do
      let(:user) { @user_a }
    end
    # TODO: test incident & tracing_request filters
  end

  context 'when custom module' do
    it_should_behave_like 'default filters' do
      let(:user) { @user_d }
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
      it 'has 28 filters' do
        expect(@filters_cp_gbv[0]['cases'].count).to eq(28)
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

      it 'has age_range filter' do
        expect(@filters_cp_gbv[0]['cases']).to include(have_attributes(name: 'cases.filter_by.age_range',
                                                                       field_name: 'age',
                                                                       type: 'multi_toggle'))
      end

      it 'has date options' do
        filter_by_date_cp = [
          { id: 'registration_date', display_name: 'Date of Registration' },
          { id: 'assessment_requested_on', display_name: 'Date of Assessment' },
          { id: 'date_case_plan', display_name: 'Date of Case Plan' },
          { id: 'date_closure', display_name: 'Date of Case Closure ' },
          { id: 'followup_dates', display_name: 'Date of Follow Up' },
          { id: 'reunification_dates', display_name: 'Date of Reunification' },
          { id: 'tracing_dates', display_name: 'Date of Tracing' },
          { id: 'service_implemented_day_times', display_name: 'Date Service Completed' },
          { id: 'created_at', display_name: 'Case Open Date' }
        ]
        expect(
          @filters_cp_gbv.dig(0, 'cases')
                        .find { |filter| filter.name == 'cases.filter_by.by_date' }
                        .options[:en]
        ).to eq(filter_by_date_cp)
      end
    end
  end

  context 'when MRM' do
    before do
      @filters_mrm = [{ incidents: Filter.filters(@user_c, 'incident') }]
    end

    it 'returns filters' do
      expect(@filters_mrm.count).to eq(1)
    end
    describe 'incident filters' do
      it 'has 29 filters' do
        expect(@filters_mrm.first[:incidents].count).to eq(29)
        expect(@filters_mrm.first[:incidents].map(&:name)).to match_array(
          %w[
            cases.filter_by.flag
            incidents.filter_by.status
            incidents.filter_by.violations
            incidents.filter_by.children
            incidents.filter_by.verification_status
            incidents.filter_by.verified_ghn_reported
            incidents.filter_by.incident_location
            location.base_types.district
            incidents.filter_by.by_date
            incidents.filter_by.perpetrator_category
            incidents.filter_by.armed_force_group_party_name
            cases.filter_by.enabled_disabled
            incidents.filter_by.individual_violations
            incidents.filter_by.individual_age
            incidents.filter_by.individual_sex
            incidents.filter_by.victim_deprived_liberty_security_reasons
            incidents.filter_by.reasons_deprivation_liberty
            incidents.filter_by.victim_facilty_victims_held
            incidents.filter_by.torture_punishment_while_deprivated_liberty
            incidents.filter_by.late_verified_violations
            incidents.filter_by.abduction_purpose_single
            incidents.filter_by.child_role
            incidents.filter_by.facility_attack_type
            incidents.filter_by.facility_impact
            incidents.filter_by.military_use_type
            incidents.filter_by.types_of_aid_disrupted_denial
            incidents.filter_by.weapon_type
            incidents.filter_by.record_owner
            cases.filter_by.agency
          ]
        )
      end

      it 'has status filter' do
        expect(@filters_mrm.first[:incidents]).to include(
          have_attributes(
            name: 'incidents.filter_by.status',
            field_name: 'status',
            type: 'checkbox'
          )
        )
      end

      it 'has violation_category filter' do
        expect(@filters_mrm.first[:incidents]).to include(
          have_attributes(
            name: 'incidents.filter_by.violations',
            field_name: 'violation_category',
            type: 'multi_select'
          )
        )
      end

      it 'has verified_ghn_reported filter' do
        expect(@filters_mrm.first[:incidents]).to include(
          have_attributes(
            name: 'incidents.filter_by.verified_ghn_reported',
            field_name: 'verified_ghn_reported',
            type: 'multi_select',
            option_strings_source: 'lookup-verified-ghn-reported'
          )
        )
      end

      it 'has late_verified_violations filter with one option' do
        late_verified_violations_options = @filters_mrm.first[:incidents].find do |filter|
          filter.field_name == 'has_late_verified_violations'
        end.options[:en]
        expect(late_verified_violations_options.count).to eq(1)
        expect(late_verified_violations_options.first[:display_name]).to eq('Yes')
      end
    end
  end

  after do
    clean_data(User, Agency, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, SystemSettings)
    @system_settings.save!
    SystemSettings.current(true)
  end
end
