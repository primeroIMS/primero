# frozen_string_literal: true

# This is the connector for the private MS-developed micro service:
# Primero User Management API for Azure Active Directory.
# It only makes sense to use within the context of the UNICEF-hosted Primero SaaS.
class IdentitySync::AzureActiveDirectoryConnector < AbstractConnector
  IDENTIFIER = 'aad'

  def self.id
    IDENTIFIER
  end

  def initialize(options = {})
    default_headers = {
      'Content-Type' => 'application/json',
      'cache-control' => 'no-cache'
    }
    self.connection = Connection.new(options.merge('default_headers' => default_headers))
  end

  def fetch(user)
    response = connection.get("/users/#{user.user_name}")
    response[1]
  end

  def create(user)
    status, response = connection.post('/users', params(user))
    log_response(user, status, response)
    response_attributes(response, user)
  end

  def update(user)
    status, response = connection.patch("/users/#{user.user_name}", params(user))
    log_response(user, status, response)
    response_attributes(response, user)
  end

  def relevant_updates?(user)
    user.full_name != user['identity_provider_sync']['aad']['full_name'] ||
      !user.disabled != user['identity_provider_sync']['aad']['enabled']
  end

  def params(user)
    {
      user_name: user.user_name,
      full_name: user.full_name,
      enabled: !user.disabled
    }
  end

  def response_attributes(response, user)
    {
      one_time_password: response['one_time_password'],
      identity_provider_sync: {
        aad: {
          message: "(#{response['correlation_id']}) #{response['error_msg']}"
        }.merge(synced_attributes(user))
      }
    }.compact
  end

  def synced_attributes(user)
    {
      synced_on: DateTime.now,
      synced_values: {
        full_name: user.full_name,
        enabled: !user.disabled
      }
    }
  end

  def log_response(user, status, response)
    message_suffix = "with IDP #{user&.identity_provider&.name} (#{user&.identity_provider&.unique_id}): "\
                     "(#{response['correlation_id']}) #{response['error_msg']}"
    case status
    when 200, 201
      Rails.logger.info("Connector #{id}: Successfully synced User #{user.user_name} #{message_suffix}")
    else
      Rails.logger.error("Error syncing User #{user.user_name} #{message_suffix}")
    end
  end
end