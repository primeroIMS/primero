# frozen_string_literal: true

require 'rails_helper'

describe XffStripPort, type: :request do
  it 'strips out the port from an ip:port formatted XFF header' do
    get '/api/v2/primero', headers: { 'X-Forwarded-For' => '8.8.8.8:8888' }

    expect(request.remote_ip).to eq('8.8.8.8')
    expect(request.headers['X-Forwarded-For']).to eq('8.8.8.8')
  end

  it 'handles correctly formatted XFF headers' do
    get '/api/v2/primero', headers: { 'X-Forwarded-For' => '8.8.8.8' }

    expect(request.remote_ip).to eq('8.8.8.8')
    expect(request.headers['X-Forwarded-For']).to eq('8.8.8.8')
  end
end
