# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe BulkAssignRecordsJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Transition)
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(:user, user_name: 'user', role:, full_name: 'Test User 1', email: 'owner@primero.dev')
  end

  let(:user2) do
    create(:user, user_name: 'user2', role:, full_name: 'Test User 2', email: 'user2@primero.dev')
  end

  let!(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  before :each do
    BulkAssignService.any_instance.stub(:search_results).and_return([child])
  end

  describe 'perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end

    let(:bulk_assign_params) do
      {
        transitioned_to: user2.user_name,
        transitioned_by: user.user_name,
        notes: 'this is a note',
        filters: { short_id: [child.short_id] }
      }
    end

    it 'enqueues a job' do
      expect do
        BulkAssignRecordsJob.perform_later(Child, user, **bulk_assign_params)
      end.to have_enqueued_job
    end
  end

  describe 'when job is performed' do
    let(:bulk_assign_params) do
      {
        transitioned_to: user2.user_name,
        transitioned_by: user.user_name,
        notes: 'this is a note',
        filters: { short_id: [child.short_id] }
      }
    end

    it 'should not enqueue a TransitionNotifyJob' do
      ActiveJob::Base.queue_adapter = :test
      BulkAssignRecordsJob.perform_now(Child, user, **bulk_assign_params)

      expect(
        ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == TransitionNotifyJob }.size
      ).to eq(0)
    end
  end

  after :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Transition)
  end
end
