module IncidentsHelper

  module View
    PER_PAGE = 20
    MAX_PER_PAGE = 9999
  end

  module EditView
    ONETIME_PHOTOS_UPLOAD_LIMIT = 5
  end
  ORDER_BY = {'active' => 'created_at', 'all' => 'created_at', 'reunited' => 'reunited_at', 'flag' => 'flag_at'}

  def link_for_filter filter, selected_filter
    return filter.capitalize if filter == selected_filter
    link_to(filter.capitalize, incident_filter_path(filter))
  end

  def link_for_order_by filter, order, order_id, selected_order
    return order_id.capitalize if order == selected_order
    link_to(order_id.capitalize, incident_filter_path(:filter => filter, :order_by => order))
  end

  def select_box_default(model, field)
    if field == 'status'
      return INCIDENT::STATUS_OPEN
    else
      return (model[field] || '')
    end
  end

  def text_to_identify_incident incident
    "#{incident.short_id}"
  end

  def display_formated_section_error(error)
    content_tag :li, class: "error-item", data: { error_item: error[:internal_section] } do
      "<span>#{h(error[:translated_section])}:</span> #{h(error[:message])}".html_safe
    end
  end

end
