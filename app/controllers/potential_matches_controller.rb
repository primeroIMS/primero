class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include IndexHelper
  include RecordFilteringPagination
  include RecordActions

  def load_tracing_request
    if params[:match].present?
      tracing_request_id = params[:match].split("::").first
      @subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
    end
  end

  def record_filter(filter)
    filter["status"] ||= {:type => "single", :value => "#{PotentialMatch::POTENTIAL}"}
    if params[:match].present?
      load_tracing_request
      filter["tracing_request_id"] ||= {:type => "single", :value => @tracing_request.id}
      filter["tr_subform_id"] ||= {:type => "single", :value => @subform_id}
    end
    filter
  end

end
