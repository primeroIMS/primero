# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# The endpoint used to authenticate a user when native authentication is enabled in Primero
class Api::V2::TokensController < Devise::SessionsController
  include AuditLogActions
  include ErrorHandling
  respond_to :json

  before_action :write_audit_log, only: [:respond_to_on_destroy]

  # This method overrides the deprecated ActionController::MimeResponds#respond_with
  # that Devise unfortunately still uses. We are overriding it to return a JSON object
  # for the Devise session create method.
  def respond_with(user, _opts = {})
    render json: { id: user.id, user_name: user.user_name }
  end

  # Overriding method called by Devise session destroy.
  def respond_to_on_destroy
    render json: {}
  end

  def create
    # TODO: This may no longer be needed once we change to store session in the database will need to test
    warden.logout(resource_name) if !current_user_match_params? && user_name_param.present?

    if Rails.configuration.x.idp.use_identity_provider
      create_idp
    else
      super
    end
  end

  def create_idp
    idp_token = IdpToken.build(current_token)
    user = idp_token.valid? && idp_token.user
    if user
      render json: { id: user.id, user_name: user.user_name, token: current_token }
    else
      fail_to_authorize!(auth_options)
    end
  end

  # TODO: This will no longer be needed once we change to store session in the database
  def destroy
    session[:expires_at] = 30.minutes.ago
    super
  end

  def fail_to_authorize!(opts)
    throw(:warden, opts)
  end

  # Shut down the default Devise endpoint
  def new
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

  def current_token
    IdpTokenStrategy.token_from_header(request.headers)
  end

  def user_name_param
    sign_in_params[resource_class.authentication_keys.first]
  end

  def current_user_match_params?
    current_user&.user_name == user_name_param
  end
end
