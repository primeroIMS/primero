module TracingActions
  extend ActiveSupport::Concern

  included do
    before_filter :load_tracing_request, :only => [:index]
  end

  def load_tracing_request
    if params[:match].present?
      # Expect match input to be in format <tracing request id>::<tracing request subform unique id>
      tracing_request_id = params[:match].split("::").first
      subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
      if @tracing_request.present? && subform_id.present?
        @match_criteria = @tracing_request.match_criteria(subform_id)
        @match_request = @tracing_request.match_request(subform_id)
      end
    end
  end
end
