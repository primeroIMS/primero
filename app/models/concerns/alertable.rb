# frozen_string_literal: true

# Concern of Alertable
module Alertable
  extend ActiveSupport::Concern

  ALERT_INCIDENT = 'incident_details'
  ALERT_SERVICE = 'services_section'
  NEW_FORM = 'new_form'
  APPROVAL = 'approval'
  FIELD_CHANGE = 'field_change'
  TRANSFER_REQUEST = 'transfer_request'
  INCIDENT_FROM_CASE = 'incident_from_case'

  included do
    searchable do
      string :current_alert_types, multiple: true
    end

    has_many :alerts, as: :record

    before_save :add_alert_on_field_change
    before_update :remove_alert_on_save
  end

  def alert_count
    alerts.size
  end

  def alerts?
    alerts.exists?
  end

  def remove_alert_on_save
    return unless last_updated_by == owned_by && alerts?
    return unless alerts_on_change.present? && record_user_update?

    remove_field_change_alerts
    remove_alert(alerts_on_change[ALERT_INCIDENT]) if alerts_on_change[ALERT_INCIDENT].present?
  end

  def remove_field_change_alerts
    alerts_on_change.each { |_, form_name| remove_alert(form_name) }
  end

  def add_alert_on_field_change
    return unless owned_by != last_updated_by
    return unless alerts_on_change.present?

    changed_field_names = changes_to_save_for_record.keys
    alerts_on_change.each do |field_name, form_name|
      next unless changed_field_names.include?(field_name)

      add_alert(alert_for: FIELD_CHANGE, date: Date.today, type: form_name, form_sidebar_id: form_name)
    end
  end

  def current_alert_types
    alerts.map(&:type).uniq
  end

  def add_alert(args = {})
    date_alert = args[:date].presence || Date.today

    alert = Alert.new(type: args[:type], date: date_alert, form_sidebar_id: args[:form_sidebar_id],
                      alert_for: args[:alert_for], user_id: args[:user_id], agency_id: args[:agency_id])

    alerts << alert && alert
  end

  def remove_alert(type = nil)
    alerts.each do |alert|
      next unless (type.present? && alert.type == type) &&
                  [NEW_FORM, FIELD_CHANGE, TRANSFER_REQUEST].include?(alert.alert_for)

      alert.destroy
    end
  end

  def get_alert(approval_type, system_settings)
    system_settings ||= SystemSettings.current
    system_settings.approval_forms_to_alert.key(approval_type)
  end

  def add_approval_alert(approval_type, system_settings)
    return if alerts.any? { |a| a.type == approval_type }

    add_alert(type: approval_type, date: DateTime.now.to_date,
              form_sidebar_id: get_alert(approval_type, system_settings), alert_for: APPROVAL)
  end

  def alerts_on_change
    @system_settings ||= SystemSettings.current
    @system_settings&.changes_field_to_form
  end

  # Class methods that indicate alerts for all permitted records for a user.
  # TODO: This deserves its own service
  module ClassMethods
    def alert_count(current_user)
      query_scope = current_user.record_query_scope(self.class)[:user]
      if query_scope.blank?
        open_enabled_records.distinct.count
      elsif query_scope[Permission::AGENCY].present?
        alert_count_agency(current_user)
      elsif query_scope[Permission::GROUP].present?
        alert_count_group(current_user)
      else
        alert_count_self(current_user)
      end
    end

    def remove_alert(type = nil)
      alerts_to_delete = alerts.select do |alert|
        type.present? && alert.type == type && [NEW_FORM, FIELD_CHANGE, TRANSFER_REQUEST].include?(alert.alert_for)
      end

      alerts.destroy(*alerts_to_delete)
    end

    def alert_count_agency(current_user)
      agency_unique_id = current_user.agency.unique_id
      open_enabled_records.where("data -> 'associated_user_agencies' ? :agency", agency: agency_unique_id)
                          .distinct.count
    end

    def alert_count_group(current_user)
      user_groups_unique_id = current_user.user_groups.pluck(:unique_id)
      open_enabled_records.where(
        "data -> 'associated_user_groups' ?& array[:group]",
        group: user_groups_unique_id
      ).distinct.count
    end

    def alert_count_self(current_user)
      open_enabled_records.owned_by(current_user.user_name).distinct.count
    end

    def open_enabled_records
      joins(:alerts).where('data @> ?', { record_state: true, status: Record::STATUS_OPEN }.to_json)
    end
  end
end
