# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An audit log record is created for every invocation of a Primero endpoint.
class AuditLog < ApplicationRecord
  LOGIN = 'login'
  WEBHOOK = 'webhook'
  # Webhook statuses
  FAILED = 'failed'        # Failed the HTTP send request
  NOT_FOUND = 'not_found'  # The HTTP request is successful, but it does not find a record in the external system
  SENDING = 'sending'      # Started HTTP send request
  SENT = 'sent'            # Completed HTTP send request successfully
  SYNCED = 'synced'        # The downstream system processed the send request and reverted
  AUDIT_LOG_STATISTIC = '[AuditLogStatistic]'
  ACTIONS = %w[list index bulk_index show login logout show_alerts create update traces assessment_requested refer_to
               enable_disable_record refer transfer_accepted transfer transfer_to refer_rejected assign assign_to
               unflag flag delete password_reset_request bulk_assign export password_reset update_bulk current
               refer_done refer_accepted assessment_approved detach attach reopen close transfer_revoked
               transfer_rejected case_plan_approved case_plan_requested refer_revoke closure_approved create_family
               import closure_requested case_plan_rejected closure_rejected assessment_rejected add_note
               user_password_reset_request transfer_request family incident_details_from_case].freeze
  RECORD_TYPES = %w[agency alert audit_log bulk_export child code_of_conduct dashboard form_section incident location
                    lookup permission primero_configuration report role saved_search system_settings
                    task user user_group].freeze

  default_scope { order(timestamp: :desc) }

  alias_attribute :destination, :resource_url
  store_accessor(:metadata, :webhook_status, :webhook_response)

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user, optional: true

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  def self.logs(user_name, actions, record_types, date_range, options)
    logs = AuditLog.where(timestamp: date_range)
    logs = AuditLog.unscoped.where(timestamp: date_range) if options[:order_by].present?
    logs = logs.joins(:user) if options[:order_by] == 'users.user_name' || user_name.present?
    logs = logs.where(users: { user_name: }) if user_name.present?
    logs = query_actions(logs, actions)
    logs = query_record_type(logs, record_types)

    OrderByPropertyService.apply_order(logs, options)
  end

  def self.query_actions(logs, actions)
    logs = logs.where(action: actions) if actions.present? && actions.all? { |item| ACTIONS.include?(item) }
    logs
  end

  def self.query_record_type(logs, record_types)
    if record_types.present? && record_types.all? { |item| RECORD_TYPES.include?(item) }
      logs = logs.where(record_type: record_types.map(&:camelize))
    end

    logs
  end

  def display_id
    # TODO: In order to fix this, we should add new column for Records not storaged in the database
    return '' if record_type.in?(%w[ManagedReport])
    return '' if record.blank?

    @display_id ||= record.respond_to?(:display_id) ? record.display_id : record.id
    @display_id
  end

  def user_name
    return user&.user_name if metadata.blank?

    metadata['user_name'] || user&.user_name
  end

  def log_message
    log_message_hash = {}
    log_message_hash[:prefix] = { key: "logger.#{action}", approval_type: }
    log_message_hash[:identifier] = display_id.present? ? "#{record_type} '#{display_id}'" : record_type
    log_message_hash[:suffix] = {
      key: 'logger.by_user',
      user: user_name
    }
    log_message_hash
  end

  def statistic_message
    "#{AUDIT_LOG_STATISTIC}[#{id}]: #{record_type},#{action},#{metadata['remote_ip']},#{user_id}," \
      "#{metadata['role_id']},#{metadata['agency_id']}"
  end

  private

  def approval_type
    approval_type = approval_type_from_action
    SystemSettings.current.approvals_labels.include?(approval_type) ? approval_type : nil
  end

  def approval_type_from_action
    if action.present? && action.include?('requested')
      action.delete_suffix('_requested')
    elsif action.present? && action.include?('approved')
      action.delete_suffix('_approved')
    else
      action
    end
  end
end
