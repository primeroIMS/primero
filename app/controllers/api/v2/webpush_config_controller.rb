# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API controller for Webpush
class Api::V2::WebpushConfigController < ApplicationApiController
  skip_after_action :write_audit_log, only: [:config]
end
