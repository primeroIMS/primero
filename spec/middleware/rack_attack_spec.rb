# frozen_string_literal: true

require 'rails_helper'

describe 'Rack::Attack API rate limit' do
  let(:app) { ->(_env) { [200, {}, ['OK']] } }
  let(:client) { Rack::MockRequest.new(Rack::Attack.new(app)) }
  let(:environment_variables) do
    %w[
      PRIMERO_API_RATE_LIMIT_ENABLED
      PRIMERO_API_RATE_LIMIT_REQUESTS
      PRIMERO_API_RATE_LIMIT_PERIOD
    ]
  end

  around do |example|
    original_values = ENV.to_h.slice(*environment_variables)
    environment_variables.each { |name| ENV.delete(name) }
    Rack::Attack.reset!

    example.run
  ensure
    environment_variables.each { |name| ENV.delete(name) }
    original_values.each { |name, value| ENV[name] = value }
    Rack::Attack.reset!
  end

  it 'is disabled when the enable environment variable is missing' do
    ENV['PRIMERO_API_RATE_LIMIT_REQUESTS'] = '1'

    2.times do
      expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    end
  end

  it 'uses 300 requests and 60 seconds as defaults' do
    throttle = Rack::Attack.throttles.fetch('API requests')

    expect(throttle.limit.call(nil)).to eq(300)
    expect(throttle.period.call(nil)).to eq(60)
  end

  it 'throttles API requests when enabled' do
    enable_rate_limit(requests: 2)

    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(post('/api/v2/users', session: 'session-one')).to eq(200)
    expect(get('/api/v2/cases', session: 'session-one')).to eq(429)
  end

  it 'returns a JSON error response and logs the first rejected request' do
    enable_rate_limit(requests: 1)
    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(Rails.logger).to receive(:warn).with(
      'Rate limit exceeded: throttle=API requests method=GET path=/api/v2/cases limit=1 period=60'
    ).once

    response = get_response('/api/v2/cases', session: 'session-one')
    error = JSON.parse(response.body).fetch('errors').first

    expect(response.status).to eq(429)
    expect(response.content_type).to eq('application/json; charset=utf-8')
    expect(response['retry-after'].to_i).to be_between(1, 60)
    expect(error).to eq(
      'status' => 429,
      'resource' => '/api/v2/cases',
      'message' => 'errors.api.too_many_requests'
    )

    expect(get('/api/v2/cases', session: 'session-one')).to eq(429)
  end

  it 'uses the same limit for separate sessions from the same IP address' do
    enable_rate_limit(requests: 1)

    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(get('/api/v2/cases', session: 'session-two')).to eq(429)
  end

  it 'uses the same limit for separate authorization credentials from the same IP address' do
    enable_rate_limit(requests: 1)

    expect(get('/api/v2/cases', authorization: 'Bearer token-one')).to eq(200)
    expect(get('/api/v2/cases', authorization: 'Bearer token-two')).to eq(429)
  end

  it 'keeps separate limits for separate IP addresses' do
    enable_rate_limit(requests: 1)

    expect(get('/api/v2/cases', remote_ip: '127.0.0.1')).to eq(200)
    expect(get('/api/v2/cases', remote_ip: '127.0.0.2')).to eq(200)
    expect(get('/api/v2/cases', remote_ip: '127.0.0.1')).to eq(429)
  end

  it 'does not throttle requests outside the API' do
    enable_rate_limit(requests: 1)

    2.times do
      expect(get('/v2/dashboards', session: 'session-one')).to eq(200)
    end
  end

  def enable_rate_limit(requests:)
    ENV['PRIMERO_API_RATE_LIMIT_ENABLED'] = 'true'
    ENV['PRIMERO_API_RATE_LIMIT_REQUESTS'] = requests.to_s
    ENV['PRIMERO_API_RATE_LIMIT_PERIOD'] = '60'
  end

  def get(path, session: nil, authorization: nil, remote_ip: '127.0.0.1')
    get_response(path, session:, authorization:, remote_ip:).status
  end

  def get_response(path, session: nil, authorization: nil, remote_ip: '127.0.0.1')
    client.get(path, request_headers(session:, authorization:, remote_ip:))
  end

  def post(path, session: nil, authorization: nil, remote_ip: '127.0.0.1')
    client.post(path, request_headers(session:, authorization:, remote_ip:)).status
  end

  def request_headers(session:, authorization:, remote_ip:)
    headers = { 'REMOTE_ADDR' => remote_ip }
    headers['HTTP_COOKIE'] = "_app_session=#{session}" if session
    headers['HTTP_AUTHORIZATION'] = authorization if authorization
    headers
  end
end
