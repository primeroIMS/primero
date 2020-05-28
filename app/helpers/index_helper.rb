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
      when "potential_match"
        list_view_header_potential_match
      when "bulk_export"
        list_view_header_bulk_export
      when "task"
        list_view_header_task
      when "audit_log"
        list_view_audit_log
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
      when "potential_match"
        index_filters_potential_match
      else
        []
    end
  end

  def build_checkboxes(filter, items, type, format = true, filter_type = nil)
    content_tag :div, class: "filter-controls #{'field-controls-multi' if type} row align-middle" do
      items.each do |item|
        if item.is_a?(Hash)
          if(item['id'].present? && item['display_text'].present?)
            format = false
            label = item['display_text']
            item = item['id']
          else
            key = item.keys.first
            if item[key].is_a?(Hash)
              label = item[key][:label]
              item = item[key][:value]
            else
              label = item[key]
              item = key.to_s
            end
          end
        else
          label = item.split('::').last
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

  def build_checkboxes_group(items, group_name = nil)
    content_tag :div, class: "filter-controls row align-middle" do
      items.each do |item|
        key = item.keys.first
        id = item[key][:id].present? ? item[key][:id] : key
        value = item[key][:value]
        label = item[key][:label]

        name, filter_type = if group_name.present?
          ["#{group_name}[#{key}]", "or_op"]
        else
          [key, "single"]
        end

        concat(
          label_tag(id,
            check_box_tag(name, value, nil, id: id, filter_type: filter_type) +
            content_tag(:span, label)
          )
        )
      end
    end
  end

  def build_filter_checkboxes_group(title, items, group_name = nil)
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_checkboxes_group(items, group_name))
      concat(content_tag(:div, '', class: 'clearfix'))
    end
  end

  def build_filter_select(title, filter, items, multi_select = true)
    if items.present? && items.first.is_a?(Hash)
      items = items.map{|item| [item['display_text'], item['id']]}
    end

    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(select_tag filter, options_for_select(items), class: 'chosen-select', filter_type: 'list',
                        multiple: multi_select, include_blank: t("fields.select_box_empty_item"),
                        'data-placeholder' => t("fields.select_box_empty_item"), id: filter)
      concat(content_tag(:div, '', class: 'clearfix'))
    end
  end

  def build_datefield(filter)
    content_tag :div, class: 'filter-controls row align-middle' do
      concat(text_field_tag filter, nil, class: 'form_date_field', autocomplete: false)
    end
  end

  def build_filter_date(title, filter)
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(build_datefield(filter))
    end
  end

  # The location options are now populated by ajax
  def build_filter_location(title, filter)
    value = filter_value(filter)
    value = value.pop if value
    content_tag :div, class: 'filter' do
      concat(content_tag(:h3, title))
      concat(select_tag filter,
             options_for_select([], value),
             'class' => 'chosen-select',
             'filter_type' => 'location',
             'data-placeholder' => t("fields.select_box_empty_item"), :id => filter,
             'data' => { :field_tags => [], :populate => 'Location', value: value}
             )
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

  def build_list_field_by_model(model_name, user)
    #Necessary when calling this method from csv_exporter_list_view
    if @current_user != user
      @is_admin ||= user.is_admin?
      @is_manager ||= user.is_manager?
      @is_cp ||= user.has_module?(PrimeroModule::CP)
      @is_gbv ||= user.has_module?(PrimeroModule::GBV)
      @is_mrm ||= user.has_module?(PrimeroModule::MRM)
    end

    #list_view_header returns the columns that are showed in the index page.
    model = model_name.underscore
    model = "case" if model == "child"
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
    header_list << {title: 'name', sort_title: 'sortable_name'} if (@is_cp && !@is_manager && !@id_search.present?)
    header_list << {title: 'survivor_code', sort_title: 'survivor_code_no'} if (@is_gbv && !@is_manager)
    header_list << {title: 'age', sort_title: 'age'} if @is_cp || @id_search.present?
    header_list << {title: 'sex', sort_title: 'sex'} if @is_cp || @id_search.present?
    header_list << {title: 'registration_date', sort_title: 'registration_date'} if @is_cp && !@id_search.present?
    header_list << {title: 'case_opening_date', sort_title: 'created_at'} if @is_gbv && !@id_search.present?
    header_list << {title: 'photo', sort_title: 'photo'} if @is_cp && !@id_search.present? && FormSection.has_photo_form
    header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager && !@id_search.present?
    header_list << {title: 'owned_by', sort_title: 'owned_by'} if @is_cp && @id_search.present?
    header_list << {title: 'owned_by_agency', sort_title: 'owned_by_agency'} if @is_cp && @id_search.present?
    header_list << {title: '', sort_title: 'view'} if @id_search.present? && @can_display_view_page

    return header_list
  end

  def list_view_header_incident
    header_list = []

    header_list << {title: '', sort_title: 'select'}
    #TODO - do I need to handle Incident Code???
    header_list << {title: 'id', sort_title: 'short_id'}

    header_list << {title: 'date_of_interview', sort_title: 'date_of_first_report'} if @is_gbv || @is_cp
    header_list << {title: 'date_of_incident', sort_title: 'incident_date_derived'}
    header_list << {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'} if @is_gbv || @is_cp
    header_list << {title: 'incident_location', sort_title: 'incident_location'} if @is_mrm
    header_list << {title: 'violations', sort_title: 'violations'} if @is_mrm
    header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager

    return header_list
  end

  def list_view_header_tracing_request
    return [
        {title: '', sort_title: 'select'},
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

  def list_view_header_potential_match
    [
      {title: 'inquirer_id', sort_title: 'tracing_request_id'},
      {title: 'tr_id', sort_title: 'tr_subform_id'},
      {title: 'child_id', sort_title: 'child_id'},
      {title: 'average_rating', sort_title: 'average_rating'},
    ]
  end

  def list_view_header_bulk_export
    [
      #{title: '', sort_title: 'select'},
      {title: 'file_name', sort_title: 'file_name'},
      {title: 'record_type', sort_title: 'record_type'},
      {title: 'started_on', sort_title: 'started_on'}
    ]
  end

  def list_view_header_task
    [
      #{title: '', sort_title: 'select'},
      {title: 'id', sort_title: 'case_id'},
      {title: 'priority', sort_title: 'priority'},
      {title: 'type', sort_title: 'type'},
      {title: 'due_date', sort_title: 'due_date'}
    ]
  end

  def list_view_audit_log
    [
      {title: 'timestamp', sort_title: 'timestamp'},
      {title: 'user_name', sort_title: 'user_name'},
      {title: 'action', sort_title: 'action_name'},
      {title: 'description', sort_title: 'description'},
      {title: 'record_owner', sort_title: 'record_owner'}
    ]
  end

  def audit_log_description(record)
    record.display_id.present? ? audit_log_description_with_id(record.record_type, record.display_id) : record.record_type
  end

  def audit_log_description_with_id(record_type, display_id)
    if display_id.is_a?(Array)
      content_tag(:ul) do
        concat(content_tag(:lh, record_type.pluralize))
        display_id.each {|id| concat(content_tag(:li, "'#{id}'"))}
      end
    else
      "#{record_type} '#{display_id}'"
    end
  end

  def audit_log_owner(owned_by)
    if owned_by.is_a?(Array)
      content_tag(:ul) do
        #Blank header to align with ID's in the description  -- TODO Is this necessary?
        concat(content_tag(:lh, ''))
        owned_by.each {|owner| concat(content_tag(:li, owner))}
      end
    else
      owned_by
    end
  end

  def index_filters_case
    filters = []
    #get the id's of the forms sections the user is able to view/edit.
    allowed_form_ids = @current_user.modules.map{|m| FormSection.get_allowed_form_ids(m, @current_user)}.flatten
    display_workflow_filter = @current_user.modules.any?{|m| m.workflow_status_indicator.present?}
    #Retrieve the forms where the fields appears and if is in the allowed for the user.
    #TODO should look on subforms? for now lookup on top forms.
    field_names = ["gbv_displacement_status", "protection_status", "urgent_protection_concern", "protection_concerns", "type_of_risk"]
    forms = FormSection.fields(:keys => field_names)
                  .all.select{|fs| fs.parent_form == "case" && !fs.is_nested && allowed_form_ids.include?(fs.unique_id)}

    filters << "Flagged"
    filters << "Mobile" if @can_sync_mobile
    filters << "Social Worker" if @is_manager
    filters << "My Cases"
    filters << "Workflow" if display_workflow_filter
    filters << "Approvals" if @can_approvals && (allowed_form_ids.any?{|fs_id| Approvable::approval_forms.include?(fs_id) })
    #Check independently the checkboxes on the view.
    filters << "cp_bia_form" if allowed_form_ids.include?("cp_bia_form") && @can_approval_bia
    filters << "cp_case_plan" if allowed_form_ids.include?("cp_case_plan") && @can_approval_case_plan
    filters << "closure_form" if allowed_form_ids.include?("closure_form") && @can_approval_closure
    filters << "action_plan_form" if allowed_form_ids.include?("action_plan_form") && @can_approval_case_plan
    filters << "gbv_case_closure_form" if allowed_form_ids.include?("gbv_case_closure_form") && @can_approval_closure

    filters << "Agency" if @is_admin || @is_manager
    filters << "Status"
    filters << "Age Range"
    filters << "Sex"


    field_protection_concerns = forms.map{|fs| fs.fields.find{|f| f.name == "protection_concerns"} }.compact.first
    if field_protection_concerns.present? && @can_view_protection_concerns_filter
      filters << "Protection Concerns"
    end

    filters << "GBV Displacement Status" if @is_gbv && visible_filter_field?("gbv_displacement_status", forms)
    filters << "Protection Status" if visible_filter_field?("protection_status", forms)
    filters << "Urgent Protection Concern" if @is_cp && visible_filter_field?("urgent_protection_concern", forms)
    filters << "Type of Risk" if @is_cp && visible_filter_field?("type_of_risk", forms)
    filters << "Risk Level" if @is_cp
    filters << "Current Location" if @is_cp
    filters << "Agency Office" if @is_gbv
    filters << "User Group" if @is_gbv && @current_user.present? && @current_user.has_user_group_filter?
    filters << "Reporting Location" if @can_view_reporting_filter
    filters << "Dates" if @is_cp
    filters << "Case Open Date" if @is_gbv
    filters << "No Activity"
    filters << "Record State"
    filters << "Photo" if @is_cp && FormSection.has_photo_form

    return filters
  end

  def index_filters_incident
    filters = []

    filters << "Flagged"
    filters << "Mobile" if @can_sync_mobile
    filters << "Violation" if @is_mrm
    filters << "Violence Type" if @is_gbv
    filters << "Social Worker" if @is_manager
    filters << "Agency Office" if @is_gbv
    filters << "User Group" if @is_gbv && @current_user.present? && @current_user.has_user_group_filter?
    filters << "Status"
    filters << "Age Range"
    filters << "Children" if @is_mrm
    filters << "Verification Status" if @is_mrm
    filters << "Incident Location"
    filters << "Dates"
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
    filters << "Dates"
    filters << "Inquiry Status"
    filters << "Separation Location"
    filters << "Separation Cause"
    #filters << "Sex"
    #filters << "Age"
    filters << "Record State"

    return filters
  end

  def index_filters_potential_match
    filters = []
    filters << "Sex"
    filters << "Age Range"
    filters << "Score Range"

    return filters
  end

  def selectable_filter_date_options(record)
    case record
      when "cases"
        selectable_filter_date_options_case
      when "incidents"
        selectable_filter_date_options_incident
      when "tracing_requests"
        selectable_filter_date_options_tracing_request
      else
        []
    end
  end

  def selectable_filter_date_options_case
    options = []
    options << [t('children.selectable_date_options.registration_date'), 'registration_date']
    options << [t('children.selectable_date_options.assessment_requested_on'), 'assessment_requested_on']
    options << [t('children.selectable_date_options.date_case_plan_initiated'), 'date_case_plan']
    options << [t('children.selectable_date_options.closure_approved_date'), 'date_closure']
    options << [t('children.selectable_date_options.created_at'), 'created_at'] if @is_gbv
    return options
  end

  def selectable_filter_date_options_incident
    options = []
    options << [t('incidents.selectable_date_options.date_of_first_report'), 'date_of_first_report'] if @is_gbv
    options << [t('incidents.selectable_date_options.incident_date_derived'), 'incident_date_derived']
    return options
  end

  def selectable_filter_date_options_tracing_request
    options = []
    options << [t('tracing_requests.selectable_date_options.inquiry_date'), 'inquiry_date']
    return options
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

  def translate_location_type(location_types, type)
    if location_types.present? && type.present?
      selected_type = location_types.select{|lt| lt['id'] == type}.first
      selected_type.present? ? selected_type['display_text'] : ''
    end
  end

  def allowed_to_export(exporters)
    exporters.any? { |ex| can?("export_#{ex.id}".to_sym, controller.model_class) }
  end

  # TODO: 1.4 has added permission (Permission::INCIDENT_DETAILS_FROM_CASE).
  # Can diff to figure out differences
  # use https://bitbucket.org/quoin/primero/pull-requests/1955/jor-660-action-button-permission/diff
  def has_index_actions(model)
    actions = [
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::REASSIGN,
      Permission::SYNC_MOBILE,
      Permission::ASSIGN,
      Permission::TRANSFER,
      Permission::REFERRAL,
      Permission::INCIDENT_DETAILS_FROM_CASE,
      Permission::SERVICES_SECTION_FROM_CASE
    ]
    actions.any?{ |p| can?(p.to_sym, model) }
  end

  def has_show_actions(model)
    actions = [
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::REASSIGN,
      Permission::SYNC_MOBILE,
      Permission::ASSIGN,
      Permission::TRANSFER,
      Permission::REFERRAL,
      Permission::REQUEST_APPROVAL_BIA,
      Permission::APPROVE_BIA,
      Permission::INCIDENT_DETAILS_FROM_CASE,
      Permission::SERVICES_SECTION_FROM_CASE,
      'edit',
    ]
    actions.any?{ |p| can?(p.to_sym, model) }
  end

  def view_data(record, form_sections)
    data = [{ display_name: t('child.id'), value: record.short_id }]

    included_fields = [
      'owned_by',
      'record-owner',
      'owned_by_agency',
      'clan_tribe'
    ]

    rejected_fields_types = [
      'photo_upload_box',
      'audio_upload_box'
    ]

    form_sections.each do |n, fs|
      fs.each do |form|
        fields =   form.fields.select{ |field| field.show_on_minify_form || included_fields.include?(field.name) }
                       .reject{ |field|  rejected_fields_types.include? field.type }
        fields.each do |f|
          data << { display_name: f.display_name, value: field_value_for_display(record[f.name], f, @lookups) }
        end
      end
    end

    data
  end
end
