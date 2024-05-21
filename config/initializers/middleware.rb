# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require "#{Rails.root}/app/middleware/www_authenticate.rb"
require "#{Rails.root}/app/middleware/log_silencer.rb"

Rails.application.config.middleware.insert_before(Warden::Manager, WwwAuthenticate)
Rails.application.config.middleware.insert_before(Rails::Rack::Logger, LogSilencer)
