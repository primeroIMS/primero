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

  def case_count(stat_group, query, model)
    results = query.facet(stat_group[:name]).rows
    total = results.select{|v| v.value == stat_group[:stat]}.first.count
    link = stat_link(total, stat_group, model)
    return { count: total, stat: link, stat_type: stat_group[:stat_type] }
  end

  def stat_link(total, stat_group, model)
    if total == 0
      return content_tag(:div, total, class: 'stat_link')
    else
      model = model_name_class(model).pluralize
      filter = stat_group[:filter] || ''
      return link_to(total, send("#{model}_path") + filter, class: 'stat_link')
    end
  end

  def index_filters(filters)
    list = []
    index_filters_list = {
      child_status: "scope[child_status]=list||Open",
      new: "scope[last_updated_by]=neg||#{current_user.user_name}",
      referred_users: "scope[referred_users]=list||#{current_user.user_name}",
      risk_level: {
        high: "scope[risk_level]=list||High",
        medium: "scope[risk_level]=list||Medium",
        low: "scope[risk_level]=list||Low"
      }
    }
    filters.each do |filter|
      filter = filter.split(':')
      if filter.size > 1
        list << index_filters_list[filter.first.to_sym][filter.last.to_sym]
      elsif
        list << index_filters_list[filter.first.to_sym]
      end
    end
    return "?" + list.join('&')
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
