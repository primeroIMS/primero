# frozen_string_literal: true

# Main API controller for Tracing Request records
class Api::V2::TracingRequestsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record
end
