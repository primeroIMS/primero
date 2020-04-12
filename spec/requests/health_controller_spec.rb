# frozen_string_literal: true

require 'rails_helper'

describe HealthController, type: :request do
  context 'app is healthy', search: true do
    it 'returns 204 when the app is up' do
      get '/health'
      expect(response).to have_http_status(204)
    end
  end

  context 'database is down' do
    before :each do
      allow(ActiveRecord::Base.connection).to receive(:execute).and_raise(ActiveRecord::StatementInvalid)
    end

    it 'returns 503 when that databse is down' do
      get '/health'
      expect(response).to have_http_status(503)
    end
  end
end
