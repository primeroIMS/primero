# frozen_string_literal: true

module IdentitySync
  # This is the connector for the private MS-developed micro service:
  # Primero User Management API for Azure Active Directory.
  # It only makes sense to use within the context of the UNICEF-hosted Primero SaaS.
  class AzureActiveDirectoryConnector
    attr_accessor :connection

    IDENTIFIER = 'aad'

    def initialize(options = {})
      default_headers = {
        'Content-Type' => 'application/json',
        'cache-control' => 'no-cache'
      }
      self.connection = Connection.new(options.merge('default_headers' => default_headers))
    end

    def id
      IDENTIFIER
    end

    def sync(user)
      return {} unless exportable?(user)

      new?(user) ? create(user) : update(user)
    end

    def fetch(user)
      response = connection.get("/users/#{user.user_name}")
      response[1]
    end

    def exportable?(user)
      # TODO
      # Only Primero idp users
      # Only new users or users with changes on full name or status or idp
      # validate that the domain name of the user is @primero.org
      true
    end

    def new?(user)
      # TODO
      # not indicated that the user was synced
      true
    end

    def create(user)
      status, response = connection.post('/users', params(user))
      # TODO: handle errors.
      # TODO: indicate that the user was synced
      response
    end

    def update(user)
      response = connection.patch("/users/#{user.user_name}", params(user))
      # TODO: handle errors.
      response
    end

    def params(user)
      {
        user_name: user.user_name,
        full_name: user.full_name,
        enabled: !user.disabled
      }
    end

  end
end