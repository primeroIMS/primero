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

  def list_view_header(record)
    case record
      when "case"
        list_view_header_case
      when "incident"
        list_view_header_incident
      when "tracing_request"
        list_view_header_tracing_request
      else
        []
    end
  end

  def index_fields_to_show(header_list)
    fields_to_show = []
    header_list.each {|hl| fields_to_show << hl[:sort_title]}
    return fields_to_show
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

        if filter_value(filter)
          checked = true if filter_value(filter).split(',').include? item.gsub('_', '')
        end

        concat(check_box_tag filter, item, nil, id: "#{filter}_#{item}",
            filter_type: filter_type, checked: checked)
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

  def build_filter_location(title, filter)
    options = [I18n.t("fields.select_box_empty_item"), ''] + Location.all.all.map{|loc| [loc.name, loc.name]}
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(select_tag filter,
             options_for_select(options, filter_value(filter)),
             'class' => 'chosen-select',
             'filter_type' => 'location',
             'data-placeholder' => t("fields.chosen_placeholder"), :id => filter)
    end
  end

  def filter_value(filter)
    value = nil
    if params['scope'].present?
      value = params['scope'][filter]
    end
  end
  
  private

  def list_view_header_case
    header_list = []

    header_list << {title: 'id', sort_title: 'short_id'}
    header_list << {title: 'name', sort_title: 'sortable_name'} if (@is_cp && !@is_manager)
    header_list << {title: 'survivor_code', sort_title: 'survivor_code_no'} if (@is_gbv && !@is_manager)
    header_list << {title: 'age', sort_title: 'age'} if @is_cp
    header_list << {title: 'sex', sort_title: 'sex'} if @is_cp
    header_list << {title: 'registration_date', sort_title: 'registration_date'} if @is_cp
    header_list << {title: 'case_opening_date', sort_title: 'created_at'} if @is_gbv
    header_list << {title: 'photo', sort_title: 'photo'} if @is_cp
    header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager

    return header_list
  end

  def list_view_header_incident
    header_list = []

    #TODO - do I need to handle Incident Code???
    header_list << {title: 'id', sort_title: 'short_id'}

    header_list << {title: 'date_of_interview', sort_title: 'date_of_first_report'} if @is_gbv
    header_list << {title: 'date_of_incident', sort_title: 'date_of_incident'}
    header_list << {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'} if @is_gbv
    header_list << {title: 'incident_location', sort_title: 'incident_location'} if @is_mrm
    header_list << {title: 'violations', sort_title: 'violations'} if @is_mrm
    header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager

    return header_list
  end

  def list_view_header_tracing_request
    return [
        {title: 'id', sort_title: 'short_id'},
        {title: 'name_of_inquirer', sort_title: 'relation_name'},
        {title: 'date_of_inquiry', sort_title: 'inquiry_date'}
    ]
  end

end