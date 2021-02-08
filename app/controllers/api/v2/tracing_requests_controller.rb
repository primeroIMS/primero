# frozen_string_literal: true

# Main API controller for Tracing Request records
class Api::V2::TracingRequestsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  def traces
    authorize! :read, TracingRequest
    tracing_request = TracingRequest.includes(:traces).find(params[:tracing_request_id])
    authorize! :read, tracing_request
    @traces = tracing_request.traces
    render 'api/v2/traces/index'
  end
end
