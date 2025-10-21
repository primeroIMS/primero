# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

return unless ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_CAPTCHA_ENABLED',
                                                             false)) && Rails.env.production?

def load_settings
  settings_file = Rails.root.join('config', 'captcha.yml')
  return {} unless File.exist?(settings_file)

  YAML.safe_load(ERB.new(File.read(settings_file)).result).with_indifferent_access || {}
end

@captcha_settings = load_settings if ENV.fetch('PRIMERO_CAPTCHA_PROVIDER', nil).present?
Rails.application.config.x.captcha_provider = ENV.fetch('PRIMERO_CAPTCHA_PROVIDER', nil)
Rails.application.config.x.captcha = @captcha_settings&.dig(Rails.application.config.x.captcha_provider) || {}
