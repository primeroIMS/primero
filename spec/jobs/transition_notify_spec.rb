# frozen_string_literal: true

require 'rails_helper'

describe TransitionNotifyJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(Role, PrimeroModule, PrimeroProgram, Field, FormSection, User, UserGroup, Agency)
    role = create :role, is_manager: true
    @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
    @manager1 = create :user, role: role, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
    @manager2 = create :user, role: role, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
    @child = child_with_created_by(
      @owner.user_name,
      name: 'child1',
      module_id: PrimeroModule::CP,
      case_id_display: '12345',
      consent_for_services: true,
      disclosure_other_orgs: true
    )
    @referral = Referral.new(
      type: 'Referral',
      transitioned_to: @manager2.user_name,
      transitioned_by: @manager1.user_name
    )
    @referral.record = @child
    @referral.save!
  end

  describe 'perform_later' do
    it 'sends a notification to manager' do
      ActiveJob::Base.queue_adapter = :test

      approval_request_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == TransitionNotifyJob }
      expect(approval_request_jobs.size).to eq(1)
    end
  end

  after :each do
    clean_data(Role, PrimeroModule, PrimeroProgram, Field, FormSection, User, UserGroup, Agency)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
