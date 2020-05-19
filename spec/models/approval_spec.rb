# frozen_string_literal: true

require 'rails_helper'

describe Approval do
  before :each do
    SystemSettings.create!(
      approval_forms_to_alert: {
        'cp_bia_form' => 'bia',
        'cp_case_plan' => 'case_plan',
        'closure_form' => 'closure'
      }
    )
    SystemSettings.stub(:current).and_return(SystemSettings.first)
    @program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-test',
      name: 'Primero',
      description: 'Default Primero Program'
    )
    @module = PrimeroModule.create!(
      unique_id: 'test-module',
      name: 'TM',
      description: 'Test module',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
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
      modules: [@module]
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
    @user1 = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user1',
      password: '123456789abc',
      password_confirmation: '123456789abc',
      email: 'test_user1@localhost.com',
      agency_id: agency.id,
      role: role
    )
    @case = Child.create(
      name: 'First Case',
      data: { owned_by: @user.user_name, module_id: @module.unique_id }
    )
  end

  describe 'when performing an approval' do
    context 'and the alert_for is "case_plan"' do
      before do
        @approval = Approval.get!(
          Approval::CASE_PLAN,
          @case,
          @user1.user_name,
          approval_status: Approval::APPROVAL_STATUS_REQUESTED
        )
        @approval.perform!(Approval::APPROVAL_STATUS_REQUESTED)
      end

      it 'should return the correct form for case plan type' do
        expect(Alert.last.form_sidebar_id).to eq('cp_case_plan')
      end

      it 'should delete the alert when the case get successfully requested' do
        expect(Alert.count).to eq(1)
        @approval.perform!(Approval::APPROVAL_STATUS_APPROVED)
        expect(Alert.count).to eq(0)
      end
    end

    context 'and the alert_for is "bia"' do
      before do
        approval = Approval.get!(
          Approval::BIA,
          @case,
          @user1.user_name,
          approval_status: Approval::APPROVAL_STATUS_REQUESTED
        )
        approval.perform!(Approval::APPROVAL_STATUS_REQUESTED)
      end

      it 'should return the correct form for bia type' do
        expect(Alert.last.form_sidebar_id).to eq('cp_bia_form')
      end
    end

    context 'and the alert_for is "closure"' do
      before do
        approval = Approval.get!(
          Approval::CLOSURE,
          @case,
          @user1.user_name,
          approval_status: Approval::APPROVAL_STATUS_REQUESTED
        )
        approval.perform!(Approval::APPROVAL_STATUS_REQUESTED)
      end

      it 'should return the correct form for closure type' do
        expect(Alert.last.form_sidebar_id).to eq('closure_form')
      end
    end
  end

  after :each do
    clean_data(SystemSettings, Role, Agency, User, Child, Alert, PrimeroProgram, PrimeroModule, FormSection)
  end
end
