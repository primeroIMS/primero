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
      id: 1,
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

  after :each do
    [
      PrimeroModule, PrimeroProgram, Report, User,
      Role, Agency, Child, Location, FormSection
    ].each(&:destroy_all)

  end

end