module HomeHelper

  def link_dashboard_title(record)
    model = model_name(record)
    send("#{model}_link_dashboard_title", record)
  end

  # # TODO: Temp until upcoming incident dashboard ticket
  # def link_dashboard_path_incident(record)
  #   model = model_name(record)
  #   send("#{model}_path", id: record)
  # end

  def link_dashboard_path(record)
    model = model_name(record)
    send("#{model}_path", id: record[:record_id] || record)
  end

  def index_link_dashboard_path(model)
    model = model_name_class(model).pluralize
    send("#{model}_path") + "?scope[flag]=single||flag"
  end

  private

  # TODO: Ask about child name
  def case_link_dashboard_title(child)
    text = [child[:short_id], child[:name], field_format_date(child[:date])]
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
