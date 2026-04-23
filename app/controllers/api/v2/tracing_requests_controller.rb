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

  alias select_updated_fields_super select_updated_fields
  def select_updated_fields
    changes = @record.saved_changes_to_record.keys +
              @record.associations_as_data_keys.select { |association| association.in?(record_params.keys) }
    @updated_field_names = changes & @permitted_field_names
  end
end
