# frozen_string_literal: true

Rails.application.config.middleware.insert_before(Warden::JWTAuth::Middleware, JwtTokenSetter)
Rails.application.config.middleware.insert_before(Warden::Manager, WwwAuthenticate)
if Rails.application.config.x.idp.use_identity_provider
  Rails.application.config.middleware.delete(Warden::JWTAuth::Middleware)
end
