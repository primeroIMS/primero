require 'rails_helper'

describe Api::V2::ReportsController, type: :request do
  before :each do
    [
      PrimeroModule, PrimeroProgram, Report, User,
      Role, Agency, Child, Location, FormSection
    ].each(&:destroy_all)

    SystemSettings.stub(:current).and_return(SystemSettings.new(
      primary_age_range: "primero",
      age_ranges: {
        "primero" => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
        "unhcr" => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
      }
    ))

    Field.create!(
      name: 'owned_by_location',
      type: Field::SELECT_BOX,
      display_name_i18n: {en: 'Owned by location'},
      option_strings_source: 'Location'
    )

    Field.create!(
      name: 'protection_concerns',
      type: Field::SELECT_BOX,
      display_name_i18n: {en: 'Protection Concerns'},
      option_strings_source: 'lookup lookup-protection-concerns',
    )

    @location_0 = Location.create!(
      placename_en: "Country 1",
      location_code:"CN",
      admin_level: 0,
      type: "country",
      hierarchy: "CN"
    )

    @program = PrimeroProgram.create!(
      unique_id: "primeroprogram-primero",
      name: "Primero",
      description: "Default Primero Program"
    )

    @cp = PrimeroModule.create!(
    unique_id: 'primeromodule-cp',
    name: "CP",
    description: "Child Protection",
    associated_record_types: ["case", "tracing_request", "incident"],
    primero_program: @program,
    form_sections: [FormSection.create!(name: 'form_1')]
    )

    @report_1 = Report.create({
      name_en: 'Protection Concerns By Location',
      description_en: '',
      module_id: PrimeroModule::CP,
      record_type: 'case',
      aggregate_by: ['owned_by_location'],
      disaggregate_by: ['protection_concerns'],
      filters: [
        {'attribute' => 'status', 'value' => [Record::STATUS_OPEN]},
        {'attribute' => 'record_state', 'value' => ['true']}
      ],
      editable: false
    })

    @role = Role.create!(
      name: 'Test Role 1',
      unique_id: "test-role-1",
      permissions: [
        Permission.new(
          :resource => Permission::CASE,
          :actions => [Permission::MANAGE]
        )
      ],
      modules: [@cp]
    )
    @agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')

    @test_user_1 = User.create!(
      full_name: "Test User 1",
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: "test_user_1@localhost.com",
      agency_id: @agency_1.id,
      role: @role,
      location: @location_0.location_code
    )

    Sunspot.setup(Child) do
      string 'protection_concerns', multiple: true
    end

    @child_concerns_1 = Child.new_with_user(
      @test_user_1, {
        protection_concerns: ["trafficked_smuggled", "sexually_exploited", "migrant"]
      })

    @child_concerns_1.save!

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v2/reports" do
    it "list the reports" do
      login_for_test({
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::READ])
        ],
        modules: [@cp]
      })

      get '/api/v2/reports'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
    end

    it 'refuses unauthorized access' do
      login_for_test({
        permissions: [],
        modules: [@cp]
      })

      get '/api/v2/reports'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports')
    end
  end

  describe "GET /api/v2/reports/:id", search: true do
    it "fetches the correct report with code 200" do
      login_for_test({
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::READ])
        ],
        modules: [@cp]
      })

      get "/api/v2/reports/#{@report_1.id}"

      report_data = {
        "cn"=> {
          "migrant" => {"_total"=>1},
          "sexually_exploited" => {"_total"=>1},
          "trafficked_smuggled" => {"_total"=>1},
          "_total"=>1
        }
      }

      expect(response).to have_http_status(200)
      expect(json['data']["report_data"]).to eq(report_data)
    end

    it 'refuses unauthorized access' do
      login_for_test

      get "/api/v2/reports/#{@report_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report_1.id}")
    end

    it 'returns a 404 when trying to fetch a report with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::READ])
        ],
        modules: [@cp]
      })
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

      post '/api/v2/reports', params: params

      report_data = {
        'name' => { 'en' => 'Test report', 'fr' => 'Test report in French', 'es' => '' },
        'description' => { 'en' => 'Description', 'fr' => 'Description in French', 'es' => '' },
        'graph' => false, 'graph_type' => 'bar',
        'fields' => [
          {
            'name' => 'protection_concerns', 'display_name' => { 'en' => 'Protection Concerns', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 0 }
          },
          {
            'name' => 'owned_by_location', 'display_name' => { 'en' => 'Owned by location', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 1 }, 'option_strings_source' => 'Location',
            'admin_level' => 0
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

      post '/api/v2/reports', params: params
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_falsey

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )

      get "/api/v2/reports/#{Report.last.id}"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_truthy
    end

    it 'Errors 422 save without aggregate_by, name, module_id and record_type' do
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
            fr: 'Test report in French'
          },
          description: {
            en: 'Description',
            fr: 'Description in French'
          },
          graph: false,
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

      post '/api/v2/reports', params: params

      expect(response).to have_http_status(422)

      expect(json['errors'].count).to eq(4)
      expect(json['errors'].map { |error| error['detail'] }.sort).to eq(%w[aggregate_by module_id name record_type])
      expect(json['errors'].map { |error| error['message'] }.sort).to eq(
        [['Module must not be blank'], ['Name must not be blank'], ["can't be blank"], ["can't be blank"]]
      )
    end

    it 'Errors 422 module_syntax error for module_id' do
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

      post '/api/v2/reports', params: params

      expect(response).to have_http_status(422)

      expect(json['errors'].count).to eq(1)
      expect(json['errors'][0]['detail']).to eq('module_id')
      expect(json['errors'][0]['message']).to eq(['All report modules must already exist'])
    end
  end

  describe 'PATCH /api/v2/reports/:id' do
    it 'updates an non-existing report' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )
      params = {}

      patch '/api/v2/reports/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports/thisdoesntexist')
    end

    it 'refuses unauthorized access' do
      login_for_test
      params = {}

      patch "/api/v2/reports/#{@report_1.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report_1.id}")
    end

    it 'updates an existing report with 200', search: true do
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
          editable: true,
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

      patch "/api/v2/reports/#{@report_1.id}", params: params
      json = JSON.parse(response.body)

      report_data = {
        'id' => @report_1.id,
        'name' => {
          'en' => 'Protection Concerns By Location', 'es' => 'Preocupaciones de protección por ubicación', 'fr' => ''
        },
        'description' => { 'en' => 'Description test', 'es' => 'Prueba de la descripcion', 'fr' => '' },
        'graph' => true,
        'graph_type' => 'bar',
        'fields' => [
          {
            'name' => 'protection_concerns',
            'display_name' => { 'en' => 'Protection Concerns', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'horizontal', 'order' => 0 }
          },
          {
            'name' => 'owned_by_location', 'display_name' => { 'en' => 'Owned by location', 'es' => '', 'fr' => '' },
            'position' => { 'type' => 'vertical', 'order' => 0 }, 'option_strings_source' => 'Location',
            'admin_level' => 0
          }
        ]
      }

      expect(response).to have_http_status(200)
      expect(json['data']).to eq(report_data)
      expect(json['data']['report_data'].present?).to be_falsey

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )

      get "/api/v2/reports/#{@report_1.id}"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(json['data']['report_data'].present?).to be_truthy
    end
  end

  describe 'DELETE /api/v2/reports/:id' do
    it 'delete an non-existing report' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )

      delete '/api/v2/reports/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/reports/thisdoesntexist')
    end

    it 'refuses unauthorized access' do
      login_for_test

      delete "/api/v2/reports/#{@report_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/reports/#{@report_1.id}")
    end

    it 'successfully delete an report with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE])
        ],
        modules: [@cp]
      )

      delete "/api/v2/reports/#{@report_1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@report_1.id)
    end
  end

  after :each do
    [
      PrimeroModule, PrimeroProgram, Report, User,
      Role, Agency, Child, Location, FormSection
    ].each(&:destroy_all)
  end
end
