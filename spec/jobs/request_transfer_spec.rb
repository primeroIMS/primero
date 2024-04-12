# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RequestTransferJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Transition)
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(:user, user_name: 'user', role:, full_name: 'Test User 1', email: 'owner@primero.dev', receive_webpush: true)
  end

  let(:user2) do
    create(:user, user_name: 'user2', role:, full_name: 'Test User 2',
                  email: 'user2@primero.dev', receive_webpush: true)
  end

  let(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  describe 'perform_later' do
    before(:each) do
      TransferRequest.create!(
        transitioned_by: user2.user_name,
        consent_individual_transfer: true,
        transitioned_to: child.owned_by,
        notes: 'Random note', record: child
      )
    end

    it 'sends a notification to manager' do
      ActiveJob::Base.queue_adapter = :test

      request_transfer_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs.select { |j| j[:job] == RequestTransferJob }
      expect(request_transfer_jobs.size).to eq(1)
    end
  end

  after(:each) do
    clean_data(Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Transition)
  end
end
