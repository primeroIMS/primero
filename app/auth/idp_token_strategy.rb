# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'warden'

# This strategy is used when Primero needs to authorize a JWT token from an external identity provider.
class IdpTokenStrategy < Warden::Strategies::Base
  METHOD = 'Bearer'

  def valid?
    !token.nil? && Rails.configuration.x.idp.use_identity_provider
  end

  # This is an override for warden to skip storing session in a cookie
  def store?
    true
  end

  def authenticate!
    idp_token = IdpToken.build(token)
    return fail!('Invalid JWT token') unless idp_token.valid?
    return fail!('Blacklisted JWT token') if idp_token.blacklisted?

    user = idp_token.user
    return fail!('Valid JWT does not correspond to user') unless user.present?
    return fail!('Valid JWT corresponds to disabled user') if user.disabled

    idp_token.activate!
    success!(user)
  rescue StandardError => e
    fail!(e.message)
  end

  def self.token_from_header(header)
    auth = header['HTTP_AUTHORIZATION']
    method, token = auth&.split
    method == METHOD ? token : nil
  end

  private

  def token
    @token ||= auth_header(env)
  end

  def auth_header(env)
    IdpTokenStrategy.token_from_header(env)
  end
end
