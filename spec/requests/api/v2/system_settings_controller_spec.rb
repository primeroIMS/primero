require 'rails_helper'

describe Api::V2::SystemSettingsController, type: :request do
  before :each do
    Field.destroy_all
    FormSection.destroy_all
    Agency.destroy_all
    PrimeroProgram.destroy_all
    PrimeroModule.destroy_all
    SystemSettings.destroy_all
    fields = [
        Field.new({name: 'field_name_2',
          type: 'text_field',
          display_name_all: 'Field Name 2',
          hide_on_view_page: false
        })
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
    @primero_module = PrimeroModule.create!(name: 'CP',
      primero_program_id: @primero_program.id,
      description: 'Child Protection',
      form_section_ids: FormSection.ids,
      associated_record_types: ['case']
      )
    @system_settings = SystemSettings.create(default_locale: 'en',
      case_code_separator: '-',
      primero_version: '2.0.0',
      age_ranges: {'primero' => ['0 - 5', '6 - 11', '12 - 17', '18+'], 'unhcr' => ['0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+']},
      primary_age_range: 'primero',
      location_limit_for_api: 150,
      welcome_email_text: 'Welcome to Primero')
  end
 
  let(:json) { JSON.parse(response.body) }
 
  describe "GET /api/v2/system_settings" do
    it 'list system_settings when the param *extended* is not present on the request' do
      login_for_test(permissions: [Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE])])
      get '/api/v2/system_settings'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(11)
      expect(json['data']['default_locale']).to eq(@system_settings.default_locale)
      expect(json['data']['primero_version']).to eq(@system_settings.primero_version)
    end
    it 'list system_settings and all agencies and all modules when the param *extended* is true on the request' do
      login_for_test(permissions: [Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE])])
      get '/api/v2/system_settings?extended=true'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(13)
      expect(json['data']['agencies'][0]['name']).to eq('Agency test')
      expect(json['data']['modules'].size).to eq(1)
      expect(json['data']['modules'][0]['name']).to eq('CP')
    end
    it "returns 403 if user isn't authorized to access" do
      login_for_test
      get '/api/v2/system_settings'
      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

end
