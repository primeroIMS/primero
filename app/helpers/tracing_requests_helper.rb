module TracingRequestsHelper

  def text_to_identify_tracing_request tracing_request
    "#{tracing_request.short_id}"
  end

end
