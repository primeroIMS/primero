# frozen_string_literal: true

require 'rails_helper'

describe WwwAuthenticate, type: :request do
  it 'sets the WWW-Authenticate header on a 401 response' do
    get '/api/v2/dashboards'

    expect(response).to have_http_status(401)
    expect(response.header['WWW-Authenticate']).to eq('Bearer realm="Primero" charset="UTF8"')
  end
end
