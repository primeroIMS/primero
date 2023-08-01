# frozen_string_literal: true

Rails.application.config.secret_key_base = ENV.fetch('PRIMERO_SECRET_KEY_BASE', nil)
