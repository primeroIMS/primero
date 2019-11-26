module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'
  NEW_FORM = 'new_form'
  APPROVAL = 'approval'
  FIELD_CHANGE = 'field_change'
  TRANSFER_REQUEST = 'transfer_request'

  included do
    searchable auto_index: self.auto_index? do
      string :current_alert_types, multiple: true
    end

    has_many :alerts, as: :record

    before_update :remove_alert_on_save
  end

  def alert_count
    self.alerts.count
  end

  def has_alerts?
    self.alerts.present?
  end

  def self.alert_count(current_user)
    #TODO: should filter to the owner user?
    Alert.count(user_id: current_user)
  end

  def remove_alert_on_save
    self.remove_alert(self.last_updated_by)
  end

  def current_alert_types
    self.alerts.map {|a| a.type}.uniq
  end

  def add_alert(alert_for, date = nil, type = nil, form_sidebar_id = nil, user = nil, agency = nil)
    date_alert = date.presence || Date.today
    alert = Alert.new(
      type: type,
      date: date_alert,
      form_sidebar_id: form_sidebar_id,
      alert_for: alert_for,
      user: user,
      agency: agency
    )
    self.alerts << alert
    alert
  end

  def remove_alert(current_user_name, type = nil, form_sidebar_id = nil)
    if current_user_name == self.owned_by && self.has_alerts?
      self.alerts.each do |a|
        self.alerts.delete(a.id) if (type.present? && a.type == type) || [NEW_FORM, FIELD_CHANGE, TRANSFER_REQUEST].include?(a.alert_for)
      end
    end
  end

  #TODO: Is this necessary? This methods is called in add_approval_alert then in Approvable concern
  def get_alert(approval_type, system_settings)
    system_settings ||= SystemSettings.current
    system_settings.approval_forms_to_alert.dig(approval_type)
  end

  #TODO: Is this necessary? This methods is called in Approvable concern
  def add_approval_alert(approval_type, system_settings)
    unless self.alerts.any?{|a| a.type == approval_type}
      alert = Alert.new(type: approval_type, date: DateTime.now.to_date, form_sidebar_id: get_alert(approval_type, system_settings), alert_for: APPROVAL)
      self.alerts << alert
    end
  end

end
