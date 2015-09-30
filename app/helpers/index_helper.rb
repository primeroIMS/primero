module IndexHelper
  def index_case_name(record)
    if record.hidden_name
      I18n.t("cases.hidden_text_field_text")
    else
      record.name
    end
  end

  # def index_highlighted_case_name(highlighted_fields, record)
  #   #TODO - find better way to do this... without using highlighted fields
  #   highlighted_fields.each do |relevant_field|
  #     if relevant_field.visible?
  #       if relevant_field.hidden_text_field && record.hidden_name
  #         return I18n.t("cases.hidden_text_field_text")
  #       else
  #         return record[relevant_field[:name]]
  #       end
  #     end
  #   end
  # end

  def list_view_header(record)
    case record
      when "case"
        list_view_header_case
      when "incident"
        list_view_header_incident
      when "tracing_request"
        list_view_header_tracing_request
      when "report"
        list_view_header_report
      else
        []
    end
  end

  def index_fields_to_show(header_list)
    fields_to_show = []
    header_list.each {|hl| fields_to_show << hl[:sort_title]}
    return fields_to_show
  end

  def index_filters_to_show(record)
    case record
      when "case"
        index_filters_case
      when "incident"
        index_filters_incident
      when "tracing_request"
        index_filters_tracing_request
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

        if format
          item = item.gsub('_', ' ')
        end

        if filter_value(filter)
          checked = true if filter_value(filter).include? item.gsub('_', '')
        end

        concat(label_tag("#{filter}_#{item}",
          check_box_tag(filter, item, nil, id: "#{filter}_#{item.gsub(' ', '_')}",
                  filter_type: filter_type, checked: checked) +
          content_tag(:span, label)
        ))
      end
    end
  end

  def build_filter_checkboxes(title, filter, items, type = false, format = true, filter_type = "list" )
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_checkboxes(filter, items, type, format, filter_type))
      concat(content_tag(:div, '', class: 'clearfix'))
    end
  end

  def build_datefield(filter)
    content_tag :div, class: 'filter-controls' do
      concat(text_field_tag filter, nil, class: 'form_date_field', autocomplete: false)
    end
  end

  def build_filter_date(title, filter)
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_datefield(filter))
    end
  end

  def build_filter_location(title, filter)
    options = [[I18n.t("fields.select_box_empty_item"), '']] + Location.all.all.map{|loc| [loc.name, loc.name]}
    value = filter_value(filter)
    value = value.pop if value
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(select_tag filter,
             options_for_select(options, value),
             'class' => 'chosen-select',
             'filter_type' => 'location',
             'data-placeholder' => t("fields.select_box_empty_item"), :id => filter)
    end
  end

  def filter_value(filter)
    value = nil
    if @filters[filter].present?
      value = @filters[filter][:value]
      value = [value] unless value.is_a? Array
    end
    value.map{|v| v.to_s} if value
  end

  def violation_type_list
    violation_types = []

    violation_hash = Incident.violation_id_fields
    violation_hash.keys.each {|key| violation_types << { key => I18n.t("incident.violation.#{key}") } } if violation_hash.present?
    return violation_types
  end

  def build_list_field_by_model(model_class)
    #list_view_header returns the columns that are showed in the index page.
    model = model_class.name.underscore == "child" ? "case": model_class.name.underscore
    list_view_fields = { :type => model, :fields => {} }
    list_view_header(model).each do |header|
      if header[:title].present? && header[:sort_title].present?
        list_view_fields[:fields].merge!({ header[:title].titleize => header[:sort_title] })
      end
    end
    list_view_fields
  end

  private

  def list_view_header_case
    header_list = []

    header_list << {title: '', sort_title: 'select'}
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

    header_list << {title: '', sort_title: 'select'}
    #TODO - do I need to handle Incident Code???
    header_list << {title: 'id', sort_title: 'short_id'}

    header_list << {title: 'date_of_interview', sort_title: 'date_of_first_report'} if @is_gbv
    header_list << {title: 'date_of_incident', sort_title: 'incident_date_derived'}
    header_list << {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'} if @is_gbv
    header_list << {title: 'incident_location', sort_title: 'incident_location'} if @is_mrm
    header_list << {title: 'violations', sort_title: 'violations'} if @is_mrm
    header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager

    return header_list
  end

  def list_view_header_tracing_request
    return [
        {title: '', sort_title: 'select'},
        {title: '', sort_title: 'flag'},
        {title: 'id', sort_title: 'short_id'},
        {title: 'name_of_inquirer', sort_title: 'relation_name'},
        {title: 'date_of_inquiry', sort_title: 'inquiry_date'},
        {title: 'tracing_requests', sort_title: 'tracing_names'}
    ]
  end

  def list_view_header_report
    [
      #{title: '', sort_title: 'select'},
      {title: 'name', sort_title: 'name'},
      {title: 'description', sort_title: 'description'},
      {title: '', sort_title: ''},
    ]
  end

  def index_filters_case
    filters = []
    #get the id's of the forms sections the user is able to view/edit.
    allowed_form_ids = @current_user.modules.map{|m| FormSection.get_allowed_form_ids(m, @current_user)}.flatten
    #Retrieve the forms where the field name appears and if is in the allowed for the user.
    #TODO should look on subforms? for now lookup on top forms.
    field_names = ["gbv_displacement_status", "protection_status", "urgent_protection_concern"]
    forms = FormSection.fields(:keys => field_names)
                  .all.select{|fs| fs.parent_form == "case" && !fs.is_nested && allowed_form_ids.include?(fs.unique_id)}

    filters << "Flagged"
    filters << "Mobile" if @is_cp
    filters << "Social Worker" if @is_manager
    filters << "Status"
    filters << "Age Range"
    filters << "Sex"
    filters << "GBV Displacement Status" if @is_gbv && visible_filter_field?("gbv_displacement_status", forms)
    filters << "Protection Status" if visible_filter_field?("protection_status", forms)
    filters << "Urgent Protection Concern" if @is_cp && visible_filter_field?("urgent_protection_concern", forms)
    filters << "Risk Level" if @is_cp
    filters << "Current Location" if @is_cp
    filters << "Registration Date" if @is_cp
    filters << "Case Open Date" if @is_gbv
    filters << "Record State"
    filters << "Photo" if @is_cp

    return filters
  end

  def index_filters_incident
    filters = []

    filters << "Flagged"
    filters << "Violation" if @is_mrm
    filters << "Violence Type" if @is_gbv
    filters << "Social Worker" if @is_manager
    filters << "Status"
    filters << "Age Range"
    filters << "Children" if @is_mrm
    filters << "Verification Status" if @is_mrm
    filters << "Incident Location"
    filters << "Incident Date"
    filters << "Protection Status" if @is_gbv
    filters << "Armed Force or Group" if @is_mrm
    filters << "Armed Force or Group Type" if @is_mrm
    filters << "Record State"

    return filters
  end

  def index_filters_tracing_request
    filters = []
    filters << "Flagged"
    filters << "Field/Case/Social Worker" if @is_manager
    filters << "Date of Inquiry"
    filters << "Inquiry Status"
    filters << "Separation Location"
    filters << "Separation Cause"
    #filters << "Sex"
    #filters << "Age"
    filters << "Record State"

    return filters
  end

  def visible_filter_field?(field_name, forms)
    return false if forms.blank?
    fields = forms.map{|fs| fs.fields.select{|f| f.name == field_name} }.flatten
    #TODO what if this is a shared field?
    #TODO what if the field is on different modules like "sex"
    #     and the user is able to access both modules
    #For now any visible field will display the filter. 
    #Not an issue when the field exist only one time.
    #Not sure how that will work for shared field or if the user can access several modules
    #and the field exists on those modules, in that case the filter will be display if
    #visible for any of the modules.
    fields.any?{|f| f.visible?}
  end

end
