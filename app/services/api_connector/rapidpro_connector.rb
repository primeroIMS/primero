class ApiConnector::RapidproConnector < ApiConnector::AbstractConnector
  IDENTIFIER = 'rp'

  def self.id
    IDENTIFIER
  end

  def self.build_from_env(options = {})
    prefix = options[:prefix] || default_env_prefix
    config = ENV.select { |key, _| key.start_with?(prefix) }
                .transform_keys { |key| key.delete_prefix(prefix).downcase }
                .with_indifferent_access

    token = config.delete(:token)
    config['default_headers'] = {
      Authorization: "Token #{token}"
    }
    new(config)
  end

  def send_message(urn, text)
    connection.post('/api/v2/broadcasts.json', post_params(urn, text))
  end

  def send_message_bulk(urns, text)
    connection.post('/api/v2/broadcasts.json', { urns:, text: })
  end

  def post_params(urn, text)
    {
      urns: [urn],
      text:
    }
  end
end
