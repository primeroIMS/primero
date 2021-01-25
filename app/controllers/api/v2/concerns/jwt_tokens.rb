# frozen_string_literal: true

# Set the DeviseJwt tokens into cookies
module Api::V2::Concerns::JwtTokens
  extend ActiveSupport::Concern

  def current_token
    request.env['warden-jwt_auth.token'] || request.headers['HTTP_AUTHORIZATION']&.split(' ')&.last
  end

  def token_to_cookie
    return unless current_token.present?

    cookies[:primero_token] = {
      value: current_token,
      domain: primero_host,
      same_site: :strict,
      httponly: true,
      secure: (Rails.env == 'production')
    }
  end

  def primero_host
    Rails.application.routes.default_url_options[:host]
  end
end
