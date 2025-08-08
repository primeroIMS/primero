# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

Warden::Manager.before_failure do |env, _opts|
  request = ActionDispatch::Request.new(env)

  user_name = request.params.dig('user', 'user_name')
  user = User.find_by(user_name:)

  debug_hash = {
    params: request.params,
    headers: request.headers.env.select { |k, _| k.start_with?('HTTP_') },
    cookies: request.cookies,
    fullpath: request.fullpath,
    method: request.request_method,
    ip: request.remote_ip
  }

  Rails.logger.info('[AUDIT] Login failed: request=')
  Rails.logger.info(debug_hash.to_json)

  AuditLogJob.perform_later(
    record_type: User.name,
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
