# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Contains all solr method utils
class LogUtils
  def self.thread_id
    Thread.current.object_id
  end

  def self.remote_ip(request)
    request.headers['HTTP_X_REAL_IP'].presence || request.headers['HTTP_X_FORWARD_FOR'].presence || request.remote_ip
  end
end
