# frozen_string_literal: true

require 'rails_helper'

describe NotificationService do
  before do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
  let(:role) do
    create(:role, is_manager: true)
  end
  let(:user) do
    create :user, user_name: 'user', full_name: 'Test User 1', email: 'owner@primero.dev'
  end

  let(:user2) do
    create(:user, user_name: 'user2', full_name: 'Test User 2', email: 'user2@primero.dev', receive_webpush: true)
  end

  let(:child) do
    create(:child, name: 'Test', owned_by: 'user-random')
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

  describe '#send_notifications' do
    before(:each) do
      webpush_subscription1
      assign1
    end

    it 'should call TransitionNotificationService and WebpushService' do
      expect(WebpushService).to receive(:send_notifications)

      NotificationService.notify_transition(assign1.id)
    end
  end

  describe '.message_structure' do
    before(:each) do
      webpush_subscription1
      assign1
    end

    it 'should return a hash' do
      expect(NotificationService.new.message_structure(assign1).keys).to match_array(
        %i[title body action_label link]
      )
    end
  end
  after do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
end
