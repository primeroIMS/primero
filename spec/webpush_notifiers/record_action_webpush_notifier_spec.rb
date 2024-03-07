# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RecordActionWebpushNotifier do
  before(:each) do
    clean_data(
      Alert, FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
    Rails.configuration.x.webpush.enabled = true
    allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
    SystemSettings.stub(:current).and_return(
      SystemSettings.new(
        approvals_labels_i18n: {
          'en' => {
            'closure' => 'Closure',
            'case_plan' => 'Case Plan',
            'assessment' => 'Assessment',
            'action_plan' => 'Action Plan',
            'gbv_closure' => 'Case Closure'
          }
        }
      )
    )
  end

  let(:notification_settings) do
    {
      notifications: {
        receive_webpush: [
          Transition::NOTIFICATION_ACTION, Approval::NOTIFICATION_ACTIONS_REQUEST,
          Approval::NOTIFICATION_ACTIONS_RESPONSE, Transfer::NOTIFICATION_ACTION
        ]
      }
    }
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, modules: [primero_module])
  end

  let(:role2) do
    create(:role, is_manager: true, modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(
      :user, user_name: 'user', full_name: 'Test User 1', email: 'owner@primero.dev',
             receive_webpush: true, role:, settings: notification_settings
    )
  end

  let(:user2) do
    create(:user, user_name: 'user2', role: role2, full_name: 'Test User 2',
                  email: 'user2@primero.dev', receive_webpush: true, settings: notification_settings)
  end

  let(:manager1) do
    create(:user, role:, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1')
  end

  let(:manager2) do
    create(
      :user,
      role:,
      email: 'manager2@primero.dev',
      send_mail: true,
      user_name: 'manager2',
      receive_webpush: true,
      locale: 'en',
      settings: notification_settings
    )
  end

  let(:child) do
    create(:child, name: 'Test', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end
  let(:webpush_subscription1) do
    WebpushSubscription.create!(
      notification_url: 'https://ab2ca2bac',
      auth: 'd5WR9qUGLod8NQVmxv-evg',
      p256dh: 'BHeRXLGYqECdnfw9vTGrrPjBqNxpKIohEwHhUuxfkyBmTuN47ooeGV_iEcdrgJoa2m4Ro6QxKLBMyy43_JgxolA',
      user:
    )
  end

  let(:assign1) do
    Assign.create!(transitioned_by: user.user_name, transitioned_to_user: user2, record: child)
  end

  let(:referral1) do
    Referral.create!(transitioned_by: manager1.user_name, transitioned_to: manager2.user_name, record: child)
  end

  let(:transfer1) do
    Transfer.create!(transitioned_by: manager1.user_name, transitioned_to: user2.user_name, record: child)
  end

  let(:transition_request1) do
    TransferRequest.create!(transitioned_by: user2.user_name, transitioned_to: user.user_name, record: child)
  end

  describe '#transition_notify' do
    before(:each) do
      webpush_subscription1
      assign1
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications)

      RecordActionWebpushNotifier.transition_notify(TransitionNotificationService.new(assign1.id))
    end
  end

  describe '#manager_approval_request' do
    before(:each) do
      webpush_subscription1
    end

    let(:approval_notification_service) do
      ApprovalRequestNotificationService.new(child.id, 'case_plan', manager2.user_name)
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications).with(
        manager2,
        {
          action_label: 'Go to Case',
          body: 'A Case on your team has a pending approval request for Case Plan.',
          link: "localhost/v2/cases/#{child.id}",
          title: 'Approval Request',
          icon: ''
        }
      )

      RecordActionWebpushNotifier.manager_approval_request(approval_notification_service)
    end
  end

  describe '#manager_approval_request' do
    before(:each) do
      webpush_subscription1
    end

    let(:approval_notification_service) do
      ApprovalResponseNotificationService.new(child.id, 'value1', user2.user_name, true)
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications)

      RecordActionWebpushNotifier.manager_approval_response(approval_notification_service)
    end
  end

  describe '#transfer_request' do
    before(:each) do
      webpush_subscription1
      transition_request1
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications)

      RecordActionWebpushNotifier.transfer_request(TransitionNotificationService.new(transition_request1.id))
    end
  end

  describe '.message_structure' do
    context 'when is assign' do
      before(:each) do
        webpush_subscription1
        assign1
      end

      subject do
        RecordActionWebpushNotifier.new.message_structure(assign1)
      end
      it 'should return a hash' do
        expect(subject.keys).to match_array(
          %i[title body action_label link icon]
        )
      end

      it 'should return title for assign' do
        expect(subject[:title]).to eq('New Assignment')
      end
    end

    context 'when is referral' do
      subject do
        RecordActionWebpushNotifier.new.message_structure(referral1)
      end

      it 'should return title for assign' do
        expect(subject[:title]).to eq('New Referral')
      end
    end

    context 'when is an approval request' do
      let(:approval_notification_service) do
        ApprovalRequestNotificationService.new(child.id, 'value1', manager2.user_name)
      end

      subject do
        RecordActionWebpushNotifier.new.message_structure(approval_notification_service)
      end

      it 'should return a title for approval request' do
        expect(subject[:title]).to eq('Approval Request')
      end

      it 'should return a body for approval request' do
        expect(subject[:body]).to eq('A Case on your team has a pending approval request for value1.')
      end
    end

    context 'when is an approval response' do
      let(:approval_notification_service) do
        ApprovalResponseNotificationService.new(child.id, 'value1', manager2.user_name, true)
      end

      subject do
        RecordActionWebpushNotifier.new.message_structure(approval_notification_service)
      end

      it 'should return a title for approval response' do
        expect(subject[:title]).to eq('Approval Response')
      end

      it 'should return a body for approval response' do
        expect(subject[:body]).to eq('One of your Cases has received an approval response.')
      end
    end

    context 'when is transfer' do
      subject do
        RecordActionWebpushNotifier.new.message_structure(transfer1)
      end

      it 'should return title for transfer' do
        expect(subject[:title]).to eq('New Transfer')
      end
    end

    context 'when is transfer_request' do
      subject do
        RecordActionWebpushNotifier.new.message_structure(transition_request1)
      end

      it 'should return title for transfer' do
        expect(subject[:title]).to eq('Transfer Request')
      end
    end
  end

  after do
    Rails.configuration.x.webpush.enabled = false
    clean_data(
      Alert, FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
end
