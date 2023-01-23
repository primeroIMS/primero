# frozen_string_literal: true

# This is the sync connector for the Keycloak identity provider.

class ApiConnector::KeycloakConnector < ApiConnector::AbstractConnector
  IDENTIFIER = 'keycloak'

  def self.id
    IDENTIFIER
  end

  def realm
    ENV['KEYCLOAK_SYNC_REALM']
  end

  def initialize(options = {})
    extra_opts = {
      default_headers: {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['KEYCLOAK_ADMIN_TOKEN']}"
      }
    }
    super(options.merge(extra_opts))
  end

  def fetch(user)
    _, response = connection.get("/admin/realms/#{realm}/users?username=#{user.user_name}")
    response[0]
  end

  def create(user)
    status, = connection.post("/admin/realms/#{realm}/users", create_user_representation(user))
    log_response(user, status)

    kc_user = fetch(user)
    response_attributes(kc_user)
  end

  def update(user)
    kc_id = user['identity_provider_sync']['keycloak']['id']
    status, = connection.put("/admin/realms/#{realm}/users/#{kc_id}", create_user_representation(user))
    log_response(user, status)

    kc_user = fetch(user)
    response_attributes(kc_user)
  end

  def syncable?(user)
    # Only if the user's IDP is configured to sync with this connector
    identity_sync_connector = user&.identity_provider&.configuration&.dig('identity_sync_connector')
    identity_sync_connector == self.class.name.demodulize
  end

  def new?(user)
    !user&.identity_provider_sync&.dig('keycloak')&.dig('id')
  end

  def relevant_updates?(user)
    user.full_name != user['identity_provider_sync']['keycloak']['full_name'] ||
      !user.disabled != user['identity_provider_sync']['keycloak']['enabled']
  end

  def create_user_representation(user)
    first, last = user.full_name.split(' ', 2)

    {
      username: user.user_name,
      email: user.email,
      firstName: first,
      lastName: last,
      enabled: !user.disabled
    }
  end

  def response_attributes(response)
    full_name = "#{response['firstName']}#{' ' if response['lastName']}#{response['lastName']}"

    {
      identity_provider_sync: {
        keycloak: {
          full_name: full_name,
          enabled: response['enabled'],
          id: response['id']
        }
      }
    }.compact
  end

  def log_response(user, status)
    message_suffix = "with IDP #{user&.identity_provider&.name} (#{user&.identity_provider&.unique_id})"
    case status
    when 200, 201
      Rails.logger.info("Connector #{id}: Successfully synced User #{user.user_name} #{message_suffix}")
    else
      Rails.logger.error("Error syncing User #{user.user_name} #{message_suffix}")
    end
  end
end
