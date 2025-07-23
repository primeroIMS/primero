# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# The endpoint used to authenticate a user.
class Api::V2::TokensController < Devise::SessionsController
  include AuditLogActions
  include ErrorHandling
  respond_to :json

  before_action :write_audit_log, only: [:respond_to_on_destroy]
  before_action :expire_other_user_sessions, only: %i[create destroy]
  after_action :blacklist_current_idp_token, only: %i[destroy], if: -> { IdentityProvider.mode_enabled? }
  after_action :store_ip_and_user_agent, only: %i[create]

  # This method overrides the deprecated ActionController::MimeResponds#respond_with
  # that Devise unfortunately still uses. We are overriding it to return a JSON object
  # for the Devise session create method.
  def respond_with(user, _opts = {})
    render json: { id: user.id, user_name: user.user_name }
  end

  # Overriding method called by Devise session destroy.
  def verify_signed_out_user
    return if IdentityProvider.mode_enabled?

    super
  end

  # Overriding method called by Devise session destroy.
  def respond_to_on_destroy
    render json: {}
  end

  def create
    if IdentityProvider.mode_enabled?
      create_idp
    else
      super
    end
  end

  def create_idp
    user = idp_token.valid? && idp_token.user
    if user
      render json: { id: user.id, user_name: user.user_name, token: current_token }
    else
      fail_to_authorize!(auth_options)
    end
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

  def idp_token
    return unless IdentityProvider.mode_enabled?

    @idp_token ||= IdpToken.build(current_token)
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

  def expire_other_user_sessions
    return unless current_user.present?

    Session.list_by_user_id(current_user.id).each do |sess|
      next if current_session?(sess)

      sess.destroy
    end
  end

  def current_session?(sess)
    current_session_id = IdentityProvider.mode_enabled? ? idp_token.unique_id : session.id.private_id
    sess.session_id == current_session_id
  end

  def store_ip_and_user_agent
    if IdentityProvider.mode_enabled?
      store_ip_and_user_agent_idp
    else
      session[:ip_address] ||= request.remote_ip
      session[:user_agent] ||= request.user_agent
    end
  end

  def store_ip_and_user_agent_idp
    idp_token_session = idp_token.session
    idp_token_session.data['ip_address'] ||= request.remote_ip
    idp_token_session.data['user_agent'] ||= request.user_agent
    idp_token_session.save
  end

  def blacklist_current_idp_token
    idp_token.blacklist
  end
end
