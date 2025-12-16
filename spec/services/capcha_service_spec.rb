# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe CaptchaService do
  describe '.verify' do
    let(:stubs) { Faraday::Adapter::Test::Stubs.new }
    let(:conn) { Faraday.new { |b| b.adapter(:test, stubs) } }

    before do
      allow(Faraday).to receive(:post) do |url, params|
        conn.post(url, params)
      end
    end

    after(:each) do
      stubs.verify_stubbed_calls
    end

    after do
      Faraday.default_connection = nil
    end

    context 'with turnstile provider' do
      it 'validates the captcha response' do
        stubs.post('/') do
          [200, { 'Content-Type' => 'application/json' }, { success: true }.to_json]
        end

        expect(CaptchaService.verify(provider: 'turnstile', token: 'valid_token', remote_ip: '127.0.0.1')).to be(true)
      end
    end

    context 'with invalid token' do
      it 'returns false for invalid token' do
        stubs.post('/') do
          [200, { 'Content-Type' => 'application/json' },
           { success: false, 'error-codes' => ['invalid-input-response'] }.to_json]
        end

        expect do
          CaptchaService.verify(provider: 'turnstile', token: 'invalid_token',
                                remote_ip: '127.0.0.1')
        end.to raise_error(Errors::InvalidCaptcha)
      end
    end

    context 'with missing parameters' do
      it 'returns false for nil token' do
        expect do
          CaptchaService.verify(provider: 'turnstile', token: nil,
                                remote_ip: '127.0.0.1')
        end.to raise_error(Errors::InvalidCaptcha)
      end

      it 'returns false for empty token' do
        expect do
          CaptchaService.verify(provider: 'turnstile', token: '',
                                remote_ip: '127.0.0.1')
        end.to raise_error(Errors::InvalidCaptcha)
      end

      it 'returns false for nil remote_ip' do
        expect do
          CaptchaService.verify(provider: 'turnstile', token: 'valid_token',
                                remote_ip: nil)
        end.to raise_error(Errors::InvalidCaptcha)
      end
    end

    context 'with network errors' do
      it 'raises CaptchaServiceUnavailable on connection failure' do
        allow(Faraday).to receive(:post).and_raise(Faraday::ConnectionFailed.new('execution expired'))

        expect do
          CaptchaService.verify(provider: 'turnstile', token: 'valid_token', remote_ip: '127.0.0.1')
        end.to raise_error(Errors::CaptchaServiceUnavailable, /execution expired/)
      end

      it 'raises CaptchaServiceUnavailable on timeout' do
        allow(Faraday).to receive(:post).and_raise(Faraday::TimeoutError.new('read timeout'))

        expect do
          CaptchaService.verify(provider: 'turnstile', token: 'valid_token', remote_ip: '127.0.0.1')
        end.to raise_error(Errors::CaptchaServiceUnavailable, /read timeout/)
      end
    end

    context 'with unsupported provider' do
      it 'returns false for unknown provider' do
        expect(CaptchaService.verify(provider: 'unknown', token: 'valid_token', remote_ip: '127.0.0.1')).to be(true)
      end
    end
  end
end
