# frozen_string_literal: true

require 'rails_helper'

describe HealthController, type: :request do
  it 'returns 204 when the app is up' do
    get '/health'
    expect(response).to have_http_status(204)
  end
end