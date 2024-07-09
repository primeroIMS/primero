# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe WebpushSubscription do
  before(:each) do
    clean_data(WebpushSubscription, User, Agency, Role)
    allow(ENV).to receive(:fetch)
    allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
  end
  let(:agency) { Agency.create!(name: 'Agency 1', agency_code: 'agency1') }
  let(:role) do
    Role.create_or_update!(name: 'Test Role 1', unique_id: 'test-role-1', permissions: { system: ['manage'] })
  end
  let(:user1) do
    User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency:,
      role:
    )
  end
  let(:user2) do
    User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_2@localhost.com',
      agency:,
      role:
    )
  end
  let(:webpush_subscription1) { WebpushSubscription.create!(notification_url: 'https://ab2ca2bac', auth: 'some-auth', p256dh: 'some-p256dh', user: user1) }

  let(:webpush_subscription2) { WebpushSubscription.create!(notification_url: 'https://notification2.url', auth: '2nd-auth', p256dh: '2nd-p256dh', user: user2) }
  let(:webpush_subscription3) { WebpushSubscription.create!(notification_url: 'https://notification3.url', auth: '3rd-auth', p256dh: '3rd-p256dh', user: user1) }
  let(:webpush_subscription4) { WebpushSubscription.create!(notification_url: 'https://notification4.url', auth: '4rd-auth', p256dh: '4rd-p256dh', user: user1, disabled: true) }

  describe 'validations' do
    let(:webpush_subscription) do
      WebpushSubscription.new(
        notification_url: 'https://ab2ca2bac', auth: 'some-auth', p256dh: 'some-p256dh', user: fake_user
      )
    end

    context 'when notification_url is empty' do
      it 'is not valid' do
        webpush_subscription.notification_url = nil

        expect(webpush_subscription).not_to be_valid
        expect(
          webpush_subscription.errors[:notification_url]
        ).to match_array(
          %w[errors.models.webpush_subscription.notification_url_present
             errors.models.webpush_subscription.notification_url_format]
        )
      end
    end

    context 'when auth is empty' do
      it 'is not valid' do
        webpush_subscription.auth = nil

        expect(webpush_subscription).not_to be_valid
        expect(webpush_subscription.errors[:auth]).to eq(['errors.models.webpush_subscription.auth_present'])
      end
    end

    context 'when p256dh is empty' do
      it 'is not valid' do
        webpush_subscription.p256dh = nil

        expect(webpush_subscription).not_to be_valid
        expect(webpush_subscription.errors[:p256dh]).to eq(['errors.models.webpush_subscription.p256dh_present'])
      end
    end
  end

  describe 'encrypted attributes' do
    let(:webpush_subscription) { WebpushSubscription.create!(notification_url: 'https://ab2ca2bac', auth: 'some-auth', p256dh: 'some-p256dh', user: user1) }

    context '#auth' do
      it 'decrypts the value' do
        expect(webpush_subscription.auth).to eq('some-auth')
        expect(webpush_subscription.read_attribute('auth')).not_to eq('another-auth')
      end
    end

    context '#auth=' do
      it 'encrypts value' do
        webpush_subscription.auth = 'another-auth'
        webpush_subscription.save!
        webpush_subscription.reload
        expect(webpush_subscription.auth).to eq('another-auth')
        expect(webpush_subscription.read_attribute('auth')).not_to eq('another-auth')
      end
    end

    context '#p256dh' do
      it 'decrypts the value' do
        expect(webpush_subscription.p256dh).to eq('some-p256dh')
        expect(webpush_subscription.read_attribute('p256dh')).not_to eq('some-p256dh')
      end
    end

    context '#p256dh=' do
      it 'encrypts value' do
        webpush_subscription.p256dh = 'another-p256dh'
        webpush_subscription.save!
        webpush_subscription.reload
        expect(webpush_subscription.p256dh).to eq('another-p256dh')
        expect(webpush_subscription.read_attribute('p256dh')).not_to eq('another-p256dh')
      end
    end
  end

  describe '.list' do
    context 'when notification_url is not present' do
      before(:each) do
        webpush_subscription1
        webpush_subscription2
        webpush_subscription3
      end

      it 'return all webpush_subscriptions' do
        webpush_subscription_list = WebpushSubscription.list(user1)
        expect(webpush_subscription_list.size).to eq(2)
        expect(webpush_subscription_list.ids).to match_array([webpush_subscription1.id, webpush_subscription3.id])
      end
    end
  end

  describe '.current_or_new_with_user' do
    context 'when call method' do
      it 'return a WebpushSubscription object' do
        webpush_subscription_obj =
          WebpushSubscription.current_or_new_with_user(
            user2,
            {
              notification_url: 'https://notification4.url', auth: '4th-auth', p256dh: '4th-p256dh'
            }
          )

        expect(webpush_subscription_obj.valid?).to be_truthy
        expect(webpush_subscription_obj.persisted?).to be_falsey
        expect(webpush_subscription_obj).to be_a WebpushSubscription
      end
    end
  end

  describe '.current' do
    before(:each) do
      webpush_subscription1
      webpush_subscription2
      webpush_subscription3
      webpush_subscription4
    end
    context 'when call method' do
      context 'when notification_url exist' do
        it 'return a WebpushSubscription object' do
          webpush_subscription_obj =
            WebpushSubscription.current(user1, { notification_url: 'https://notification3.url' })

          expect(webpush_subscription_obj.id).to eq(webpush_subscription3.id)
          expect(webpush_subscription_obj).to be_a WebpushSubscription
        end
      end
      context 'when notification_url does not exist' do
        it 'return nil object' do
          webpush_subscription_obj =
            WebpushSubscription.current(user1, { notification_url: 'https://notification-random.url' })

          expect(webpush_subscription_obj).to be_nil
        end
      end

      context 'when suscription exist but it is disabled' do
        it 'raise ActiveRecord::RecordNotFound' do
          expect do
            WebpushSubscription.current(user1, { notification_url: 'https://notification4.url' })
          end.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end

  describe '#metadata' do
    before(:each) do
      webpush_subscription1
    end
    it 'return a WebpushSubscription metadata' do
      expect(webpush_subscription1.metadata).to be_an_instance_of(Hash)
      expect(webpush_subscription1.metadata.keys).to match_array(
        %i[endpoint p256dh auth]
      )
      expect(webpush_subscription1.metadata[:endpoint]).to eq(webpush_subscription1.notification_url)
      expect(webpush_subscription1.metadata[:p256dh]).to eq(webpush_subscription1.p256dh)
      expect(webpush_subscription1.metadata[:auth]).to eq(webpush_subscription1.auth)
    end
  end

  describe '#expired?' do
    context 'when updated_at was updated more than 1440 minutes ago ' do
      before(:each) do
        Rails.configuration.x.webpush.pause_after = 1440
        webpush_subscription1
      end
      it 'return false' do
        expect(webpush_subscription1.expired?).to be false
      end
    end
    context 'when updated_at was updated 1440 minutes or less ago ' do
      before(:each) do
        Rails.configuration.x.webpush.pause_after = 1440
        webpush_subscription1.update_column(:updated_at, Time.now - 2.days)
      end
      it 'return false when updated_at is not 123 minutes before' do
        expect(webpush_subscription1.expired?).to be true
      end
    end
  end

  describe 'disable!' do
    before(:each) do
      webpush_subscription1
    end
    it 'return a WebpushSubscription metadata' do
      expect(webpush_subscription1.disabled).to be false
      webpush_subscription1.disable!
      expect(webpush_subscription1.disabled).to be true
    end
  end

  after(:each) do
    clean_data(WebpushSubscription, User, Agency, Role)
  end
end
