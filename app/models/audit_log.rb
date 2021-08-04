# frozen_string_literal: true

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

  default_scope { order(timestamp: :desc) }

  alias_attribute :destination, :resource_url
  store_accessor(:metadata, :webhook_status, :webhook_response)

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user, optional: true

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  def self.logs(user_name, date_range, options)
    logs = AuditLog.where(timestamp: date_range)
    logs = AuditLog.unscoped.where(timestamp: date_range) if options[:order_by].present?
    logs = logs.joins(:user) if options[:order_by] == 'users.user_name' || user_name.present?
    logs = logs.where(users: { user_name: user_name }) if user_name.present?

    OrderByPropertyService.apply_order(logs, options)
  end

  def display_id
    return '' if record.blank?

    @display_id ||= record.respond_to?(:display_id) ? record.display_id : record.id
    @display_id
  end

  def user_name
    return user.user_name if metadata.blank?

    metadata['user_name'] || user.user_name
  end

  def log_message
    log_message_hash = {}
    log_message_hash[:prefix] = { key: "logger.#{action}", approval_type: approval_type }
    log_message_hash[:identifier] = display_id.present? ? "#{record_type} '#{display_id}'" : record_type
    log_message_hash[:suffix] = {
      key: 'logger.by_user',
      user: user_name
    }
    log_message_hash
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
