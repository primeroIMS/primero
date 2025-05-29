# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::ReportsController, type: :request do
  before :each do
    [
      User, Role, PrimeroModule, PrimeroProgram, Report, Agency, Lookup, Child, Location, Field, FormSection
    ].each(&:destroy_all)

    @system_settings = SystemSettings.new(primary_age_range: 'primero',
                                          age_ranges: { 'primero' => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
                                                        'unhcr' => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX] })
    SystemSettings.stub(:current).and_return(@system_settings)

    Lookup.create!(
      unique_id: 'lookup-status',
      name_en: 'status',
      lookup_values_en: [
        { id: 'open', display_text: 'Open' },
        { id: 'closed', display_text: 'Closed' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create!(
      unique_id: 'lookup-proctection-concerns',
      name_en: 'Protection Concerns',
      lookup_values_en: [
        { id: 'trafficked_smuggled', display_text: 'Trafficked Smuggled' },
        { id: 'sexually_exploited', display_text: 'Sexually Exploited' },
        { id: 'migrant', display_text: 'Migrant' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create!(
      unique_id: 'lookup-service-type',
      name_en: 'status',
      lookup_values_en: [
        { id: 'education_formal', display_text: 'Education Formal' }
      ].map(&:with_indifferent_access)
    )

    Field.create!(
      name: 'status', display_name: 'status', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-status'
    )

    Field.create!(
      name: 'protection_concerns',
      display_name: 'Protection Concerns',
      type: Field::SELECT_BOX,
      multi_select: true,
      option_strings_source: 'lookup lookup-proctection-concerns'
    )

    Field.create!(
      name: 'service_type',
      display_name: 'Service Type',
      type: Field::SELECT_BOX,
      option_strings_source: 'lookup lookup-service-type'
    )

    Field.create!(
      name: 'service_implementing_agency',
      display_name: 'Service Implementing Agency',
      type: Field::SELECT_BOX,
      option_strings_source: 'Agency'
    )

    Field.create!(name: 'record_state', display_name: 'record_state', type: Field::TICK_BOX)

    Field.create!(name: 'owned_by_location', type: Field::SELECT_BOX, display_name_i18n: { en: 'Owned by location' },
                  option_strings_source: 'Location')

    @location0 = Location.create!(placename_en: 'Country 1', location_code: 'CN', type: 'country')
    @program = PrimeroProgram.create!(unique_id: 'primeroprogram-primero', name: 'Primero',
                                      description: 'Default Primero Program')
    @cp = PrimeroModule.create!(unique_id: 'primeromodule-cp', name: 'CP', description: 'Child Protection',
                                associated_record_types: %w[case tracing_request incident],
                                primero_program: @program, form_sections: [FormSection.create!(name: 'form_1')])
    @report1 = Report.create(name_en: 'Protection Concerns By Location', description_en: '',
                             module_id: PrimeroModule::CP, record_type: 'case', aggregate_by: ['loc:owned_by_location'],
                             disaggregate_by: ['protection_concerns'],
                             filters: [{ 'attribute' => 'status', 'value' => [Record::STATUS_OPEN] },
                                       { 'attribute' => 'record_state', 'value' => ['true'] }],
                             editable: false)
    @report2 = Report.create(name_en: 'Services report', description_en: '',
                             module_id: PrimeroModule::CP, record_type: 'reportable_service',
                             filters: [
                               { 'attribute' => 'status', 'value' => [Record::STATUS_OPEN] },
                               { 'attribute' => 'record_state', 'value' => ['true'] }
                             ], aggregate_by: ['service_type'], disaggregate_by: ['service_implementing_agency'],
                             editable: false)
    @role = Role.create!(name: 'Test Role 1', unique_id: 'test-role-1',
                         permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])],
                         modules: [@cp])
    @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
    @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2')
    @test_user1 = User.create!(full_name: 'Test User 1', user_name: 'test_user_1', password: 'a12345678',
                               password_confirmation: 'a12345678', email: 'test_user_1@localhost.com',
                               agency_id: @agency1.id, role: @role, location: @location0.location_code)
    @test_user2 = User.create!(full_name: 'Test User 2', user_name: 'test_user_2', password: 'a12345678',
                               password_confirmation: 'a12345678', email: 'test_user_2@localhost.com',
                               agency_id: @agency2.id, role: @role, location: @location0.location_code)

    @child_concerns1 = Child.new_with_user(@test_user1,
                                           protection_concerns: %w[trafficked_smuggled sexually_exploited migrant],
                                           module_id: PrimeroModule::CP,
                                           services_section:
                                           [
                                             {
                                               unique_id: 'f0a0f184-ab1d-4e02-a56b-9e1a1836b903',
                                               service_type: 'education_formal',
                                               service_implemented: 'not_implemented',
                                               service_status_referred: false,
                                               service_appointment_date: '2022-04-07'
                                             }
                                           ])
    @child_concerns1.save!

    @child_concerns2 = Child.new_with_user(@test_user2,
                                           protection_concerns: %w[trafficked_smuggled sexually_exploited migrant],
                                           module_id: PrimeroModule::CP,
                                           services_section:
                                           [
                                             {
                                               unique_id: 'f0a0f184-ab1d-4e02-a56b-9e1a1836b903',
                                               service_type: 'education_formal',
                                               service_implemented: 'not_implemented',
                                               service_status_referred: false,
                                               service_appointment_date: '2022-04-07'
                                             }
                                           ])
    @child_concerns2.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/reports' do
    it 'list the reports' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::READ])],
                     modules: [@cp])

      get '/api/v2/reports'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
    end

    xit 'refuses unauthorized access' do
      login_for_test(permissions: [], modules: [@cp])

      get '/api/v2/reports'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports')
    end
  end

  describe 'GET /api/v2/reports/:id', search: true do
    it 'fetches the correct report with code 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::READ])],
                     modules: [@cp])

      get "/api/v2/reports/#{@report1.id}"

      report_data = {
        'CN' => {
          'migrant' => { '_total' => 2 },
          'sexually_exploited' => { '_total' => 2 },
          'trafficked_smuggled' => { '_total' => 2 },
          '_total' => 6
        }
      }

      expect(response).to have_http_status(200)
      expect(json['data']['report_data']).to eq(report_data)
    end

    it 'fetches the agency based data for the report with code 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::AGENCY_READ])],
                     modules: [@cp], agency_id: @agency2.id)

      get "/api/v2/reports/#{@report1.id}"

      report_data = {
        'CN' => {
          'migrant' => { '_total' => 1 },
          'sexually_exploited' => { '_total' => 1 },
          'trafficked_smuggled' => { '_total' => 1 },
          '_total' => 3
        }
      }

      expect(response).to have_http_status(200)
      expect(json['data']['report_data']).to eq(report_data)
    end

    it 'fetches the agency based data for reportable services with code 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::AGENCY_READ])],
                     modules: [@cp], agency_id: @agency2.id)

      get "/api/v2/reports/#{@report2.id}"

      report_data = { 'education_formal' => { '_total' => 1, 'incomplete_data' => { '_total' => 1 } } }

      expect(response).to have_http_status(200)
      expect(json['data']['report_data']).to eq(report_data)
    end

    it 'refuses unauthorized access' do
      login_for_test

      get "/api/v2/reports/#{@report1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report1.id}")
    end

    it 'returns a 404 when trying to fetch a report with a non-existant id' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::READ])],
                     modules: [@cp])
      get '/api/v2/reports/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/reports', search: true do
    it 'refuses unauthorized access' do
      login_for_test

      post '/api/v2/reports'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports')
    end

    it 'creates a new report and returns 200 and json' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )
      params = {
        data: {
          name: {
            en: 'Test report',
            fr: 'Test report in French'
          },
          description: {
            en: 'Description',
            fr: 'Description in French'
          },
          record_type: 'case',
          module_id: PrimeroModule::CP,
          graph: false,
          disabled: false,
          fields: [
            {
              name: 'owned_by_location',
              position: {
                type: 'horizontal',
                order: 2
              }
            },
            {
              name: 'protection_concerns',
              position: {
                type: 'horizontal',
                order: 1
              }
            }
          ],
          aggregate_counts_from: 'protection_concerns',
          group_ages: false,
          group_dates_by: 'date',
          add_default_filters: true,
          filters: [
            {
              attribute: 'status',
              constraint: '',
              value: [Record::STATUS_OPEN]
            }
          ]
        }
      }

      post('/api/v2/reports', params:)

      report_data = {
        'name' => { 'en' => 'Test report', 'fr' => 'Test report in French', 'es' => '' },
        'description' => { 'en' => 'Description', 'fr' => 'Description in French', 'es' => '' },
        'editable' => true,
        'exclude_empty_rows' => false,
        'disabled' => false,
        'graph' => false,
        'graph_type' => 'bar',
        'group_ages' => false,
        'group_dates_by' => 'date',
        'module_id' => 'primeromodule-cp',
        'record_type' => 'case',
        'fields' => [
          {
            'name' => 'protection_concerns',
            'display_name' => { 'en' => 'Protection Concerns', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 0 },
            'option_labels' => {
              'en' => [
                { 'id' => 'trafficked_smuggled', 'display_text' => 'Trafficked Smuggled' },
                { 'id' => 'sexually_exploited', 'display_text' => 'Sexually Exploited' },
                { 'id' => 'migrant', 'display_text' => 'Migrant' }
              ],
              'es' => [],
              'fr' => []
            }
          },
          {
            'name' => 'owned_by_location', 'display_name' => { 'en' => 'Owned by location', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 1 }, 'option_strings_source' => 'Location'
          }
        ],
        'filters' => [
          {
            'attribute' => 'status',
            'constraint' => '',
            'value' => ['open']
          },
          {
            'attribute' => 'status',
            'value' => ['open']
          },
          {
            'attribute' => 'record_state',
            'value' => ['true']
          }
        ]
      }
      expect(response).to have_http_status(200)
      expect(json['data'].except('id')).to eq(report_data)
    end

    it 'creates a new report and returns 200 and fetch it with the GET' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )
      params = {
        data: {
          name: {
            en: 'Test report',
            fr: 'Test report in French'
          },
          description: {
            en: 'Description',
            fr: 'Description in French'
          },
          record_type: 'case',
          module_id: PrimeroModule::CP,
          fields: [
            {
              name: 'owned_by_location',
              position: {
                type: 'horizontal',
                order: 2
              }
            },
            {
              name: 'protection_concerns',
              position: {
                type: 'horizontal',
                order: 1
              }
            }
          ],
          aggregate_counts_from: 'protection_concerns',
          group_ages: false,
          group_dates_by: 'date',
          add_default_filters: true,
          filters: [
            {
              attribute: 'status',
              constraint: '',
              value: [Record::STATUS_OPEN]
            }
          ]
        }
      }

      post('/api/v2/reports', params:)
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_falsey

      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])

      get "/api/v2/reports/#{Report.last.id}"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_truthy
    end

    it 'Errors 422 save without aggregate_by, name, module_id and record_type' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])
      params = {
        data: {
          name: { fr: 'Test report in French' },
          description: {
            en: 'Description',
            fr: 'Description in French'
          },
          graph: false,
          disabled: false,
          aggregate_counts_from: 'protection_concerns',
          group_ages: false,
          group_dates_by: 'date',
          add_default_filters: true,
          filters: [
            {
              attribute: 'status',
              constraint: '',
              value: [Record::STATUS_OPEN]
            }
          ]
        }
      }

      post('/api/v2/reports', params:)

      expect(response).to have_http_status(422)

      expect(json['errors'].count).to eq(4)
      expect(json['errors'].map { |error| error['detail'] }.sort).to eq(%w[aggregate_by module_id name record_type])
      expect(json['errors'].map { |error| error['message'] }.sort).to eq(
        [['Module must not be blank'], ['Name must not be blank'], ["can't be blank"], ["can't be blank"]]
      )
    end

    it 'Errors 422 module_syntax error for module_id' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])
      params = {
        data: {
          name: {
            en: 'Test',
            fr: 'Test report in French'
          },
          description: {
            en: 'Description',
            fr: 'Description in French'
          },
          record_type: 'case',
          aggregate_counts_from: 'protection_concerns',
          group_ages: false,
          group_dates_by: 'date',
          add_default_filters: true,
          module_id: 'doesnt-exist',
          filters: [
            {
              attribute: 'status',
              constraint: '',
              value: [Record::STATUS_OPEN]
            }
          ],
          fields: [
            {
              name: 'owned_by_location',
              position: {
                type: 'horizontal',
                order: 2
              }
            }
          ]
        }
      }

      post('/api/v2/reports', params:)

      expect(response).to have_http_status(422)

      expect(json['errors'].count).to eq(1)
      expect(json['errors'][0]['detail']).to eq('module_id')
      expect(json['errors'][0]['message']).to eq(['All report modules must already exist'])
    end
  end

  describe 'PATCH /api/v2/reports/:id' do
    it 'updates an non-existing report' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])
      params = {}

      patch('/api/v2/reports/thisdoesntexist', params:)

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports/thisdoesntexist')
    end

    it 'refuses unauthorized access' do
      login_for_test
      params = {}

      patch("/api/v2/reports/#{@report1.id}", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report1.id}")
    end

    it 'updates an existing report with 200', search: true do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])
      params = {
        data: {
          name: {
            en: 'Protection Concerns By Location',
            es: 'Preocupaciones de protección por ubicación'
          },
          description: {
            en: 'Description test',
            es: 'Prueba de la descripcion'
          },
          aggregate_counts_from: 'protection_concerns',
          filters: [{ attribute: 'status', constraint: '', value: [Record::STATUS_OPEN] }],
          group_ages: true,
          group_dates_by: 'year',
          graph: true,
          disabled: false,
          editable: true,
          aggregate_by: %w[loc:owned_by_location],
          fields: [
            {
              name: 'owned_by_location',
              position: {
                type: 'vertical',
                order: 2
              }
            },
            {
              name: 'protection_concerns',
              position: {
                type: 'horizontal',
                order: 1
              }
            }
          ]
        }
      }
      Report.first.update(editable: true)

      patch("/api/v2/reports/#{@report1.id}", params:)
      json = JSON.parse(response.body)

      report_data = {
        'id' => @report1.id,
        'name' => {
          'en' => 'Protection Concerns By Location', 'es' => 'Preocupaciones de protección por ubicación', 'fr' => ''
        },
        'description' => { 'en' => 'Description test', 'es' => 'Prueba de la descripcion', 'fr' => '' },
        'graph' => true,
        'graph_type' => 'bar',
        'editable' => true,
        'exclude_empty_rows' => false,
        'disabled' => false,
        'group_ages' => true,
        'group_dates_by' => 'year',
        'module_id' => 'primeromodule-cp',
        'record_type' => 'case',
        'fields' => [
          {
            'name' => 'protection_concerns',
            'display_name' => { 'en' => 'Protection Concerns', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 0 },
            'option_labels' => {
              'en' => [
                { 'id' => 'trafficked_smuggled', 'display_text' => 'Trafficked Smuggled' },
                { 'id' => 'sexually_exploited', 'display_text' => 'Sexually Exploited' },
                { 'id' => 'migrant', 'display_text' => 'Migrant' }
              ],
              'es' => [],
              'fr' => []
            }
          },
          {
            'name' => 'owned_by_location', 'display_name' => { 'en' => 'Owned by location', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'vertical', 'order' => 0 }, 'option_strings_source' => 'Location'
          }
        ],
        'filters' => [
          {
            'attribute' => 'status',
            'constraint' => '',
            'value' => ['open']
          }
        ]
      }

      expect(response).to have_http_status(200)
      expect(json['data']).to eq(report_data)
      expect(json['data']['report_data'].present?).to be_falsey

      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])

      get "/api/v2/reports/#{@report1.id}"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_truthy
    end
  end

  describe 'DELETE /api/v2/reports/:id' do
    it 'delete an non-existing report' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])

      delete '/api/v2/reports/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports/thisdoesntexist')
    end

    it 'refuses unauthorized access' do
      login_for_test

      delete "/api/v2/reports/#{@report1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report1.id}")
    end

    it 'successfully delete an report with a code of 200' do
      login_for_test(permissions: [Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])],
                     modules: [@cp])

      delete "/api/v2/reports/#{@report1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@report1.id)
    end
  end

  after :each do
    [
      User, Role, PrimeroModule, PrimeroProgram, Report, Agency, Child, Location, Lookup, Field, FormSection
    ].each(&:destroy_all)
  end
end
