# frozen_string_literal: true

require 'rails_helper'

describe AlertNotifyJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Alert)
    role = create :role
    @owner = create :user, role: role, user_name: 'owner', full_name: 'Owner', email: 'owner@primero.dev'
    @provider = create :user, role: role, user_name: 'provider', full_name: 'Provider', email: 'provider@primero.dev'
    @other = create :user, role: role, user_name: 'other', full_name: 'Other', email: 'other@primero.dev'
    @child = Child.new(
      owned_by: @owner.user_name,
      name: 'child',
      module_id: PrimeroModule::CP,
      case_id_display: '12345',
      consent_for_services: true,
      disclosure_other_orgs: true
    )
    @child.save!
    @child.assigned_user_names = [@provider.user_name]
    @child.save!
    # Force an update on associated_users
    @child.associated_users(true)
  end

  describe 'perform_later' do
    it 'enqueues a job when an alert is created' do
      ActiveJob::Base.queue_adapter = :test
      @child.last_updated_by = @other.user_name
      @child.update_history
      @child.save!
      alert = Alert.new(send_email: true, alert_for: Alertable::FIELD_CHANGE, record: @child, type: 'some_type')
      alert.save!
      alert_notify_jobs = enqueued_jobs.select { |j| j[:job] == AlertNotifyJob }
      expect(alert_notify_jobs.size).to eq(1)
    end
    it 'sends two notifications' do
      @child.last_updated_by = @other.user_name
      @child.update_history
      @child.save!
      alert = Alert.new(send_email: true, alert_for: Alertable::FIELD_CHANGE, record: @child, type: 'some_type')
      alert.save!
      perform_enqueued_jobs(only: AlertNotifyJob)
      expect(ActionMailer::Base.deliveries.size).to eq(2)
    end
    it 'does not send a notification to the person who made the change' do
        @child.last_updated_by = @provider.user_name
        @child.update_history
        @child.save!
        alert = Alert.new(send_email: true, alert_for: Alertable::FIELD_CHANGE, record: @child, type: 'some_type')
        alert.save!
        perform_enqueued_jobs(only: AlertNotifyJob)
        expect(ActionMailer::Base.deliveries.size).to eq(1)
    end
  end

  after :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Alert)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
