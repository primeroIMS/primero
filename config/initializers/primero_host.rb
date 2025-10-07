# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.before_initialize do
  primero_host = ENV['PRIMERO_HOST'] || ENV['LETS_ENCRYPT_DOMAIN'] || 'localhost'
  protocol = Rails.application.config.force_ssl ? 'https://' : 'http://'
  asset_host = [protocol, primero_host]
  asset_host << ':3000' if Rails.env.development?

  Rails.application.routes.default_url_options[:host] = primero_host
  Rails.application.config.asset_host = asset_host.join
end
