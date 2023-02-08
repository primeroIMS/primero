# frozen_string_literal: true

# Contains all solr method utils
class LogUtils
  def self.thread_id
    Thread.current.object_id
  end

  def self.remote_ip(request)
    request.headers['HTTP_X_FORWARD_FOR'].presence || request.headers['HTTP_X_REAL_IP']
  end
end
