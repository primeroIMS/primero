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
      # Only if the user's IDP is configured to sync with this connector
      identity_sync_connector = user&.identity_provider&.configuration&.fetch(:identity_sync_connector)
      return false unless identity_sync_connector == self.class.name

      # Only new users or users with changes on full name or status or idp
      sync_metadata = user&.identity_provider_sync&.fetch(id)
      sync_metadata&.fetch(:perform_sync)
    end

    def new?(user)
      sync_metadata = user&.identity_provider_sync&.fetch(id)
      sync_metadata&.fetch(:synced_on)
    end

    def create(user)
      status, response = connection.post('/users', params(user))
      log_response(user, status, response)
      response_attributes(response)
    end

    def update(user)
      status, response = connection.patch("/users/#{user.user_name}", params(user))
      log_response(user, status, response)
      response_attributes(response)
    end

    def params(user)
      {
        user_name: user.user_name,
        full_name: user.full_name,
        enabled: !user.disabled
      }
    end

    def response_attributes(response)
      {
        one_time_password: response['one_time_password'],
        identity_provider_sync: {
          aad: {
            perform_sync: false,
            synced_on: DateTime.now,
            message: "(#{response['correlation_id']}) #{response['error_msg']}"
          }.compact
        }
      }.compact
    end

    def log_response(user, status, response)
      message_suffix = "with IDP #{user&.identity_provider&.name} (#{user&.identity_provider&.unique_id}): "\
                       "(#{response['correlation_id']}) #{response['error_msg']}"
      case status
      when 200, 201
        Rails.logger.info("Successfully synced User #{user.user_name} #{message_suffix}")
      else
        Rails.logger.error("Error syncing User #{user.user_name} #{message_suffix}")
      end
    end
  end
end