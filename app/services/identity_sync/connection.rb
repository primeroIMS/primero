module IdentitySync
  class Connection
    attr_accessor :options, :driver

    def initialize(options = {})
      self.options = options

      # host = opts[:host]
      # port = opts[:port]
      # tls = opts[:tls] # nil, 'client', 'server'
      # tls_client_key = opts[:tls_client_key]
      # tls_client_cert = opts[:tls_client_cert]
      # ssl = if tls == 'client' && File.exist?(tls_client_key) && File.exist?(tls_client_cert)
      #         {
      #           cert: OpenSSL::X509::Certificate.new(File.read(tls_client_cert)),
      #           key: OpenSSL::PKey::RSA.new(File.read(tls_client_key))
      #         }
      #       end || {}
      # url = "#{tls ? 'https' : 'http'}://#{host}:#{port}"
      # headers = { 'Content-Type' => 'application/json' }
      self.driver = Faraday.new(url: url(options), headers: options['default_headers'], ssl: ssl(options)) do |faraday|
        #faraday.adapter = Faraday::Adapter::NetHttpPersistent
        faraday.adapter(:net_http_persistent)
      end
    end

    def get(*args, &block)
      wrap { driver.get(*args, &block) }
    end

    def patch(*args, &block)
      wrap { driver.patch(*args, &block) }
    end

    def post(*args, &block)
      wrap { driver.post(*args, &block) }
    end

    def url(options = {})
      "#{options['tls'].present? ? 'https' : 'http'}://#{options['host']}:#{options['port']}"
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

    def wrap
      response = yield
      [response.status, JSON.parse(response.body)]
    end
  end
end