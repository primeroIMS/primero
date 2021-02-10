# frozen_string_literal: true

require 'rails_helper'

describe ApprovalRequestJob, type: :job do
  include ActiveJob::TestHelper

  before do
    [PrimeroProgram, PrimeroModule, Field, FormSection, Lookup, User, UserGroup, Role, Agency].each(&:destroy_all)
    @lookup = Lookup.create(id: 'lookup-approval-type', name: 'approval type')
    role = create :role, is_manager: true
    @manager1 = create :user, role: role, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
    @manager2 = create :user, role: role, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
    @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
    @child = child_with_created_by(
      @owner.user_name, name: 'child1', module_id: PrimeroModule::CP, case_id_display: '12345'
    )
  end

  describe 'perform_later' do
    it 'sends a notification to manager' do
      ActiveJob::Base.queue_adapter = :test
      ApprovalRequestJob.perform_later(@child.owner.id, @child.id, 'value1')
      approval_request_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == ApprovalRequestJob }
      expect(approval_request_jobs.size).to eq(1)
    end
  end

  after :each do
    clean_data(PrimeroProgram, PrimeroModule, Field, FormSection, Lookup, User, UserGroup, Role, Agency)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
