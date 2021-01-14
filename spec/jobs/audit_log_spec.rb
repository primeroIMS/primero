# frozen_string_literal: true

require 'rails_helper'

describe AuditLogJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(PrimeroProgram, PrimeroModule, Child, User, Agency, Role, AuditLog, SystemSettings)
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
    @user_a = User.create!(full_name: 'Test User 1', user_name: 'test_user_a', email: 'test_user_a@localhost.com',
                           agency_id: agency_a.id, role: role)

    @child = child_with_created_by(@user_a.user_name, name: 'child1', module_id: PrimeroModule::CP,
                                                      case_id_display: '12345')
  end

  describe 'perform_later' do
    before do
      @audit_log_params = {
        record_type: 'Child',
        record_id: @child.id,
        action: 'assessment_requested',
        user_id: @user_a.id,
        resource_url: 'http://test',
        metadata: { user_name: @user_a.user_name }
      }
    end

    it 'enqueues a job' do
      ActiveJob::Base.queue_adapter = :test
      expect {
        AuditLogJob.perform_later(@audit_log_params)
      }.to have_enqueued_job
    end

    it 'creates an AuditLog record' do
      ActiveJob::Base.queue_adapter = :test
      AuditLogJob.perform_now(@audit_log_params)
      expect(AuditLog.count).to eq(1)
      audit_log = AuditLog.first
      expect(audit_log.record_type).to eq('Child')
      expect(audit_log.record_id).to eq(@child.id)
      expect(audit_log.action).to eq('assessment_requested')
    end
  end

  after :each do
    clean_data(PrimeroProgram, PrimeroModule, Child, User, Agency, Role, AuditLog, SystemSettings)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
