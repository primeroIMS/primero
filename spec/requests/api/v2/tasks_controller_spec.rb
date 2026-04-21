# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::TasksController, type: :request do
  before :each do
    clean_data(Child, SystemSettings)
    travel_to Time.zone.local(2019, 10, 24, 11, 30, 44)
    @system_settings = SystemSettings.create(due_date_from_appointment_date: true)
    SystemSettings.stub(:current).and_return(SystemSettings.first)
    @case1 = Child.create!(
      data: {
        status: 'open',
        record_state: true,
        owned_by: 'faketest',
        assessment_due_date: Date.yesterday,
        case_plan_due_date: Date.tomorrow,
        followup_subform_section: [{ followup_needed_by_date: 3.days.from_now }],
        services_section: [{
          unique_id: '712d2759-7ec5-4fab-b89b-cfe69dda32ca',
          service_type: 'safehouse_service',
          service_consent: false,
          service_implemented: 'not_implemented',
          service_appointment_date: 7.days.from_now
        }]
      }
    )

    @current_user = User.new(user_name: 'faketest')
    @case1.stub(:owner) { @current_user }
    @case1.owner_fields_for(@current_user)
    @case1.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/tasks' do
    context 'when user has permission' do
      before do
        login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::DASH_TASKS])])
        get '/api/v2/tasks'
      end

      it 'lists tasks' do
        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(4)
      end

      describe 'Assessment task' do
        before do
          @task = json['data'].select { |x| x['type'] == 'assessment' }.first
        end

        it 'is listed' do
          expect(@task).to be
        end

        it 'has a due date' do
          expect(@task['due_date']).to eq(Date.yesterday.strftime('%d-%b-%Y'))
        end

        it 'has a completion field' do
          expect(@task['completion_field']).to eq('assessment_requested_on')
        end
      end

      describe 'Case Plan task' do
        before do
          @task = json['data'].select { |x| x['type'] == 'case_plan' }.first
        end

        it 'is listed' do
          expect(@task).to be
        end

        it 'has a due date' do
          expect(@task['due_date']).to eq(Date.tomorrow.strftime('%d-%b-%Y'))
        end

        it 'has a completion field' do
          expect(@task['completion_field']).to eq('date_case_plan')
        end
      end

      describe 'Follow Up task' do
        before do
          @task = json['data'].select { |x| x['type'] == 'follow_up' }.first
        end

        it 'is listed' do
          expect(@task).to be
        end

        it 'has a due date' do
          expect(@task['due_date']).to eq(3.days.from_now.strftime('%d-%b-%Y'))
        end

        it 'has a completion field' do
          expect(@task['completion_field']).to eq('followup_date')
        end
      end

      describe 'Service task' do
        before do
          @task = json['data'].select { |x| x['type'] == 'service' }.first
        end

        it 'is listed' do
          expect(@task).to be
        end

        it 'has a due date' do
          expect(@task['due_date']).to eq(7.days.from_now.strftime('%d-%b-%Y'))
        end

        it 'has a completion field' do
          expect(@task['completion_field']).to eq('service_implemented_day_time')
        end
      end
    end

    context 'when user does not have permission' do
      before do
        login_for_test(permissions: [])
      end

      it 'refuses unauthorized access' do
        get '/api/v2/tasks'

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq('/api/v2/tasks')
      end
    end
  end

  after :each do
    clean_data(Child)
  end
end
