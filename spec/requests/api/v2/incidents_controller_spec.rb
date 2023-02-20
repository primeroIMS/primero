# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::IncidentsController, type: :request do
  def mrm_fields
    [
      Field.new(
        name: 'sources',
        display_name_en: 'Sources',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'unique_id', type: Field::TEXT_FIELD),
            Field.new(name: 'source_type', type: Field::SELECT_BOX),
            Field.new(name: 'violations_ids', type: Field::SELECT_BOX, multi_select: true)
          ]
        )
      ),
      Field.new(
        name: 'perpetrators',
        display_name_en: 'Perpetrators',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'unique_id', type: Field::TEXT_FIELD),
            Field.new(name: 'source_type', type: Field::SELECT_BOX),
            Field.new(name: 'violations_ids', type: Field::SELECT_BOX, multi_select: true)
          ]
        )
      ),
      Field.new(
        name: 'individual_victims',
        display_name_en: 'Individual victims',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'unique_id', type: Field::TEXT_FIELD),
            Field.new(name: 'source_type', type: Field::SELECT_BOX),
            Field.new(name: 'violations_ids', type: Field::SELECT_BOX, multi_select: true)
          ]
        )
      ),
      Field.new(
        name: 'abduction',
        display_name_en: 'Abduction',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'unique_id', type: Field::TEXT_FIELD),
            Field.new(name: 'source_type', type: Field::SELECT_BOX),
            Field.new(name: 'violations_ids', type: Field::SELECT_BOX, multi_select: true)
          ]
        )
      )

    ].freeze
  end
  before :each do
    @case1 = Child.create!(data: { name: 'Test1', age: 5, sex: 'male', urgent_protection_concern: false })
    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2' })
    @incident3 = Incident.create!(
      data: { incident_date: Date.new(2018, 3, 1), description: 'Test 3' },
      incident_case_id: @case1.id
    )

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/incidents', search: true do
    it 'lists incidents and accompanying metadata' do
      login_for_test
      get '/api/v2/incidents'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |c| c['description'] }).to include(
        @incident1.description, @incident2.description, @incident3.description
      )
      expect(json['metadata']['total']).to eq(3)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'returns flag_count for the short form ' do
      @incident1.add_flag('This is a flag IN', Date.today, 'faketest')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/incidents?fields=short'

      expect(response).to have_http_status(200)
      incident_data = json['data'].find { |i| i['id'] == @incident1.id }
      expect(incident_data['flag_count']).to eq(1)
    end
  end

  describe 'GET /api/v2/incidents/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/incidents/#{@incident1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)
    end

    it 'fetches the case data from the incident if the user is permitted to see it' do
      login_for_test(
        permissions:
          [
            Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ]),
            Permission.new(resource: Permission::CASE, actions: [Permission::INCIDENT_FROM_CASE])
          ]
      )
      get "/api/v2/incidents/#{@incident3.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['incident_case_id']).to eq(@incident3.incident_case_id)
      expect(json['data']['case_id_display']).to eq(@incident3.case_id_display)
    end

    it 'should not return case data if the incident is not linked to a case' do
      login_for_test(
        permissions:
          [
            Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ]),
            Permission.new(resource: Permission::CASE, actions: [Permission::INCIDENT_FROM_CASE])
          ]
      )
      get "/api/v2/incidents/#{@incident1.id}"

      expect(response).to have_http_status(200)
      expect(json['data'].key?('incident_case_id')).to eq(false)
      expect(json['data'].key?('case_id_display')).to eq(false)
    end
  end

  describe 'POST /api/v2/incidents' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Test' } }
      post '/api/v2/incidents', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['incident_date']).to eq(params[:data][:incident_date])
      expect(json['data']['description']).to eq(params[:data][:description])
      expect(Incident.find_by(id: json['data']['id'])).not_to be_nil
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Test' } }
      post '/api/v2/incidents', params: params, as: :json

      %w[data].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end
    context 'when incident with violation is created ' do
      it 'creates a new record with violation and its association' do
        login_for_test(
          permitted_fields: FakeDeviseLogin::COMMON_PERMITTED_FIELDS + mrm_fields,

          permitted_field_names: (
            common_permitted_field_names +
            %w[
              sources perpetrators individual_victims abduction violation_category
              status incident_title incident_total_tally
            ]
          )
        )
        params = {
          data: {
            status: 'open',
            incident_title: 'random incident',
            violation_category: ['abduction'],
            incident_date: Date.today,
            incident_location: 'code_1000001',
            incident_total_tally: { 'boys' => 1, 'total' => 1 },
            module_id: 'primeromodule-mrm',
            abduction: [
              {
                violation_tally: { 'boys' => 1, 'total' => 1 },
                abduction_purpose_single: 'extortion',
                abduction_crossborder: 'yes',
                verified: 'report_pending_verification',
                ctfmr_verified: 'report_pending_verification',
                unique_id: '4e51ac87-c6aa-4a47-a4ef-1cc7ccfd0118'
              }
            ],
            individual_victims: [
              {
                violations_ids: ['4e51ac87-c6aa-4a47-a4ef-1cc7ccfd0118'],
                individual_sex: 'male',
                individual_age: 1,
                unique_id: '6d417a13-4217-435e-83f0-b8cbcb0c8d36'
              }
            ],
            perpetrators: [
              {
                violations_ids: ['4e51ac87-c6aa-4a47-a4ef-1cc7ccfd0118'],
                perpetrator_number: 1,
                unique_id: '1f01bf92-184a-4b14-8378-5c65c42079d0'
              }
            ],
            sources: [
              { violations_ids: ['4e51ac87-c6aa-4a47-a4ef-1cc7ccfd0118'],
                primary_reporting_organization: 'partner_1',
                source_category: 'primary_victim',
                source_type: 'document_e_g_medical_police_report_judicial_records',
                unique_id: 'cf37b8da-72e6-4de7-8745-c7249b44eaa9' },
              { violations_ids: ['4e51ac87-c6aa-4a47-a4ef-1cc7ccfd0118'],
                primary_reporting_organization: 'partner_2',
                source_category: 'secondary',
                source_type: 'oral_testimony',
                unique_id: '5e584bff-d79b-42d3-8563-2acc97c34172' }
            ]
          }
        }
        post '/api/v2/incidents', params: params, as: :json

        expect(response).to have_http_status(200)
        expect(json['data']['id']).not_to be_empty
        expect(json['data']['sources'].count).to eq(2)
        expect(json['data']['sources'].map { |source| source['unique_id'] }).to match_array(
          params[:data][:sources].map { |source| source[:unique_id] }
        )

        expect(json['data']['abduction'].count).to eq(1)
        expect(json['data']['abduction'][0]['unique_id']).to eq(params[:data][:abduction][0][:unique_id])
        expect(Incident.find_by(id: json['data']['id'])).not_to be_nil
      end
    end
  end

  describe 'PATCH /api/v2/incidents/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Tester' } }
      patch "/api/v2/incidents/#{@incident1.id}", params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)

      incident1 = Incident.find_by(id: @incident1.id)
      expect(incident1.data['incident_date'].iso8601).to eq(params[:data][:incident_date])
      expect(incident1.data['description']).to eq(params[:data][:description])
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Tester' } }
      patch "/api/v2/incidents/#{@incident1.id}", params: params, as: :json

      %w[data].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end
  end

  describe 'DELETE /api/v2/incidents/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::INCIDENT, actions: [Permission::ENABLE_DISABLE_RECORD])]
      )
      delete "/api/v2/incidents/#{@incident1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@incident1.id)

      incident1 = Incident.find_by(id: @incident1.id)
      expect(incident1.record_state).to be false
    end
  end
end
