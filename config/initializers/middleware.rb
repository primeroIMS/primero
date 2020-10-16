# frozen_string_literal: true

Rails.application.config.middleware.insert_before(Warden::JWTAuth::Middleware, JwtTokenSetter)
Rails.application.config.middleware.insert_before(Warden::Manager, WwwAuthenticate)
