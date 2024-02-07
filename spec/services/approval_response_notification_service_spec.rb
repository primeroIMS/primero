# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ApprovalResponseNotificationService do
  before do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      User, Agency, Role, Child, Transition, Lookup
    )

    Lookup.create!(
      unique_id: 'lookup-approval-type',
      name: 'approval type',
      lookup_values_en: [{ 'id' => 'value1', 'display_text' => 'Value 1' }]
    )
  end

  let(:role) do
    create(:role, is_manager: true)
  end

  let(:user) do
    create :user, user_name: 'user', full_name: 'Test User 1', email: 'owner@primero.dev'
  end

  let(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, conssent_for_services: true, disclosure_other_orgs: true)
  end

  let(:manager) do
    create(:user, role:, email: 'manager@primero.dev', user_name: 'manager', receive_webpush: true, locale: :es)
  end

  subject do
    ApprovalResponseNotificationService.new(child.id, 'value1', manager.user_name, true)
  end

  describe '.locale' do
    it 'return manager locale' do
      expect(subject.locale).to eq(user.locale)
    end
  end

  describe '.manager' do
    it 'return manager' do
      expect(subject.manager.user_name).to eq(manager.user_name)
    end
  end

  describe '.child' do
    it 'return child' do
      expect(subject.child.short_id).to eq(child.short_id)
    end
  end

  describe '.approval_type' do
    it 'return approval_type' do
      expect(subject.approval_type).to eq('Value 1')
    end
  end

  describe '.send_notification?' do
    it 'return true if notification can be send' do
      expect(subject.send_notification?).to be true
    end
  end

  describe '.subject' do
    it 'return child' do
      expect(subject.subject).to eq("Case: #{child.short_id} - Approval Response")
    end
  end

  describe '.key' do
    it 'return approval_response' do
      expect(subject.key).to eq('approval_response')
    end
  end

  after do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      User, Agency, Role, Child, Transition, Lookup
    )
  end
end
