# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::IntakesController, type: :request do
  include ActiveJob::TestHelper

  before do
    clean_data(Alert, Incident, Child, Transition, User, Role, PrimeroModule, Field, FormSection, Agency,
               SystemSettings)
    clear_enqueued_jobs
    clear_performed_jobs
    ActionMailer::Base.deliveries.clear

    @agency = Agency.create!(name: 'Intake Agency', agency_code: 'IA', services: ['intake'])
    @primero_module = PrimeroModule.create!(
      unique_id: PrimeroModule::CP,
      name: 'Child Protection',
      associated_record_types: ['case']
    )
    @form_section = FormSection.create!(
      unique_id: 'intake_identity',
      name: 'Intake Identity',
      parent_form: 'case',
      fields: [
        Field.new(name: 'name', type: Field::TEXT_FIELD, display_name: 'Name'),
        Field.new(name: 'date_of_birth', type: Field::DATE_FIELD, display_name: 'Date of Birth')
      ]
    )
    @role = Role.new_with_properties(
      name: 'Intake Role',
      unique_id: 'intake-role',
      group_permission: Permission::ALL,
      primero_modules: [@primero_module],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])],
      form_section_read_write: { @form_section.unique_id => 'rw' }
    )
    @role.save!
    @primero_module.update!(form_sections: [@form_section], roles: [@role])

    @owner = User.create!(
      full_name: 'Intake Owner',
      user_name: 'intake_owner',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'intake_owner@localhost.com',
      agency: @agency,
      role: @role
    )
    @assignee = User.create!(
      full_name: 'Intake Assignee',
      user_name: 'intake_assignee',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'intake_assignee@localhost.com',
      settings: {
        notifications: {
          send_mail: {
            transition_notification: true
          }
        }
      },
      agency: @agency,
      role: @role
    )
    @system_settings = SystemSettings.create!(
      registration_streams: [
        {
          unique_id: 'intake-stream',
          role: @role.unique_id,
          record_type: 'case',
          module_id: @primero_module.unique_id,
          user: @owner.user_name,
          assigned_user_name: @assignee.user_name,
          notify_assigned_user: true
        }
      ]
    )
    SystemSettings.current(true)
    allow(CaptchaService).to receive(:verify).and_return(true)
  end

  after do
    clear_enqueued_jobs
    clear_performed_jobs
    ActionMailer::Base.deliveries.clear
  end

  let(:json) { JSON.parse(response.body) }
  let(:params) { { data: { name: 'Zoe Smith', captcha_token: 'valid-token' } } }

  describe 'POST /api/v2/intakes/:id' do
    around do |example|
      Rack::Attack.enabled = false
      example.run
    ensure
      Rack::Attack.enabled = true
    end

    it 'creates and assigns a record and enqueues an assignment notification' do
      expect do
        post '/api/v2/intakes/intake-stream', params:, as: :json
      end.to change(Child, :count).by(1)
                                  .and change(Assign, :count).by(1)
                                                             .and have_enqueued_job(TransitionNotifyJob)

      record = Child.find(json.dig('data', 'id'))
      assignment = Assign.find_by!(record:)

      expect(response).to have_http_status(:ok)
      expect(record.status).to eq(Record::STATUS_IDENTIFIED)
      expect(record.owned_by).to eq(@assignee.user_name)
      expect(assignment.transitioned_by).to eq(@owner.user_name)
      expect(assignment.transitioned_to).to eq(@assignee.user_name)
      expect do
        perform_enqueued_jobs(only: TransitionNotifyJob)
      end.to change(ActionMailer::Base.deliveries, :count).by(1)
    end

    it 'does not send an assignment notification when the registration stream disables it' do
      SystemSettings.current.update!(
        registration_streams: [
          {
            unique_id: 'intake-stream',
            role: @role.unique_id,
            record_type: 'case',
            module_id: @primero_module.unique_id,
            user: @owner.user_name,
            assigned_user_name: @assignee.user_name,
            notify_assigned_user: false
          }
        ]
      )
      SystemSettings.current(true)
      post '/api/v2/intakes/intake-stream', params:, as: :json

      expect(response).to have_http_status(:ok)
      expect(enqueued_jobs).not_to include(a_hash_including(job: TransitionNotifyJob))
      expect do
        perform_enqueued_jobs(only: TransitionNotifyJob)
      end.not_to change(ActionMailer::Base.deliveries, :count)
    end

    it 'returns unprocessable entity when the record data is invalid' do
      post '/api/v2/intakes/intake-stream',
           params: { data: { name: 'Zoe Smith', date_of_birth: 'is invalid', captcha_token: 'valid-token' } },
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors'].first['detail']).to eq('date_of_birth')
    end

    it 'returns not found when the registration stream does not exist' do
      post '/api/v2/intakes/unknown-stream', params:, as: :json

      expect(response).to have_http_status(:not_found)
      expect(json['errors'].first['resource']).to eq('/api/v2/intakes/unknown-stream')
    end
  end
end
