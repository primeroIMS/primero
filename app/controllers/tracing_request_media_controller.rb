class TracingRequestMediaController < ApplicationController
  include MediaActions

  helper :tracing_requests

  private

  def set_class_name
    @className = TracingRequest
  end
end
