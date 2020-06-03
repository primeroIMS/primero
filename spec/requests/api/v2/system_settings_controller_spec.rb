require 'rails_helper'

describe Api::V2::SystemSettingsController, type: :request do
  before :each do
    clean_data(Field, FormSection, Agency, PrimeroProgram, PrimeroModule, SystemSettings)
    fields = [
      Field.new(
        name: 'field_name_2',
        type: 'text_field',
        display_name_all: 'Field Name 2',
        hide_on_view_page: false
      )
    ]
    form = FormSection.new(
      unique_id: 'form_section_test_1',
      parent_form: 'case',
      visible: true,
      order_form_group: 51,
      order: 16,
      order_subform: 0,
      editable: true,
      name_all: 'Form Section Test 2',
      description_all: 'Form Section Test 2',
      fields: fields
    )
    form.save!
    @agency_a = Agency.create!(name: 'Agency test', agency_code: 'AAA')
    @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: 'Some program')
    @primero_module = PrimeroModule.create!(
      name: 'CP',
      unique_id: 'primeromodule-cp',
      primero_program_id: @primero_program.id,
      description: 'Child Protection',
      form_section_ids: FormSection.ids,
      associated_record_types: ['case'],
      module_options: {
        use_workflow_service_implemented: true,
        use_workflow_case_plan: true,
        use_workflow_assessment: false,
        reporting_location_filter: true
      }
    )
    @system_settings = SystemSettings.create(
      default_locale: 'en',
      case_code_separator: '-',
      primero_version: '2.0.0',
      age_ranges: {
        'primero' => ['0 - 5', '6 - 11', '12 - 17', '18+'],
        'unhcr' => ['0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+']
       },
      primary_age_range: 'primero',
      location_limit_for_api: 150,
      welcome_email_text: 'Welcome to Primero',
      approvals_labels_en: {
        assessment: 'Assessment',
        case_plan: 'Case Plan',
        closure: 'Closure'
      }
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/system_settings' do
    it 'list system_settings when the param *extended* is not present on the request' do
      login_for_test
      get '/api/v2/system_settings'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(12)
      expect(json['data']['default_locale']).to eq(@system_settings.default_locale)
      expect(json['data']['primero_version']).to eq(@system_settings.primero_version)
    end

    it 'lists system_settings and all agencies and all modules when the param *extended* is true on the request' do
      login_for_test
      get '/api/v2/system_settings?extended=true'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(14)
      expect(json['data']['agencies'][0]['name']).to eq('Agency test')
      expect(json['data']['modules'].size).to eq(1)
      expect(json['data']['modules'][0]['name']).to eq('CP')
    end

    it 'shows workflow statuses if the module option is set' do
      @primero_module.workflow_status_indicator = true
      @primero_module.save

      login_for_test
      get '/api/v2/system_settings?extended=true'

      expect(json['data']['modules'][0]['workflows']['case']['en'].length).to be > 0
    end

  end

  after :each do
    clean_data(Field, FormSection, Agency, PrimeroProgram, PrimeroModule, SystemSettings)
  end

end
