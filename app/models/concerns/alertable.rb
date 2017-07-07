module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'
  NEW_FORM = 'new_form'

  included do
    property :alerts, [Alert], :default => []

    searchable do
      string :current_alert_types, multiple: true
    end

    before_save :remove_alert_on_save
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
        self.alerts.delete_if{|a| a[:alert_for] == NEW_FORM}
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
      alert = Alert.new(type: approval_type, date: DateTime.now.to_date, form_sidebar_id: get_alert(approval_type, system_settings), alert_for: 'approval')
      self.alerts << alert
    end
  end

  def remove_approval_alert(approval_type)
    self.alerts.delete_if{|a| a[:type] == approval_type}
  end
end