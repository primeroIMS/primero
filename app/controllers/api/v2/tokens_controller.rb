# frozen_string_literal: true

# The endpoint used to authenticate a user when native authentication is enabled in Primero
class Api::V2::TokensController < Devise::SessionsController
  include AuditLogActions
  include Api::V2::Concerns::JwtTokens
  include ErrorHandling
  respond_to :json

  skip_before_action :verify_authenticity_token
  before_action :write_audit_log, only: [:respond_to_on_destroy]
  before_action :disable_for_idp!

  # This method overrides the deprecated ActionController::MimeResponds#respond_with
  # that Devise unfortunately still uses. We are overriding it to return a JSON object
  # for the Devise session create method.
  def respond_with(user, _opts = {})
    token_to_cookie
    render json: { id: user.id, user_name: user.user_name, token: current_token }
  end

  # Overriding method called by Devise session destroy.
  def respond_to_on_destroy
    cookies.delete(:primero_token, domain: primero_host)
    render json: {}
  end

  # HACK: Removing primero_token cookie when failing to authenticate with current token.
  def create
    creation = catch(:warden) do
      super
    end
    # warden throws user scope Hash on authentication failure.
    if creation.is_a?(Hash)
      cookies.delete(:primero_token, domain: primero_host)
      throw(:warden, creation)
    else
      creation
    end
  end

  # Shut down the default Devise endpoint
  def new
    raise(ActionController::RoutingError, 'Not Found')
  end

  def disable_for_idp!
    return unless Rails.configuration.x.idp.use_identity_provider

    raise(ActionController::RoutingError, 'Not Found')
  end

  def model_class
    User
  end

  def record_id
    current_user.try(:id)
  end

  def create_action_message
    'login'
  end

  def destroy_action_message
    'logout'
  end
end
