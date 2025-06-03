# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An audit log record is created for every invocation of a Primero endpoint.
class AuditLog < ApplicationRecord
  attr_accessor :display_name

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
                    task tracing_request user user_group].freeze

  RECORD_COLUMN_MAP = {
    'Child' => Arel.sql("data->>'case_id_display'"),
    'Incident' => Arel.sql("data->>'short_id'"),
    'TracingRequest' => Arel.sql("data->>'short_id'"),
    'User' => :user_name,
    'Role' => :name,
    'UserGroup' => :name,
    'Agency' => :agency_code,
    'Report' => Arel.sql("name_i18n->>'en' as name")
  }.freeze

  ALLOWED_MODELS = [Child, Incident, TracingRequest, User, Role, Agency, UserGroup, Report].freeze

  default_scope { order(timestamp: :desc) }

  alias_attribute :destination, :resource_url
  store_accessor(:metadata, :webhook_status, :webhook_response)

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user, optional: true

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  def self.logs(options = {})
    logs = AuditLog.where(timestamp: options[:date_range])
    logs = AuditLog.unscoped.where(timestamp: options[:date_range]) if options[:order_by].present?
    logs = apply_user_filter(logs, options)
    logs = query_actions(logs, options[:actions])
    logs = query_record_type(logs, options[:record_types])

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

  def self.apply_user_filter(logs, options)
    return logs unless options[:user_name].present? || options[:order_by] == 'users.user_name'

    logs = logs.joins(:user) if options[:order_by] == 'users.user_name' || options[:user_name].present?
    logs = logs.where(users: { user_name: options[:user_name] }) if options[:user_name].present?

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
    log_message_hash[:prefix] = { key: "logger.actions.#{action}", approval_type: }
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

  class << self
    def group_records(audit_logs)
      audit_logs.group_by(&:record_type).transform_values do |logs|
        logs.map(&:record_id)
      end
    end

    def fetch_record_data(model_class, record_type, ids)
      return {} if ids.blank?

      id_column = :id
      column = RECORD_COLUMN_MAP[record_type]
      return {} unless column

      model_class.where(id: ids).pluck(id_column, column).to_h.transform_keys(&:to_s)
    end

    def enrich_audit_logs(audit_logs)
      group_records(audit_logs).each do |record_type, ids|
        model_class = record_type.constantize
        next unless model_class.in?(ALLOWED_MODELS)

        record_data = fetch_record_data(model_class, record_type, ids.uniq)

        audit_logs.select { |log| log.record_type == record_type }.each do |log|
          log.display_name = record_data[log.record_id.to_s]
        end
      end
      audit_logs
    end
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
