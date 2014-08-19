module TracingRequestsHelper

  module View
    PER_PAGE = 20
    MAX_PER_PAGE = 9999
  end

  ORDER_BY = {'active' => 'created_at', 'all' => 'created_at'}

  def link_for_filter filter, selected_filter
    return filter.capitalize if filter == selected_filter
    link_to(filter.capitalize, tracing_request_filter_path(filter))
  end

  def link_for_order_by filter, order, order_id, selected_order
    return order_id.capitalize if order == selected_order
    link_to(order_id.capitalize, tracing_request_filter_path(:filter => filter, :order_by => order))
  end

  def select_box_default(model, field)
    if field == 'status'
      return 'Open'
    else
      return (model[field] || '')
    end
  end

  def text_to_identify_tracing_request tracing_request
    "#{tracing_request.short_id}"
  end

  def display_formated_section_error(error)
    content_tag :li, class: "error-item", data: { error_item: error[:internal_section] } do
      "<span>#{error[:translated_section]}:</span> #{error[:message]}".html_safe
    end
  end

  def link_to_tracing_request_update_info(tracing_request)
    link_to('and others', tracing_request_history_path(tracing_request)) unless tracing_request.has_one_interviewer?
  end
end
