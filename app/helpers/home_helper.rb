module HomeHelper

  def link_dashboard_title(record)
    model = model_name(record)
    send("#{model}_link_dashboard_title", record)
  end

  def link_dashboard_path(record)
    model = model_name(record)
    send("#{model}_path", id: record[:record_id] || record)
  end

  def index_link_dashboard_path(model)
    model = model_name_class(model).pluralize
    send("#{model}_path") + "?scope[flag]=single||flag"
  end

  def case_count(count, query, model)
    results = query.facet(count[:name]).rows
    new_count = I18n.translate("dashboard.count_#{count[:name].to_s}_new",
                  { count: stat_link(results.select{|v| v.value == count[:new_count]}.first.count, count, model),
                   count_type: count[:new_count].to_s })
    total_count = I18n.translate("dashboard.count_#{count[:name].to_s}_total",
                    { count: stat_link(results.select{|v| v.value == count[:total_count]}.first.count, count, model),
                      count_type: count[:new_count].to_s} )
    return (total_count + new_count).html_safe
  end

  def stat_link(count, link_query, model)
    if count == 0
      return content_tag(:div, count, class: 'stat_link')
    else
      model = model_name_class(model).pluralize
      return link_to(count, send("#{model}_path") + "?scope[flag]=single||flag", class: 'stat_link')
    end
  end

  private

  def case_link_dashboard_title(child)
    child_name = child[:hidden_name] ? '*****' : child[:name]
    text = [child[:short_id], child_name, field_format_date(child[:date])]
    "#{text.compact.join(" - ")}"
  end

  def incident_link_dashboard_title(incident)
    text = [incident[:short_id], field_format_date(incident[:date])]
    "#{text.compact.join(" - ")}"
  end

  def model_name(record)
    model = record[:record_type].present? ? record[:record_type] : record.class.name.underscore
    model = "case" if model == "child"
    model
  end

  def model_name_class(model_class)
    model = model_class.name.underscore
    model = "case" if model == "child"
    model
  end

end
