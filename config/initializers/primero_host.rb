# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.before_initialize do
<<<<<<< Updated upstream
  primero_host = ENV['PRIMERO_HOST'] || ENV['LETS_ENCRYPT_DOMAIN'] || 'localhost'
=======
  primero_host = ENV['PRIMERO_HOST'] || ENV['LETS_ENCRYPT_DOMAIN'] || 'localhost:3000'
  Rails.application.config.force_ssl ? 'https://' : 'http://'

>>>>>>> Stashed changes
  Rails.application.routes.default_url_options[:host] = primero_host
end
