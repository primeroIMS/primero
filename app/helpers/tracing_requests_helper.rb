module TracingRequestsHelper

  def text_to_identify_tracing_request tracing_request
    "#{tracing_request.short_id}"
  end

  def link_to_tracing_request_update_info(tracing_request)
    link_to('and others', tracing_request_history_path(tracing_request)) unless tracing_request.has_one_interviewer?
  end
end
