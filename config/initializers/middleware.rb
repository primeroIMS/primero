# frozen_string_literal: true

require "#{Rails.root}/app/middleware/www_authenticate.rb"
require "#{Rails.root}/app/middleware/log_silencer.rb"
require "#{Rails.root}/app/middleware/xff_strip_port"

Rails.application.config.middleware.insert_before(Warden::Manager, WwwAuthenticate)
Rails.application.config.middleware.insert_before(Rails::Rack::Logger, LogSilencer)
Rails.application.config.middleware.insert_before(ActionDispatch::RemoteIp, XffStripPort)
