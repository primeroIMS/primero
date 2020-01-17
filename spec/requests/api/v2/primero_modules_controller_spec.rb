require 'rails_helper'

describe Api::V2::PrimeroModulesController, type: :request do
  before :each do
    clean_data(PrimeroModule, PrimeroProgram, FormSection)
    @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
    @form_section_b = FormSection.create!(unique_id: 'C', name: 'C', parent_form: 'child', form_group_id: 'k')
    @primero_program_a = PrimeroProgram.create!(unique_id: 'primeroprogram1', name: 'Primer1', description: 'Default1')
    @primero_program_b = PrimeroProgram.create!(unique_id: 'primeroprogram2', name: 'Primer2', description: 'Default2')
    @primero_module_a = PrimeroModule.new(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[
        case
        tracing
      ],
      form_sections: [@form_section_a],
      field_map: {
        map_to: 'primeromodule-cp',
        fields: [
          {
            source: %w[
              incident_details
              cp_incident_identification_violence
            ],
            target: 'cp_incident_identification_violence'
          }
        ]
      },
      module_options: {
        workflow_status_indicator: true,
        allow_searchable_ids: true
      },
      primero_program: @primero_program_a
    )
    @primero_module_a.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/primero_modules' do
    it 'list of primero modules' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )

      get '/api/v2/primero_modules'
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /api/v2/primero_modules/:id' do
    it 'fetches the correct primero_module with code 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )

      get "/api/v2/primero_modules/#{@primero_module_a.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(@primero_module_a.unique_id)
      expect(json['data']['form_sections'][0]['unique_id']).to eq(@form_section_a.unique_id)
      expect(json['data']['primero_program']['unique_id']).to eq(@primero_program_a.unique_id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::ROLE, actions: [Permission::READ])]
      )

      get "/api/v2/primero_modules/#{@primero_module_a.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/primero_modules/#{@primero_module_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a primero_module with a non-existant id' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )

      get '/api/v2/primero_modules/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/primero_modules/thisdoesntexist')
    end
  end

  describe 'PATCH /api/v2/primero_modules/:id' do
    it 'updates an existing primero_module with 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )
      params = {
        data: {
          id: 1,
          unique_id: 'primeromodule-cp2',
          primero_program: 'primeroprogram2',
          name: 'CP2',
          description: 'Child Protection2',
          associated_record_types: %w[case1],
          field_map: {
            map_to: 'primeromodule-cp2',
            fields: [
              {
                source: %w[incident_details2 cp_incident_identification_violence2],
                target: 'cp_incident_identification_violence2'
              }
            ]
          },
          form_sections: %w[A C],
          module_options: {
            allow_searchable_ids: false,
            use_workflow_case_plan: false,
            use_workflow_assessment: true
          }
        }
      }

      patch "/api/v2/primero_modules/#{@primero_module_a.id}", params: params
      expect(response).to have_http_status(200)
    end

    it 'updates an non-existing primero_module' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )
      params = {}

      patch '/api/v2/primero_modules/thisdoesntexist', params: params
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/primero_modules/thisdoesntexist')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::ROLE, actions: [Permission::READ])]
      )
      params = {}

      patch "/api/v2/primero_modules/#{@primero_module_a.id}", params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/primero_modules/#{@primero_module_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/primero_modules/:id' do
    it 'successfully deletes a primero_module with a code of 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )

      delete "/api/v2/primero_modules/#{@primero_module_a.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@primero_module_a.id)
      expect(PrimeroModule.find_by(id: @primero_module_a.id)).to be nil
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::ROLE, actions: [Permission::READ])]
      )

      delete "/api/v2/primero_modules/#{@primero_module_a.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/primero_modules/#{@primero_module_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to delete a primero_module with a non-existant id' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::READ])]
      )

      delete '/api/v2/primero_modules/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/primero_modules/thisdoesntexist')
    end
  end

  after :each do
    clean_data(PrimeroModule, PrimeroProgram, FormSection)
  end
end
