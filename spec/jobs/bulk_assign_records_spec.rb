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

  let(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let(:child2) do
    create(:child, name: 'Test2', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let(:child3) do
    create(:child, name: 'Test2', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  describe 'perform_later' do
    before do
      @bulk_assign_params = {
        records: [child, child2, child3],
        transitioned_to: user2.user_name,
        transitioned_by: user.user_name,
        notes: 'this is a note'
      }
      ActiveJob::Base.queue_adapter = :test
    end

    it 'enqueues a job' do
      expect do
        BulkAssignRecordsJob.perform_later(@bulk_assign_params)
      end.to have_enqueued_job
    end

    it 'creates an AuditLog record' do
      BulkAssignRecordsJob.perform_now(**@bulk_assign_params)
      expect(Assign.count).to eq(3)
      assigns = Transition.all
      expect(assigns.pluck(:type).uniq).to eq(['Assign'])
      expect(assigns.pluck(:record_id)).to match_array([child.id, child2.id, child3.id])
    end
  end

  after :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Transition)
  end
end
