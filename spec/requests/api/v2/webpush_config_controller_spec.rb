# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::WebpushConfigController, type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/webpush/config' do
    context 'when webpush is not enabled' do
      it 'return enable false and vapid_public key nil' do
        login_for_test
        get '/api/v2/webpush/config'

        expect(json['data']['enabled']).to be_falsey
        expect(json['data']['vapid_public']).to be_nil
      end
    end

    context 'when webpush is enabled' do
      before(:each) do
        Rails.configuration.x.webpush.enabled = true
        Rails.configuration.x.webpush.vapid_public = 'vapic_public_key_123!'
      end

      it 'return enable true and vapid_public key' do
        login_for_test
        get '/api/v2/webpush/config'

        expect(json['data']['enabled']).to be true
        expect(json['data']['vapid_public']).to eq('vapic_public_key_123!')
      end
    end
  end
end
