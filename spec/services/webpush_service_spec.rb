# frozen_string_literal: true

require 'rails_helper'

describe WebpushService do
  before do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
  describe '#send_notifications' do
    let(:role) do
      create(:role, is_manager: true)
    end

    let(:user) do
      create(:user, user_name: 'user2', full_name: 'Test User 1', email: 'user2@primero.dev', receive_webpush: true)
    end

    let(:webpush_subscription1) do
      WebpushSubscription.create!(
        notification_url: 'https://ab2ca2bac',
        auth: 'd5WR9qUGLod8NQVmxv-evg',
        p256dh: 'BHeRXLGYqECdnfw9vTGrrPjBqNxpKIohEwHhUuxfkyBmTuN47ooeGV_iEcdrgJoa2m4Ro6QxKLBMyy43_JgxolA',
        user:
      )
    end

    before(:each) do
      user
      webpush_subscription1
    end

    it 'should call WebPush.payload_send' do
      expect(WebPush).to receive(:payload_send)

      WebpushService.send_notifications(user, 'Random Message')
    end
  end
  after do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
end
