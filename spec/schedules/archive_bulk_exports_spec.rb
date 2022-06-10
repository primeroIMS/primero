# frozen_string_literal: true

require 'rails_helper'

describe ArchiveBulkExports do
  before :each do
    clean_data(PrimeroProgram, PrimeroModule, FormSection, Agency, Role, User, BulkExport)
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
    agency = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    role = Role.create!(
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
    @user = User.create!(
      full_name: 'Test User',
      user_name: 'test_user',
      password: '123456789abc',
      password_confirmation: '123456789abc',
      email: 'test_user@localhost.com',
      agency_id: agency.id,
      role: role
    )
    BulkExport.create!(
      status: 'job.status.complete', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: Date.today
    )
    BulkExport.create!(
      status: 'job.status.archived', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: Date.today
    )
    BulkExport.create!(
      status: 'job.status.terminated', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: Date.today
    )
    BulkExport.create!(
      status: 'job.status.processing', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: DateTime.current - 2.months
    )
    BulkExport.create!(
      status: 'job.status.processing', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: DateTime.current - 1.year
    )
    BulkExport.create!(
      status: 'job.status.processing', owned_by: @user.user_name,
      file_name: 'file.csv', format: 'csv', record_type: 'case',
      started_on: DateTime.current - 1.day
    )
  end
  describe '.archive_old_exports' do
    it 'should archive old BulkExport' do
      expect(BulkExport.where(status: 'job.status.archived').count).to eq(1)

      ArchiveBulkExports.new.archive_old_exports

      expect(BulkExport.where(status: 'job.status.archived').count).to eq(3)
    end
  end
  after do
    clean_data(PrimeroProgram, PrimeroModule, FormSection, Agency, Role, User, BulkExport)
  end
end
