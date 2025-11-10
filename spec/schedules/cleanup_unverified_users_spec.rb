# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe CleanupUnverifiedUsers do
  before :each do
    clean_data(User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, Child)

    program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-test',
      name: 'Primero',
      description: 'Default Primero Program'
    )

    primero_module = PrimeroModule.create!(
      unique_id: 'test-module',
      name: 'TM',
      description: 'Test module',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [FormSection.create!(name: 'test_1')]
    )

    @agency = Agency.create!(name: 'Agency 1', agency_code: 'agency1')

    @role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ],
      modules: [primero_module]
    )
  end

  describe '.perform_job?' do
    context 'when self registration is enabled' do
      before do
        allow(Primero::Application.config).to receive(:allow_self_registration).and_return(true)
        allow(Primero::Application.config).to receive(:unverified_users_retention_days).and_return(30)
      end

      it 'returns true' do
        expect(CleanupUnverifiedUsers.perform_job?).to be true
      end
    end

    context 'when self registration is disabled' do
      before do
        allow(Primero::Application.config).to receive(:allow_self_registration).and_return(false)
      end

      it 'returns false' do
        expect(CleanupUnverifiedUsers.perform_job?).to be false
      end
    end
  end

  describe '#perform_rescheduled' do
    let(:cleanup_job) { CleanupUnverifiedUsers.new }

    context 'with default system settings' do
      before do
        allow(Primero::Application.config).to receive(:unverified_users_retention_days).and_return(30)
      end

      it 'calls delete_unverified_older_than with 30 days default' do
        expect(User).to receive(:delete_unverified_older_than).with(30)
        cleanup_job.perform_rescheduled
      end

      it 'logs the cleanup process' do
        allow(User).to receive(:delete_unverified_older_than)
        expect(Rails.logger).to receive(:info).with('Cleaning up unverified Users...')
        cleanup_job.perform_rescheduled
      end
    end
  end

  after do
    clean_data(User, Agency, Role, PrimeroModule, PrimeroProgram, FormSection, Child)
  end
end
