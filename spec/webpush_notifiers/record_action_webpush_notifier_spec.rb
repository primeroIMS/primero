# frozen_string_literal: true

require 'rails_helper'

describe RecordActionWebpushNotifier do
  before(:each) do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
    allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true)
  end

  let(:role2) do
    create(:role, is_manager: true, modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create :user, user_name: 'user', full_name: 'Test User 1', email: 'owner@primero.dev'
  end

  let(:user2) do
    create(:user, user_name: 'user2', full_name: 'Test User 2', email: 'user2@primero.dev', receive_webpush: true)
  end

  let(:manager1) do
    create(:user, role:, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1')
  end

  let(:manager2) do
    create(:user, role:, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2', receive_webpush: true)
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

  let(:user2) do
    create(:user, user_name: 'user2', role: role2, full_name: 'User 1', email: 'user2@primero.dev',
                  receive_webpush: true)
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
      ApprovalNotificationService.new(child.id, 'value1', manager2.user_name)
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications)

      RecordActionWebpushNotifier.manager_approval_request(approval_notification_service)
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
          %i[title body action_label link]
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
        ApprovalNotificationService.new(child.id, 'value1', manager2.user_name)
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

    context 'when is transfer' do
      subject do
        RecordActionWebpushNotifier.new.message_structure(transfer1)
      end

      it 'should return title for transfer' do
        expect(subject[:title]).to eq('New Transfer')
      end
    end
  end
  after do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
end
