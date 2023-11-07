# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe TransitionNotifyJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Transition)
    @primero_module = create(:primero_module, name: 'CP')
    role = create(:role, is_manager: true, modules: [@primero_module])
    @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
    @manager1 = create :user, role:, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
    @manager2 = create :user, role:, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
    @child = child_with_created_by(
      @owner.user_name,
      name: 'child1',
      module_id: PrimeroModule::CP,
      case_id_display: '12345',
      consent_for_services: true,
      disclosure_other_orgs: true
    )
  end

  describe 'perform_later' do
    let(:referral1) do
      Referral.new(transitioned_by: @manager1.user_name, transitioned_to: @manager2.user_name, record: @child)
    end
    before :each do
      referral1.save!
    end

    it 'sends a notification to manager' do
      ActiveJob::Base.queue_adapter = :test

      approval_request_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == TransitionNotifyJob }
      expect(approval_request_jobs.size).to eq(1)
    end
  end

  describe 'when is Assign' do
    let(:user2) do
      create(:user, user_name: 'user2', full_name: 'Test User 1', email: 'user2@primero.dev', receive_webpush: true)
    end

    let(:assign1) do
      Assign.create!(transitioned_by: 'jnelson', transitioned_to_user: user2, record: @child)
    end

    context 'and user has enabled webpush notification' do
      it 'should call RecordActionWebpushNotifier' do
        expect(RecordActionWebpushNotifier).to receive(:transition_notify)
        expect(TransitionNotificationService).to receive(:new).with(assign1.id)

        perform_enqueued_jobs do
          TransitionNotifyJob.perform_later(assign1.id)
        end
      end
    end
  end

  describe 'when is Referral' do
    let(:referral1) do
      Referral.create!(transitioned_by: @manager1.user_name, transitioned_to: @manager2.user_name, record: @child)
    end
    it 'should call RecordActionWebpushNotifier' do
      expect(RecordActionWebpushNotifier).to receive(:transition_notify)
      expect(TransitionNotificationService).to receive(:new).with(referral1.id)

      perform_enqueued_jobs do
        TransitionNotifyJob.perform_later(referral1.id)
      end
    end
  end

  describe 'when is Transfer' do
    let(:role) do
      create(:role, is_manager: true, modules: [@primero_module], group_permission: Permission::ALL)
    end

    let(:user2) do
      create(:user, user_name: 'user2', role:, full_name: 'User 1', email: 'user2@primero.dev', receive_webpush: true)
    end

    let(:transfer1) do
      Transfer.create!(transitioned_by: @manager1.user_name, transitioned_to: user2.user_name, record: @child)
    end

    before(:each) do
      transfer1
    end

    it 'should call RecordActionWebpushNotifier' do
      expect(RecordActionWebpushNotifier).to receive(:transition_notify)
      expect(TransitionNotificationService).to receive(:new).with(transfer1.id)

      perform_enqueued_jobs do
        TransitionNotifyJob.perform_later(transfer1.id)
      end
    end
  end

  after :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Transition)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
