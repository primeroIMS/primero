# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'warden'

# This strategy is used when Primero needs to authorize a JWT token from an external identity provider.
class IdpTokenStrategy < Warden::Strategies::Base
  METHOD = 'Bearer'

  def valid?
    !token.nil? && Rails.configuration.x.idp.use_identity_provider
  end

  def store?
    false
  end

  def authenticate!
    idp_token = IdpToken.build(token)
    return fail!('Invalid JWT token') unless idp_token.valid?

    user = idp_token.user
    return fail!('Valid JWT does not correspond to user') unless user.present?
    return fail!('Valid JWT corresponds to disabled user') if user.disabled

    success!(user)
  rescue StandardError => e
    fail!(e.message)
  end

  private

  def token
    @token ||= auth_header(env)
  end

  def auth_header(env)
    auth = env['HTTP_AUTHORIZATION']
    return nil unless auth

    method, token = auth.split
    method == METHOD ? token : nil
  end
end

Warden::Strategies.add(:jwt, IdpTokenStrategy)
