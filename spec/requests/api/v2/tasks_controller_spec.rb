require 'rails_helper'

describe Api::V2::TasksController, type: :request do
  before :each do
    SystemSettings.all.each &:destroy
    @system_settings = SystemSettings.create(default_locale: "en", due_date_from_appointment_date: true)
    SystemSettings.stub(:current).and_return(SystemSettings.first)
    @case_1 = Child.create!(data: {
      status: 'open',
      record_state: true,
      owned_by: 'faketest',
      services_section: [{
        unique_id: '712d2759-7ec5-4fab-b89b-cfe69dda32ca',
        service_type: 'safehouse_service',
        service_consent: false,
        service_implemented: 'not_implemented',
        service_appointment_date: '2019/08/12'
      }]
    })

    @current_user = User.new(user_name: 'faketest')
    @case_1.stub(:owner){ @current_user }
    @case_1.set_owner_fields_for(@current_user)
    @case_1.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/tasks' do
    it 'list tasks and metadata' do
      login_for_test(permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::DASH_TASKS]
        )]
      )

      get '/api/v2/tasks'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
    end


    it 'refuses unauthorized access' do
      login_for_test(permissions: [])
      get '/api/v2/tasks'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/tasks')
    end
  end

  after :each do
    Child.destroy_all
  end
end