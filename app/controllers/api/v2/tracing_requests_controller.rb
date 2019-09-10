module Api::V2
  class TracingRequestsController < ApplicationApiController
    include Concerns::Pagination
    include Concerns::Record
  end
end