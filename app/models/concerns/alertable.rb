# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

  module AlertStrategy
    # This sends email (and webpush) notifications to all
    # users on the case other than the one making the change
    ASSOCIATED_USERS = 'associated_users'
    # This doesn't send email notifications to anyone, and only creates a yellow
    # dot alert if the user making the change is not the owner
    NOT_OWNER = 'not_owner' # this is the default
  end

  included do
    store_accessor(:data, :current_alert_types)

    has_many :alerts, as: :record

    before_save :add_alert_on_field_change
    before_update :remove_alert_on_save
    before_create :calculate_current_alert_types
    before_update :calculate_current_alert_types
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
    alerts_on_change.each do |_, conf_record|
      next if conf_record.alert_strategy == AlertStrategy::ASSOCIATED_USERS

      remove_alert(conf_record.form_section_unique_id)
    end
  end

  def add_alert_on_field_change
    return unless alerts_on_change.present?

    changed_field_names = changes_to_save_for_record.keys
    alerts_on_change.each do |field_name, conf_record|
      next unless changed_field_names.include?(field_name)

      # remove any existing alerts of the same type
      remove_alert(conf_record.form_section_unique_id)
      add_field_alert(conf_record)
    end
  end

  def add_field_alert(conf_record)
    case conf_record.alert_strategy
    when AlertStrategy::ASSOCIATED_USERS
      add_alert(alert_for: FIELD_CHANGE, date: Date.today, type: conf_record.form_section_unique_id,
                form_sidebar_id: conf_record.form_section_unique_id, send_email: true)

    when AlertStrategy::NOT_OWNER
      return if owned_by == last_updated_by

      add_alert(alert_for: FIELD_CHANGE, date: Date.today, type: conf_record.form_section_unique_id,
                form_sidebar_id: conf_record.form_section_unique_id)
    else raise "Unknown alert strategy #{conf_record.alert_strategy}"
    end
  end

  def calculate_current_alert_types
    self.current_alert_types = alerts.each_with_object([]) do |alert, memo|
      next if alert.destroyed? || memo.include?(alert.type)

      memo << alert.type unless alert.destroyed?
    end

    current_alert_types
  end

  def add_alert(args = {})
    alert = Alert.new(type: args[:type], date: args[:date].presence || Date.today,
                      form_sidebar_id: args[:form_sidebar_id], alert_for: args[:alert_for], user_id: args[:user_id],
                      agency_id: args[:agency_id], send_email: args[:send_email])

    (alerts << alert) && alert
  end

  def remove_alert(type = nil)
    alerts.each do |alert|
      next unless (type.present? && alert.type == type) &&
                  [NEW_FORM, FIELD_CHANGE, TRANSFER_REQUEST].include?(alert.alert_for)

      alert.destroy
    end
  end

  def remove_alert_by_unique_id!(alert_unique_id)
    alert = alerts.find { |elem| elem.unique_id == alert_unique_id }
    raise ActiveRecord::RecordNotFound unless alert.present?

    alert.destroy! && save!
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
    # changes field to form needs to be backwards compatible, so each of the
    # values in the hash is either a string or a hash. If it's a string, it's
    # the form section unique id. If it's a hash, it's the form section unique
    # id and the alert strategy
    (@system_settings&.changes_field_to_form&.map do |field_name, form_section_uid_or_hash|
      [field_name, AlertConfigEntryService.new(form_section_uid_or_hash)]
    end).to_h
  end
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
    open_enabled_records.where(
      "data %s '$.associated_user_agencies %s (@ == %s)'", '@?', '?', agency_unique_id.to_json
    ).distinct.count
  end

  def alert_count_group(current_user)
    user_groups_unique_id = current_user.user_groups.pluck(:unique_id)
    user_groups_filter = user_groups_unique_id.map { |unique_id| "@ == #{unique_id.to_json}" }.join(' || ')
    open_enabled_records.where(
      "data %s '$.associated_user_groups %s (%s)'", '@?', '?', user_groups_filter
    ).distinct.count
  end

  def alert_count_self(current_user)
    open_enabled_records.owned_by(current_user.user_name).distinct.count
  end

  def open_enabled_records
    joins(:alerts).where(
      "data %s '$[*] %s (@.record_state == true && @.status == %s)'", '@?', '?', Record::STATUS_OPEN.to_json
    )
  end
end
