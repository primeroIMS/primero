# frozen_string_literal: true

require "#{Rails.root}/app/middleware/jwt_token_setter.rb"
require "#{Rails.root}/app/middleware/www_authenticate.rb"

Rails.application.config.middleware.insert_before(Warden::JWTAuth::Middleware, JwtTokenSetter)
Rails.application.config.middleware.insert_before(Warden::Manager, WwwAuthenticate)
if Rails.application.config.x.idp.use_identity_provider
  Rails.application.config.middleware.delete(Warden::JWTAuth::Middleware)
end
