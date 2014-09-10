class TracingRequestMediaController < ApplicationController
  @model_class = TracingRequest
  include MediaActions

  helper :tracing_requests

  private
end
