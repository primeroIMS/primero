# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.before_initialize do
  primero_host = ENV['PRIMERO_HOST'] || ENV['LETS_ENCRYPT_DOMAIN'] || 'localhost'
  protocol = Rails.application.config.force_ssl ? 'https://' : 'http://'

  Rails.application.routes.default_url_options[:host] = primero_host
  Rails.application.config.action_controller.asset_host = [protocol, primero_host].join
end
