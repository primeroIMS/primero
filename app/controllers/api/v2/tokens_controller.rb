# frozen_string_literal: true

# The endpoint used to authenticate a user when native authentication is enabled in Primero
class Api::V2::TokensController < Devise::SessionsController
  include AuditLogActions
  include Api::V2::Concerns::JwtTokens
  respond_to :json

  skip_before_action :verify_authenticity_token
  before_action :write_audit_log, only: [:respond_to_on_destroy]

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
