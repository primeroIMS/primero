module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'
  NEW_FORM = 'new_form'
  APPROVAL = 'approval'
  FIELD_CHANGE = 'field_change'
  IGNORED_ROOT_PROPERTIES = %w{
    _force_save
    last_updated_at
    last_updated_by
    last_updated_by_full_name
    histories
  }

  included do
    property :alerts, [Alert], :default => []

    searchable do
      string :current_alert_types, multiple: true
    end

    before_save :remove_alert_on_save
    before_save :add_form_change_alert
  end

  def remove_alert_on_save
    self.remove_alert(self.last_updated_by)
  end

  def current_alert_types
    self.alerts.map {|a| a[:type]}.uniq
  end

  def add_alert(current_user_name, type = nil, form_sidebar_id = nil)
    if current_user_name != self.owned_by && self.alerts != nil
      alert = Alert.new(type: type, date: DateTime.now.to_date, form_sidebar_id: form_sidebar_id, alert_for: NEW_FORM)
      self.alerts << alert
    end
  end

  def remove_alert(current_user_name, type = nil, form_sidebar_id = nil)
    if current_user_name == self.owned_by && self.alerts != nil
      if type.present?
        self.alerts.delete_if{|a| a[:type] == type}
      else
        self.alerts.delete_if{|a| a[:alert_for] == NEW_FORM || a[:alert_for] == FIELD_CHANGE}
      end
    end
  end

  def get_alert(approval_type, system_settings)
    alert_form = nil
    system_settings ||= SystemSettings.current
    if system_settings.present?
      form_to_alert_map = system_settings.approval_forms_to_alert

      if form_to_alert_map.present?
        alert_form = form_to_alert_map.key(approval_type)
      end
    end

    return alert_form
  end

  def add_approval_alert(approval_type, system_settings)
    if !alerts.any?{|a| a.type == approval_type}
      alert = Alert.new(type: approval_type, date: DateTime.now.to_date, form_sidebar_id: get_alert(approval_type, system_settings), alert_for: APPROVAL)
      self.alerts << alert
    end
  end

  def remove_approval_alert(approval_type)
    self.alerts.delete_if{|a| a[:type] == approval_type}
  end

  def append_alert(form)
    Alert.new(type: form, date: Date.current.to_s, form_sidebar_id: form, alert_for: FIELD_CHANGE)
  end

  def append_one_or_more_alerts(is_array, found_forms, form)
    if is_array
      self.alerts += found_forms.map {|form| self.append_alert(form)}
    elsif found_forms.try(:kind_of?, String)
      self.alerts << self.append_alert(found_forms)
    end
  end

  def add_field_alert(current_user_name, type = nil)
    found_forms = @system_settings.try(:changes_field_to_form).try(:[], type)
    found_forms_is_array = found_forms.try(:kind_of?, Array)
    found_alert = self.alerts.find {|alert| (found_forms_is_array && found_forms.include?(alert.type)) || alert.type == found_forms}

    if found_alert.present?
      #If alert already exists, update the date
      found_alert.date = Date.current.to_s
    else
      self.append_one_or_more_alerts(found_forms_is_array, found_forms, form)
    end
  end

  def add_form_change_alert
    if self.owned_by != self.last_updated_by && self.alerts != nil
      changed_fields = self.changed.reject{|x| IGNORED_ROOT_PROPERTIES.include? x}
      @system_settings ||= SystemSettings.current
      if @system_settings.present? && @system_settings.try(:changes_field_to_form)
        changed_fields_in_map = changed_fields.select {|field|
          @system_settings.changes_field_to_form.try(:has_key?, field)
        }

        changed_fields_in_map.each do |field|
          add_field_alert(self.last_updated_by, field)
        end
      end
    end
  end
end