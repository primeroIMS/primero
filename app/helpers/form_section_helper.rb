module FormSectionHelper
  include FieldsHelper
  ALERT_PREFIX = "<sup id='new_incident_details'>!</sup>"
  TYPE = 'type'
  ALERT_FOR = 'alert_for'
  FORM_SIDEBAR_ID = 'form_sidebar_id'

  def show_alerts?(record)
    (@system_settings.try(:[], 'show_alerts') || false) && record.try(:alerts).present?
  end

  def form_has_alerts?(record, form_id)
    record.alerts.any?{|alert| alert.form_sidebar_id == form_id}
  end

  def sorted_highlighted_fields
    FormSection.sorted_highlighted_fields
  end

  def url_for_form_section_field(form_section_id, field)
    (field.new? || field.name.blank?) ? form_section_fields_path(form_section_id) : form_section_field_path(form_section_id, field.name)
  end

  def url_for_form_section(form_section)
    form_section.new? ? form_sections_path : form_section_path(form_section.unique_id)
  end

  # If multiple forms in a group, display the form group name with the forms grouped below
  # If only 1 form in a group, just display the form name and link directly to it
  def build_form_tabs(forms, show_summary = false, lookups)
    form = forms.first
    if forms.count > 1
      group_name = raw(form.form_group_name(lookups: lookups) + group_alert_prefix(forms))
      content_tag :li, class: 'group' do
        concat(
          link_to("#tab_#{form.section_name}", class: 'group',
            data: { violation: form.is_violations_group? ? true : false }) do
            concat(group_name)
          end
        )
        concat(build_group_tabs(forms))
      end
    else
      content_tag :li, class: "#{init_tab(form, show_summary)}" do
        form_name = build_form_name(form)
        concat(
          link_to("#tab_#{form.section_name}", class: 'non-group') do
            concat(form_name)
          end
        )
      end
    end
  end

  def build_group_tabs(forms)
    group_id = "group_" + forms[0].form_group_id
    content_tag :ul , class: 'sub', id: group_id do
      for form in forms
        section_name = build_form_name(form)
        concat(content_tag(:li,
          link_to("#tab_#{form.section_name}") do
            concat(section_name)
          end, class: "#{form.is_first_tab ? 'current': ''}"
        ))
      end
    end
  end

  def build_form_name(form)
    form_name = form.name
    if show_alerts?(@child)
      #TODO: currently filtering for service provider details form field changes only
      has_service_field_alert = @child.alerts.any? {|alert| alert[TYPE].try(:include?, 'service_provider_details_') && form.unique_id == alert[TYPE] && alert[ALERT_FOR] == Alertable::FIELD_CHANGE}

      if @child.alerts.any? {|u| u[FORM_SIDEBAR_ID] == form.unique_id} || has_service_field_alert
        form_name = raw(form_name + ALERT_PREFIX)
      end
    end

    return form_name
  end

  def group_alert_prefix(forms)
    alert = ''
    if show_alerts?(@child)
      forms.each do |form|
        #TODO: currently filtering for service provider details form field changes only
        has_service_field_alert = @child.alerts.any? {|alert| alert[TYPE].try(:include?, 'service_provider_details_') && form.unique_id == alert[TYPE] && alert[ALERT_FOR] == Alertable::FIELD_CHANGE}
        if @child.alerts.any? {|u| u[FORM_SIDEBAR_ID] == form.unique_id} || has_service_field_alert
          alert = ALERT_PREFIX
        end
        break if alert != ''
      end
    end

    return alert
  end

  def init_tab(form, show_summary)
    if show_summary && form.section_name == 'mrm_summary_page' || form.is_first_tab
      "current"
    else
      ""
    end
  end

  def subform_placeholder(field, subform, editing=false)
    if field.base_doc.is_violation?
      t("incident.violation.violation")
    else
      form_string, translation_node = editing ? [subform.form.name, 'editing_subforms'] : [subform.display_name, 'subforms']
      t("placeholders.#{translation_node}", form: form_string)
    end
  end

  #Returns a hash of tuples {subform_group_label => [subform_object, index]}.
  def grouped_subforms(formObject, subform_field, shared_group_id=nil, shared_subform_id=nil)
    objects = formObject.try(subform_field.name).presence || formObject.try(:[], shared_group_id).try(:[], shared_subform_id)
    if objects.present?
      objects = objects.map.with_index{|o,i| [o,i]}
      subform_group_by_field = subform_field.subform_group_by_field
      if subform_group_by_field.present?
        subform_group_by_values = subform_field.subform_group_by_values
        #This bit of non-Ruby contortion is done to assure ordering:
        #  1. The groups need to be in the same order as the lookup
        #  2. Within each group, the object order is determined by the sort field
        groups = subform_group_by_values.map{|_,v| [v,[]]}.to_h
        groups[''] = []
        objects.each do |object|
          group_label = object.first.try(subform_group_by_field.name)
          group_label = subform_group_by_values[group_label] || ''
          groups[group_label] << object #if groups.key?(group_label)
        end
        objects = groups.map{|k,group| [k, group.sort_by{|o| o[1].try(subform_field.subform_sort_by)}]}.to_h
      else
        objects = {'' => objects} #objects are already pre-sorted
      end
    else
      objects = {}
    end
    return objects
  end

  def display_approval_alert(formObject, section)
    display_alert = nil
    alerts_config = @system_settings.try(:approval_forms_to_alert)
    if alerts_config.present?
      alert_type = alerts_config[section.section_name]
      display_alert = alert_type.present? && formObject.alerts.any?{|a| a[TYPE] == alert_type} ? section.name : nil
    end

    return display_alert
  end

  def display_field_change_alert(formObject, section)
    display_alert = nil
    #TODO: currently filtering for service provider details form field changes only
    found_alerts = formObject.alerts.select {|alert| alert[TYPE].try(:include?, 'service_provider_details_') && section.unique_id == alert[TYPE] && alert[ALERT_FOR] == Alertable::FIELD_CHANGE}
    if found_alerts.present?
      found_alert = found_alerts.max_by(&:date)
      display_alert = {name: section["name_#{I18n.locale}"], date: field_format_date(Date.parse(found_alert.date))}
    end
    return display_alert
  end

  def display_transfer_request_alert(formObject, section)
    found_alert = formObject&.alerts&.select{|alert| alert.type == 'transfer_request' && section.unique_id == alert.form_sidebar_id}&.first
    return nil if found_alert.blank?
    {date: field_format_date(Date.parse(found_alert.try(:date))), user: found_alert.try(:user), agency: found_alert.try(:agency)}
  end

  def display_help_text_on_view?(formObject, form_section)
    return false unless form_section.display_help_text_view

    # This is a verification whether *_documents section is empty
    # bia_documents are stored in a property bia_documents,
    # same thing with bid_documents and other_documents
    if form_section.unique_id.include? "documents"
      return formObject[form_section.unique_id].blank?
    end

    field = form_section.fields.first
    if field
      if field.type == Field::SUBFORM
        #If subform is the only field in the form and the first, check is is empty.
        if form_section.is_violations_group?
          return formObject[form_section.form_group_id][field.name].blank?
        else
          return formObject[field.name].blank?
        end
      else
        #There is no straightforward way to know that "Audio and Photo" or "Other Documents" section are empties
        #So, the verification relies on the hardcoded attributes "recorded_audio" and "current_photo_key".

        if field.type == Field::PHOTO_UPLOAD_BOX
          #assumed we are on "Audio and Photo" because the first field is PHOTO_UPLOAD_BOX
          blank = formObject["current_photo_key"].blank?
          #assumed the section has two fields and the last one is AUDIO_UPLOAD_BOX.
          f_last = form_section.fields.last
          if f_last.type == Field::AUDIO_UPLOAD_BOX
            blank = blank && formObject["recorded_audio"].blank?
          end
          return blank
        end
      end
    end
    #If there is no field in the section, assumed as invalid section, section should have at least one field.
    false
  end

end
