class TracingRequestMediaController < ApplicationController
  include MediaActions

  helper :tracing_requests

  private

  def set_class_name
    model_class = TracingRequest
  end
end
