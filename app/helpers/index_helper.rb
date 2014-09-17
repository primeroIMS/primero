module IndexHelper
  def index_highlighted_case_name(highlighted_fields, record)
    #TODO - find better way to do this... without using highlighted fields
    highlighted_fields.each do |relevant_field|
      if relevant_field.visible?
        if relevant_field.hidden_text_field && record.hidden_name
          return I18n.t("cases.hidden_text_field_text")
        else
          return record[relevant_field[:name]]
        end
      end
    end
  end

  def list_view_header(record, current_modules)
    case record
      when "case"
        list_view_header_case current_modules
      when "incident"
        list_view_header_incident current_modules
      when "tracing_request"
        list_view_header_tracing_request
      else
        []
    end
  end

  def build_checkboxes(filter, items, type, format = true, filter_type = nil)
    content_tag :div, class: "filter-controls #{'field-controls-multi' if type}" do
      items.each do |item|
        if item.is_a?(Hash)
          key = item.keys.first
          label = item[key]
          item = key.to_s
        else
          label = item
        end

        label = label.gsub('_', ' ').split.map(&:capitalize).join(' ')

        if format
          item = item.gsub('_', ' ')
        end

        #TODO: Temp removing. Need to make defaults sync with front-end js
        # if @scope[filter].present?
        # checked = true if @scope[filter].include? item.gsub('_', '')
        # end

        concat(check_box_tag filter, item, nil, id: "#{filter}_#{item}",
                             filter_type: filter_type)
        concat(label_tag "#{filter}_#{item}", label)
        concat('<br>'.html_safe)
      end
    end
  end

  def build_filter_checkboxes(title, filter, items, type = false, format = true, filter_type = nil )
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_checkboxes(filter, items, type, format, filter_type))
    end
  end

  def build_datefield(filter)
    content_tag :div, class: 'filter-controls' do
      concat(text_field_tag filter, nil, class: 'form_date_field')
    end
  end

  def build_filter_date(title, filter)
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_datefield(filter))
    end
  end

  private

  def list_view_header_case(current_modules)
    is_manager = @current_user.is_manager?
    is_cp = current_modules.select {|m| m.name == "CP"}.count > 0
    is_gbv = current_modules.select {|m| m.name == "GBV"}.count > 0

    header_list = [
      {title: nil, sort_title: 'flag'}
    ]

    header_list << {title: 'social_worker', sort_title: 'owned_by_text'} if is_manager
    header_list << {title: 'id', sort_title: 'short_id'}
    header_list << {title: 'name', sort_title: 'sortable_name'} if (is_cp && !is_manager)
    header_list << {title: 'survivor_code', sort_title: 'survivor_code_no'} if (is_gbv && !is_manager)
    header_list << {title: 'age', sort_title: 'age'} if is_cp
    header_list << {title: 'sex', sort_title: 'sex'} if is_cp
    header_list << {title: 'registration_date', sort_title: 'registration_date'} if is_cp
    header_list << {title: 'interview_date', sort_title: 'interview_date'} if is_gbv
    header_list << {title: 'photo', sort_title: 'photo'} if is_cp

    return header_list
  end

  def list_view_header_incident(current_modules)
    return [
        {title: nil, sort_title: 'flag'},
        {title: 'id', sort_title: 'short_id'},
        {title: 'survivor_code', sort_title: 'survivor_code'},
        {title: 'case_worker_code', sort_title: 'caseworker_code'},
        {title: 'date_of_interview', sort_title: 'date_of_first_report'},
        {title: 'date_of_incident', sort_title: 'start_date_of_incident_from'},
    ]
  end

  def list_view_header_tracing_request
    return [
        {title: nil, sort_title: 'flag'},
        {title: 'id', sort_title: 'short_id'},
        {title: 'name_of_inquirer', sort_title: 'relation_name'},
        {title: 'date_of_inquiry', sort_title: 'inquiry_date'}
    ]
  end
end