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

  def index_admin_only
    access = []
    if can? :manage, FormSection
      access.append(link_to t("dashboard.forms"), form_sections_path, {style:'font-weight: bold;', class: current_menu("forms")})
    end
    if can? :edit, Role or can? :edit, UserGroup
      access.append(link_to t("dashboard.users"), users_path, {style:'font-weight: bold;', class: current_menu("users")})
    end

    if access.present?
      links = access.to_sentence
      I18n.t("dashboard.admin_only", links: links).html_safe
    end
  end

  #TODO - refactor... move query logic to dashboard model
  #TODO - i18n
  def case_count(stat_group, query, model)
    if query.present?
      results = query.facet(stat_group[:name]).rows
      total = results.select{|v| v.value == stat_group[:stat]}.first.count
    else
      total = stat_group[:count]
    end
    total = 0 if total.blank?
    link = stat_link(total, stat_group, model)
    return { count: total, stat: link, stat_type: stat_group[:stat_type], case_worker: stat_group[:case_worker] }
  end

  def case_stat(stat_group, query, model)
    if query.present?
      results = query.facet(stat_group[:name]).rows
      totals = results.select{|v| v.value == stat_group[:stat]}
      total = totals.present? ? totals.first.count : 0
    else
      total = stat_group[:count]
    end
    total = 0 if total.blank?
    return total
  end

  def pivot_case_stat(stat_group, queries={}, group)
    query = queries[group]

    if query.present?
      results = query.facet_response['facet_pivot'].values.first
      sub_group = results.select{|v| v["value"] == stat_group[:name]}.first
      if sub_group.present?
        pivot = sub_group["pivot"].select{|v| v["value"] == stat_group[:stat]}.first
        if pivot.present?
          total = pivot["count"]
        end
      end
    end
    total = 0 if total.blank?
    return total
  end

  def display_stat(data={})
    model = model_name_class(data[:model]).pluralize
    count = if data[:name].present? && data[:stats].present?
      case_stat({name: data[:name], stat: data[:stat]}, data[:stats], data[:model])
    else
      data[:stat] || 0
    end

    link_to send("#{model}_path") + index_filters(data[:filters]), class: 'column section-stat' do
      content_tag :div, class: "stats" do
        content_tag(:div, count, class: 'stat') +
        content_tag(:p, data[:text])
      end
    end
  end

  def inner_value(data)
    if data[:pivoted].present?
      total = pivot_case_stat({name: data[:name], stat: data[:stat]}, data[:stats], :total)
      concat(content_tag(:div, total, class: 'count'))
    elsif data[:stat].present?
      concat(content_tag(:div, case_stat({name: data[:name], stat: data[:stat]}, data[:stats], data[:model]), class: 'count'))
    end
    concat(content_tag(:span, data[:text], class: 'label primary'))
  end

  def display_stat_detailed(data={})
    model = model_name_class(data[:model]).pluralize
    model_path = send("#{model}_path")

    content_tag :div, class: 'row section-stat-detailed align-middle' do
      #TODO: Checks for filters to decide if it is a link. None of these dashboard sections represent the full case list now but if that changes we may want to add an explicit property to signify no link.
      if data[:filters].present?
        total_stat = link_to(model_path + index_filters(data[:filters])) do
          inner_value(data)
        end
      else
        total_stat = content_tag('div', class: 'no_link') do
          inner_value(data)
        end
      end

      concat(content_tag(:div, total_stat, class: "column shrink"))
      concat(content_tag(:ul) {
        data[:additional_details].each do |detail|
          if data[:pivoted].present?
            count = pivot_case_stat({name: data[:name], stat: data[:stat]}, data[:stats], detail[:group])
          else
            count = case_stat({name: data[:name], stat: detail[:stat]}, data[:stats], data[:model])
          end
          detail_link = link_to model_path + index_filters(detail[:filters]) do
            concat(count)
            concat(content_tag(:span, detail[:text]))
          end
          concat(content_tag(:li, detail_link, class: "additional-detail"))
        end
      })
    end
  end

  def stat_link(total, stat_group, model)
    if total.present? && total > 0
      model = model_name_class(model).pluralize
      filter = stat_group[:filter] || ''
      return link_to(total, send("#{model}_path") + filter, class: 'stat_link')
    else
      return content_tag(:div, 0, class: 'stat_link')
    end
  end

  def location_display(location_code)
    lct = Location.find_by_location_code(location_code.upcase)
    location_text = (lct.present? ? lct.placename : '')
  end

  def build_reporting_location_stat_link(stat, filters=nil, model, reporting_location, admin_level)
    if stat.nil?
      return stat
    else
      model = model_name_class(model).pluralize
      return link_to(stat, send("#{model}_path") + index_filters(filters, reporting_location, admin_level), class: 'stat_link')
    end
  end

  def index_filters(filters, reporting_location='owned_by_location', admin_level=2)
    list = []
    index_filters_list = {
      child_status: "scope[child_status]=list||",
      new: "scope[last_updated_by]=neg||#{current_user.user_name}",
      referred_users: "scope[assigned_user_names]=list||#{current_user.user_name}",
      referred_user: "scope[assigned_user_names]=list||",
      risk_level: "scope[risk_level]=list||",
      record_state: "scope[record_state]=list||",
      location: "scope[location_current]=location||",
      reporting_location: "scope[#{reporting_location}#{admin_level}]=list||",
      created_at: "scope[created_at]=date_range||",
      date_closure: "scope[date_closure]=date_range||",
      owned_by: "scope[owned_by]=list||",
      new_owned_by: "scope[last_updated_by]=neg||",
      new_other: "scope[not_edited_by_owner]=single||true",
      user: "scope[associated_user_names]=list||",
      protection_concern: "scope[protection_concerns]=list||",
      approval_status_bia: "scope[approval_status_bia]=list||",
      approval_status_case_plan: "scope[approval_status_case_plan]=list||",
      approval_status_closure: "scope[approval_status_closure]=list||",
      bia_approved_date: "scope[bia_approved_date]=date_range||",
      case_plan_approved_date: "scope[case_plan_approved_date]=date_range||",
      closure_approved_date: "scope[closure_approved_date]=date_range||",
      transfer_status: "scope[transfer_status]=list||",
      transferred_to_users: "scope[transferred_to_users]=list||#{current_user.user_name}",
      current_alert_types: "scope[current_alert_types]=list||",
      workflow: "scope[workflow]=list||",
      workflow_status: "scope[workflow_status]=list||",
      service_due_dates: "scope[service_due_dates]=date_range||",
      reassigned_tranferred_on: "scope[reassigned_tranferred_on]=date_range||",
      case_plan_due_dates: "scope[case_plan_due_dates]=date_range||#{overdue}",
      assessment_due_dates: "scope[assessment_due_dates]=date_range||#{overdue}",
      followup_due_dates: "scope[followup_due_dates]=date_range||#{overdue}"
    }
    filters.each do |filter|
      filter = filter.split('=')
      if filter.size > 1
        value = filter.last
        if value.present?  && value != 'nil'
          list << index_filters_list[filter.first.to_sym] + value
        end
      elsif
        list << index_filters_list[filter.first.to_sym]
      end
    end
    return "?" + list.join('&')
  end

  def one_hour_overdue
    "#{DateTime.new(1,1,1).strftime("%d-%b-%Y %H:%M")}.#{1.hour.from_now.strftime("%d-%b-%Y %H:%M")}"
  end

  def three_hours_overdue
    "#{DateTime.new(1,1,1).strftime("%d-%b-%Y %H:%M")}.#{3.hours.from_now.strftime("%d-%b-%Y %H:%M")}"
  end

  def overdue
    "#{DateTime.new(1,1,1).strftime("%d-%b-%Y %H:%M")}.#{DateTime.now.strftime("%d-%b-%Y %H:%M")}"
  end

  def near_due
    "#{DateTime.now.strftime("%d-%b-%Y %H:%M")}.#{24.hours.from_now.strftime("%d-%b-%Y %H:%M")}"
  end

  def last_week
    return "#{1.week.ago.beginning_of_week.strftime("%d-%b-%Y")}.#{1.week.ago.end_of_week.strftime("%d-%b-%Y")}"
  end

  def this_week
    return "#{DateTime.now.beginning_of_week.strftime("%d-%b-%Y")}.#{DateTime.now.end_of_week.strftime("%d-%b-%Y")}"
  end

  def last_ten_days
    return "#{(DateTime.now - 10.days).strftime("%d-%b-%Y")}.#{(DateTime.now + 1.day).strftime("%d-%b-%Y")}"
  end

  private

  def case_link_dashboard_title(child)
    child_name = child[:hidden_name] ? '*****' : child[:name]
    text = [child[:short_id], child_name, field_format_date(child[:created_at])]
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

  def build_dashboard_risk_details(overdue_details=false)
    details = []
    @risk_levels.each do | risk_level|
      rl = {
        stat: risk_level.to_sym,
        filters: [
          "child_status=#{Record::STATUS_OPEN}",
          "risk_level=#{risk_level}",
          'record_state=true',
          "owned_by=#{current_user.user_name}"
        ],
        text: t("dashboard.#{risk_level}_risk")
      }

      rl[:filters] << "reassigned_tranferred_on=#{one_hour_overdue}" if overdue_details

      details << rl
    end
    details
  end

end
