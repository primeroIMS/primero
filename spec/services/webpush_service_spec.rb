# frozen_string_literal: true

require 'rails_helper'

describe WebpushService do
  before(:each) do
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
    Rails.configuration.x.webpush.enabled = true
    Rails.configuration.x.webpush.pause_after = 1440
    allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
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

  describe '#handle_send_push' do
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

    context 'When send payload throws an exceptions' do
      before(:each) do
        user
        webpush_subscription1
        allow(WebPush).to receive(:payload_send).and_raise(WebPush::ConfigurationError)
      end

      it 'should disabled subscription' do
        expect(webpush_subscription1.disabled).to be_falsey
        WebpushService.new.handle_send_push(webpush_subscription1, 'Random Message')
        expect(webpush_subscription1.reload.disabled).to be_truthy
      end
    end

    context 'When send payload does not throws an exceptions' do
      before(:each) do
        user
        webpush_subscription1
        allow(WebPush).to receive(:payload_send).and_return(Net::HTTPSuccess.new('1.1', '200', 'OK'))
      end

      it 'should keep subscription enabled' do
        expect(webpush_subscription1.disabled).to be_falsey
        WebpushService.new.handle_send_push(webpush_subscription1, 'Random Message')
        expect(webpush_subscription1.reload.disabled).to be_falsey
      end
    end
  end

  after do
    Rails.configuration.x.webpush.enabled = false
    clean_data(
      FormSection, PrimeroModule, PrimeroProgram, UserGroup,
      WebpushSubscription, User, Agency, Role, Child, Transition
    )
  end
end
