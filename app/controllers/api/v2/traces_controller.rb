# frozen_string_literal: true

# API controller for Trace records. Normally Traces will be CRUDed via the TracingRequest API.
class Api::V2::TracesController < ApplicationApiController
  def show
    @trace = Trace.find(params[:id])
    authorize! :read, @trace
  end
end
