# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

Warden::Manager.before_failure do |env, _opts|
  request = ActionDispatch::Request.new(env)

  user_name = request.params.dig('user', 'user_name')
  user = User.find_by(user_name:)

  AuditLogJob.perform_later(
    record_type: User.class.name,
    record_id: user&.id,
    action: 'failed_login',
    user_id: user&.id,
    resource_url: request.url,
    metadata: {
      user_name: user_name,
      remote_ip: LogUtils.remote_ip(request)
    }
  )
end
