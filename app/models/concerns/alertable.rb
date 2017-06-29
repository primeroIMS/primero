module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'

  included do
    property :alerts, [Alert], :default => []

    searchable do
      string :current_alert_types, multiple: true
    end
  end

  def current_alert_types
    self.alerts.map {|a| a[:type]}.uniq
  end

  def add_remove_alert(current_user, type = nil, form_sidebar_id = nil)
    if current_user.user_name == self.owned_by && self.alerts != nil
      if type.present?
        self.alerts.delete_if{|a| a[:type] == type}
      else
        self.alerts.delete_if{|a| a[:alert_for] == 'new_form'}
      end
    elsif current_user.user_name != self.owned_by && self.alerts != nil
      alert = Alert.new(type: type, date: Date.today, form_sidebar_id: form_sidebar_id, alert_for: 'new_form')
      self.alerts << alert
    end
  end

  def add_approval_alert(approval_type)
    if !alerts.any?{|a| a.type == approval_type}
      alert_form = SystemSettings.current["approval_form_to_alert"].present? ? SystemSettings.current["approval_form_to_alert"].find{|a| a["alert"] == approval_type} : nil
      alert = Alert.new(type: approval_type, date: Date.today, form_sidebar_id: alert_form["form"], alert_for: 'approval')
      self.alerts << alert
    end
  end

  def remove_approval_alert(approval_type)
    self.alerts.delete_if{|a| a[:type] == approval_type}
  end
end