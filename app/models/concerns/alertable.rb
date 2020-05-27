module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'
  NEW_FORM = 'new_form'
  APPROVAL = 'approval'
  FIELD_CHANGE = 'field_change'
  TRANSFER_REQUEST = 'transfer_request'

  included do
    include Indexable

    property :alerts, [Alert], :default => []

    searchable do
      string :current_alert_types, multiple: true
    end

    before_update :remove_alert_on_save
    before_save :add_form_change_alert
  end

  def remove_alert_on_save
    self.remove_alert(self.last_updated_by)
  end

  def current_alert_types
    self.alerts.map {|a| a[:type]}.uniq
  end

  def add_alert(alert_for, type = nil, form_sidebar_id = nil, user = nil, agency = nil)
    self.alerts = [] if self.alerts.nil?
    self.alerts << Alert.new(type: type, date: DateTime.now.to_date, form_sidebar_id: form_sidebar_id,
                             alert_for: alert_for, user: user, agency: agency)
  end

  def remove_alert(current_user_name, type = nil, form_sidebar_id = nil)
    if current_user_name == self.owned_by && self.alerts.present?
      if type.present?
        self.alerts.delete_if{|a| a[:type] == type}
      else
        self.alerts.delete_if{|a| [NEW_FORM, FIELD_CHANGE, TRANSFER_REQUEST].include?(a[:alert_for])}
      end
    end
  end

  def get_alert(approval_type, system_settings)
    approval_type = "#{approval_type}_gbv" if self.module_id == PrimeroModule::GBV
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

  def create_alert(form)
    Alert.new(type: form, date: Date.current.to_s, form_sidebar_id: form, alert_for: FIELD_CHANGE)
  end

  def append_one_or_more_alerts(forms_to_check, form)
    if forms_to_check.kind_of?(Array)
      self.alerts += forms_to_check.map {|form| self.create_alert(form)}
    elsif forms_to_check.try(:kind_of?, String)
      self.alerts << self.create_alert(forms_to_check)
    end
  end

  def add_field_alert(current_user_name, type = nil)
    forms_to_check = @system_settings.try(:changes_field_to_form).try(:[], type)
    existing_alert = self.alerts.find do |alert|
      (forms_to_check.kind_of?(Array) &&
        forms_to_check.include?(alert.type)) ||
        alert.type == forms_to_check
    end

    if existing_alert.present?
      #If alert already exists, update the date
      existing_alert.date = Date.current.to_s
    else
      self.append_one_or_more_alerts(forms_to_check, form)
    end
  end

  def add_form_change_alert
    if self.owned_by != self.last_updated_by && self.alerts != nil
      @system_settings ||= SystemSettings.current
      if @system_settings.present? && @system_settings.try(:changes_field_to_form)
        changed_fields_in_map = self.changed.select {|field|
          @system_settings.changes_field_to_form.try(:has_key?, field)
        }

        changed_fields_in_map.each do |field|
          add_field_alert(self.last_updated_by, field)
        end
      end
    end
  end
end