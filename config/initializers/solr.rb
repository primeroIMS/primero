# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

Rails.application.config.before_initialize do
  Rails.application.configure do
    config.solr_enabled = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('SOLR_ENABLED', nil)) || false
  end
end
