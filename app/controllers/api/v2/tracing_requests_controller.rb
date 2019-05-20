module Api::V2
  class TracingRequestsController < ApplicationApiController
    @model_class = TracingRequest

    include Concerns::Pagination
    include Concerns::Record

  end
end