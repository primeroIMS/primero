# frozen_string_literal: true

# This is the sync connector for the Keycloak identity provider.
# rubocop:disable Metrics/ClassLength
class ApiConnector::KeycloakConnector < ApiConnector::AbstractConnector
  IDENTIFIER = 'keycloak'
  ADMIN_TOKEN_CACHE_KEY = 'keycloak_connector/admin_token'

  def self.id
    IDENTIFIER
  end

  def realm
    ENV['KEYCLOAK_SYNC_REALM']
  end

  def initialize(options = {})
    extra_opts = {
      default_headers: {
        'Content-Type' => 'application/json'
      }
    }
    super(options.merge(extra_opts))
  end

  def fetch(user)
    status, response = connection.get("/admin/realms/#{realm}/users?username=#{user.user_name}", nil, auth_header)
    case status
    when 200
      response[0]
    else
      Rails.logger.error("Failed to fetch User #{user.user_name} for sync; status #{status}, error body #{response}")
      nil
    end
  end

  def create(user)
    status, response = connection.post("/admin/realms/#{realm}/users", create_user_representation(user), auth_header)
    log_response(user, status, response)

    kc_user = fetch(user)
    trigger_password_email(kc_user['id'])

    response_attributes(kc_user)
  end

  def update(user)
    kc_id = user['identity_provider_sync']['keycloak']['id']
    status, response = connection.put(
      "/admin/realms/#{realm}/users/#{kc_id}", create_user_representation(user), auth_header
    )
    log_response(user, status, response)

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
    idp_sync_data = user['identity_provider_sync']['keycloak']

    user.locale != idp_sync_data['locale'] ||
      user.email != idp_sync_data['email'] ||
      user.full_name != idp_sync_data['full_name'] ||
      !user.disabled != idp_sync_data['enabled']
  end

  protected

  def trigger_password_email(kc_id)
    actions_body = ['UPDATE_PASSWORD'].to_json
    status, response = connection.put(
      "/admin/realms/#{realm}/users/#{kc_id}/execute-actions-email?lifespan=9999999", actions_body, auth_header
    )

    case status
    when 200, 204
      Rails.logger.info("Password update triggered for user #{kc_id}")
    else
      Rails.logger.error("Failed to trigger update for user #{kc_id}; status #{status}, error body #{response}")
    end
  end

  def auth_header
    {
      'Authorization' => "Bearer #{admin_token}"
    }
  end

  def admin_token
    token = Rails.cache.fetch(ADMIN_TOKEN_CACHE_KEY)
    return token if token

    fetch_admin_token
  end

  def fetch_admin_token
    headers = {
      'Content-Type' => 'application/x-www-form-urlencoded'
    }
    status, response = connection.post(
      "/realms/#{realm}/protocol/openid-connect/token", fetch_admin_token_body, headers
    )

    store_admin_token(status, response)
  end

  def fetch_admin_token_body
    token_body = {
      client_id: ENV['KEYCLOAK_ADMIN_CLIENT_ID'],
      grant_type: 'password',
      username: ENV['KEYCLOAK_ADMIN_USERNAME'],
      password: ENV['KEYCLOAK_ADMIN_PASSWORD']
    }

    URI.encode_www_form(token_body)
  end

  def store_admin_token(status, response)
    case status
    when 200
      Rails.cache.write(ADMIN_TOKEN_CACHE_KEY, response['access_token'], expires_in: response['expires_in'])

      response['access_token']
    else
      Rails.logger.error("Failed to fetch admin token for sync; status #{status}, error body #{response}")
      ''
    end
  end

  # rubocop:disable Metrics/MethodLength
  def create_user_representation(user)
    first, last = user.full_name.split(' ', 2)

    {
      username: user.user_name,
      email: user.email,
      firstName: first,
      lastName: last,
      enabled: !user.disabled,
      attributes: {
        locale: user.locale
      }
    }
  end

  def response_attributes(response)
    full_name = "#{response['firstName']}#{' ' if response['lastName']}#{response['lastName']}"

    {
      identity_provider_sync: {
        keycloak: {
          full_name: full_name,
          email: response['email'],
          enabled: response['enabled'],
          locale: response['attributes']['locale'],
          id: response['id']
        }
      }
    }.compact
  end
  # rubocop:enable Metrics/MethodLength

  def log_response(user, status, response)
    message_suffix = "with IDP #{user&.identity_provider&.name} (#{user&.identity_provider&.unique_id})"
    case status
    when 200, 201, 204
      Rails.logger.info("Connector #{id}: Successfully synced User #{user.user_name} #{message_suffix}")
    else
      Rails.logger.error(
        "Error syncing User #{user.user_name} #{message_suffix}; status #{status}, error body #{response}"
      )
    end
  end
end
# rubocop:enable Metrics/ClassLength
