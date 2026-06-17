# frozen_string_literal: true

require 'rails_helper'

describe BulkFlagRecordsJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Flag)
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, primero_modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(:user, user_name: 'user', role:, full_name: 'Test User 1', email: 'owner@primero.dev')
  end

  let!(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let(:bulk_flag_params) do
    { filters: { 'id' => [child.id] }, message: 'Test flag', date: Date.today.to_s }
  end

  describe 'perform_later' do
    before { ActiveJob::Base.queue_adapter = :test }

    it 'enqueues a BulkFlagRecordsJob on the long_running_process queue' do
      expect do
        BulkFlagRecordsJob.perform_later(Child, user, bulk_flag_params)
      end.to have_enqueued_job(BulkFlagRecordsJob).on_queue('long_running_process')
    end
  end

  describe 'when job is performed' do
    it 'delegates to BulkFlagService#flag_records!' do
      expect_any_instance_of(BulkFlagService).to receive(:flag_records!)
      BulkFlagRecordsJob.perform_now(Child, user, bulk_flag_params)
    end
  end

  after :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Child, Flag)
  end
end
