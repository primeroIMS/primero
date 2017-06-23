module ChildrenHelper

  module View
    PER_PAGE = 20
    MAX_PER_PAGE = 9999
  end

  module EditView
    ONETIME_PHOTOS_UPLOAD_LIMIT = 5
  end
  ORDER_BY = {'active' => 'created_at', 'all' => 'created_at', 'reunited' => 'reunited_at', 'flag' => 'flag_at'}

  def is_playable_in_browser audio
    AudioMimeTypes.browser_playable? audio.mime_type
  end

  def link_to_update_info(child)
    link_to('and others', child_history_path(child)) unless child.has_one_interviewer?
  end

  def flag_summary_for_child(child)
    flag_history = child["histories"].select{|h| h["changes"].keys.include?("flag") }.first
     "<b>"+ I18n.t("child.flagged_by")+" </b>"+ flag_history["user_name"] +"<b> "+I18n.t("preposition.on_label")+"</b> " + current_user.localize_date(flag_history["datetime"]) +"<b> "+I18n.t("preposition.because")+"</b> "+ child["flag_message"]
  end

  def reunited_message
    "Reunited"
  end

  def duplicate_message
    raw ("This record has been marked as a duplicate and is no longer active. To see the Active record click #{link_to 'here', child_path(@child.duplicate_of)}.")
  end

  def link_for_filter filter, selected_filter
    return filter.capitalize if filter == selected_filter
    link_to(filter.capitalize, child_filter_path(filter))
  end

  def link_for_order_by filter, order, order_id, selected_order
    return order_id.capitalize if order == selected_order
    link_to(order_id.capitalize, child_filter_path(:filter => filter, :order_by => order))
  end

  def text_to_identify_child(child)
    child.case_id_display.present? ? child.case_id_display : child.short_id
  end

  def case_status_text(child, lookups)
    workflow_text = Lookup.display_value('lookup-workflow', child.workflow, lookups)
    case child.workflow
      when Child::WORKFLOW_NEW
        "#{workflow_text} #{t("case.workflow.created_on")} #{I18n.l(child.created_at)}"
      when Child::WORKFLOW_CLOSED
        case_status_date_text(workflow_text, child.date_closure)
      when Child::WORKFLOW_REOPENED
        case_status_date_text(workflow_text, child.reopened_date)
      when Child::WORKFLOW_SERVICE_PROVISION
        service_provision_text(child)
      else
        "#{workflow_text} #{t("case.workflow.in_progress")}"
    end
  end

  # Display text is based on the last entered Service Response Type
  def service_provision_text(child)
    if child.services_section.present?
      most_recent_service_type_response = child.services_section.map{|s| s.service_response_type}.reject(&:blank?).last
      service_provision_text = Lookup.display_value('lookup-service-response-type', most_recent_service_type_response)
      "#{service_provision_text} #{t("case.workflow.in_progress")}"
    else
      ""
    end
  end

  def case_status_date_text(text, a_date)
    if a_date.present? && (a_date.is_a?(Date) || a_date.is_a?(DateTime))
      "#{text} #{t("case.workflow.on_label")} #{I18n.l(a_date)}"
    else
      "#{text}"
    end
  end

  def toolbar_for_child child
    if child.duplicate?
      link_to 'View the change log', child_history_path(child)
    else
      render :partial => "show_child_toolbar"
    end
  end

  def select_box_default(model, field)
    if field == 'status'
      return Record::STATUS_OPEN
    else
      return (model[field] || '')
    end
  end

  def display_formated_section_error(error)
    content_tag :li, class: "error-item", data: { error_item: error[:internal_section] } do
      "<span>#{h(error[:translated_section])}:</span> #{h(error[:message])}".html_safe
    end
  end

  # <ul class="overview_status">
  #   <li><div class="label"><%= @child.workflow %></div></li>
  #   <li class="status">Immediate Response</li>
  #   <li class="is_closed">Closed</li>
  # </ul>
  def display_workflow_status(child, lookups)
    new_or_reopened_text =
      if [Child::WORKFLOW_NEW, Child::WORKFLOW_REOPENED].include?(child.workflow)
        I18n.t("case.workflow.#{child.workflow}")
      end
    closed_text = child.workflow == Child::WORKFLOW_CLOSED ? I18n.t("case.workflow.closed") : nil
    content_tag :ul, class: 'overview_status' do
      label = content_tag(:div, new_or_reopened_text, class: 'label')
      concat(content_tag(:li, label)) if new_or_reopened_text.present?
      concat(content_tag(:li, 'Ir', class: 'status'))
      concat(content_tag(:li, 'closed', class: 'is_closed')) if closed_text.present?
    end
  end
end
