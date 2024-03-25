# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.secret_key_base = ENV.fetch('PRIMERO_SECRET_KEY_BASE', nil)
