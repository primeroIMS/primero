# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Contains all solr method utils
class LogUtils
  def self.thread_id
    Thread.current.object_id
  end

  def self.remote_ip(request)
    puts "request.class = #{request.class}"
    puts "request.headers['HTTP_X_REAL_IP'] = #{request.headers['HTTP_X_REAL_IP']}"
    puts "request.headers['HTTP_X_FORWARDED_FOR'] = #{request.headers['HTTP_X_FORWARDED_FOR']}"
    puts "request.ip = #{request.ip}"
    puts "request.remote_ip = #{request.remote_ip}"
    request.headers['HTTP_X_REAL_IP'].presence || request.headers['HTTP_X_FORWARDED_FOR'].presence || request.remote_ip
  end
end
