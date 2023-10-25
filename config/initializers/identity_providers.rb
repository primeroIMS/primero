# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.before_initialize do
  Rails.application.configure do
    config.x.idp.use_identity_provider = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_ID_EXTERNAL', nil))
  end
end
