# frozen_string_literal: true

# Wraps an HTTP connection with an external service.
class ApiConnector::Connection
  attr_accessor :options, :driver

  def initialize(options = {})
    self.options = options

    self.driver = Faraday.new(url: url(options), headers: headers(options), ssl: ssl(options)) do |faraday|
      faraday.adapter(:net_http_persistent)
    end
    return unless options['basic_auth'].present?

    username, password = options['basic_auth'].split(':')
    driver.basic_auth(username, password)
  end

  def get(path, params = nil, headers = nil, &block)
    wrap { driver.get(path, to_query(params), headers, &block) }
  end

  def patch(path, params = nil, headers = nil, &block)
    wrap { driver.patch(path, to_json(params), headers, &block) }
  end

  def post(path, params = nil, headers = nil, &block)
    wrap { driver.post(path, to_json(params), headers, &block) }
  end

  def url(options = {})
    tls = ::ActiveRecord::Type::Boolean.new.cast(options['tls'])
    "#{tls ? 'https' : 'http'}://#{options['host']}:#{options['port']}"
  end

  private

  def ssl(options = {})
    tls_client_key = options['tls_client_key']
    tls_client_cert = options['tls_client_cert']
    if options['tls'] == 'client' && File.exist?(tls_client_key) && File.exist?(tls_client_cert)
      {
        cert: OpenSSL::X509::Certificate.new(File.read(tls_client_cert)),
        key: OpenSSL::PKey::RSA.new(File.read(tls_client_key))
      }
    end || {}
  end

  def headers(options = {})
    headers = options['default_headers'] || {}
    headers['x-api-key'] = options['api_key'] if options['api_key'].present?
    headers
  end

  def wrap
    response = yield
    [response.status, parse_response_body(response.body)]
  end

  def parse_response_body(body)
    JSON.parse(body)
  rescue JSON::ParserError
    body
  end

  def to_query(params)
    return params unless params.is_a?(Hash)

    params.map { |k, v| "#{k}=#{v}" }.join('&')
  end

  def to_json(params)
    return params unless params.is_a?(Hash)

    params.to_json
  end
end
