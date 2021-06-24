# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::AuditLogsController, type: :request do
  before :each do
    clean_data(User, Agency, Role, AuditLog, SystemSettings)
    SystemSettings.create!(
      default_locale: 'en',
      approvals_labels_en: {
        assessment: 'Assessment',
        case_plan: 'Case Plan',
        closure: 'Closure'
      }
    )
    SystemSettings.current(true)

    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::AUDIT_LOG,
          actions: [Permission::READ]
        )
      ]
    )
    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')

    @user_a = User.create(
      full_name: 'Test User 1',
      user_name: 'test_user_a',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_a@localhost.com',
      agency_id: agency_a.id,
      role: role
    )

    @user_b = User.create(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: 'test_user_2@localhost.com',
      agency_id: agency_a.id,
      role: role
    )

    @audit_log_a = AuditLog.create!(user: @user_a, action: 'login', record_type: 'User', record_id: @user_a.id,
                                    timestamp: '2020-03-02T10:06:50-06:00', metadata: {
                                      mobile_id: 'IMEI1', mobile_number: '123-456-7890'
                                    })
    @audit_log_b = AuditLog.create!(user: @user_b, record_type: 'User', record_id: @user_b.id, timestamp: '2020-03-03T10:07:26-06:00')
    @audit_log_c = AuditLog.create!(user: @user_b, action: 'login', record_type: 'User', record_id: @user_b.id,
                                    timestamp: '2020-03-02T10:06:50-06:00', metadata: {
                                      mobile_id: 'IMEI', mobile_number: '123-456-7890'
                                    })
    @audit_log_d = AuditLog.create!(user: @user_b, action: 'login', record_type: 'User', record_id: @user_b.id,
                                    timestamp: '2020-03-02T10:06:50-06:00', metadata: {
                                      mobile_id: 'IMEI2', mobile_number: '123-424-7890'
                                    })
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/audit_logs' do
    it 'Get a list of all the audit logs' do
      login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::READ])])
      get '/api/v2/audit_logs'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map { |audit| audit['id'] })
        .to match_array([@audit_log_a.id, @audit_log_b.id, @audit_log_c.id, @audit_log_d.id])

      log_a = json['data'].select { |al| al['id'] == @audit_log_a.id }.first
      expect(log_a['action']).to eq('login')
      expect(log_a['log_message']).to eq({ 'prefix' => { 'key' => 'logger.login', 'approval_type' => nil },
                                           'identifier' => "User '#{@user_a.id}'",
                                           'suffix' => { 'key' => 'logger.by_user', 'user' => 'test_user_a' } })
    end

    it 'returns 403 if user is not authorized' do
      login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::WRITE])])
      get '/api/v2/audit_logs'

      expect(response).to have_http_status(403)
      expect(json['errors'].count).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/audit_logs')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'list the audit logs filtering by user_name' do
      login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::READ])])
      get '/api/v2/audit_logs?user_name=test_user_2'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |audit| audit['id'] })
        .to match_array([@audit_log_b.id, @audit_log_c.id, @audit_log_d.id])

      log_c = json['data'].select { |al| al['id'] == @audit_log_c.id }.first
      expect(log_c['action']).to eq('login')
      expect(log_c['log_message']).to eq({ 'prefix' => { 'key' => 'logger.login', 'approval_type' => nil },
                                           'identifier' => "User '#{@user_b.id}'",
                                           'suffix' => { 'key' => 'logger.by_user', 'user' => 'test_user_2' } })
    end

    it 'list the audit logs filtering by timestamp and user_name' do
      login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::READ])])
      get '/api/v2/audit_logs?from=2020-03-02T09:06:50-06:00&to=2020-03-02T11:06:50-06:00&user_name=test_user_2'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map { |audit| audit['id'] }).to match_array([@audit_log_c.id, @audit_log_d.id])
    end

    it 'list the audit logs filtering by timestamp' do
      login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::READ])])
      get '/api/v2/audit_logs?from=2020-03-02T09:06:50-06:00&to=2020-03-02T11:06:50-06:00'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |audit| audit['id'] }).to include(@audit_log_a.id)
      expect(json['data'].map { |audit| audit['id'] }).to include(@audit_log_c.id)
      expect(json['data'].map { |audit| audit['id'] }).to include(@audit_log_d.id)
    end

    context 'when action is an approval' do
      before do
        clean_data(Child)
        @case1 = Child.create!(
          data: { name: 'Test1', age: 5, sex: 'male', urgent_protection_concern: false }
        )
        @audit_log_approval = AuditLog.create!(user: @user_a, record_type: 'Child', record_id: @case1.id,
                                               action: 'assessment_requested', user_id: @user_a.id,
                                               resource_url: 'http://test', timestamp: '2020-03-02T10:06:50-06:00',
                                               metadata: { user_name: @user_a.user_name })
      end

      it 'includes the approval type' do
        login_for_test(permissions: [Permission.new(resource: Permission::AUDIT_LOG, actions: [Permission::READ])])
        get '/api/v2/audit_logs'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(5)
        expect(json['data'].map { |audit| audit['id'] })
          .to match_array([@audit_log_a.id, @audit_log_b.id, @audit_log_c.id, @audit_log_d.id, @audit_log_approval.id])

        log_approval = json['data'].select { |al| al['id'] == @audit_log_approval.id }.first
        expect(log_approval['action']).to eq('assessment_requested')
        expect(log_approval['log_message']).to eq({ 'prefix' => { 'key' => 'logger.assessment_requested',
                                                                  'approval_type' => 'assessment' },
                                                    'identifier' => "Child '#{@case1.display_id}'",
                                                    'suffix' => { 'key' => 'logger.by_user',
                                                                  'user' => 'test_user_a' } })
      end
    end
  end

  describe 'The action message from audit logs' do
    include ActiveJob::TestHelper

    after do
      clear_enqueued_jobs
    end

    let(:audit_params) { enqueued_jobs.first[:args].first }

    it 'Index without parameters' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::READ])])
      get '/api/v2/cases'
      expect(audit_params['resource_url']).to eq('http://www.example.com/api/v2/cases')
      expect(audit_params['action']).to eq('list')
    end

    it 'Destroy without parameters' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )

      delete "/api/v2/users/#{@user_a.id}"
      expect(audit_params['resource_url']).to eq("http://www.example.com/api/v2/users/#{@user_a.id}")
      expect(audit_params['action']).to eq('delete')
    end

    it 'Login action message' do
      params = {
        'user': { 'user_name': @user_a.user_name, 'password': @user_a.password },
        'token': { 'user': { 'user_name': @user_a.user_name, 'password': @user_a.password } }
      }
      post '/api/v2/tokens', params: params
      expect(audit_params['resource_url']).to eq('http://www.example.com/api/v2/tokens')
      expect(audit_params['action']).to eq('login')
    end

    it 'Logout action message' do
      login_for_test(permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::READ])])
      delete '/api/v2/tokens'
      expect(audit_params['resource_url']).to eq('http://www.example.com/api/v2/tokens')
      expect(audit_params['action']).to eq('logout')
    end
  end

  after :each do
    clean_data(Child, User, Agency, Role, AuditLog, SystemSettings)
  end
end
