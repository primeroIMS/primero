# frozen_string_literal: true

# An audit log record is created for every invocation of a Primero endpoint.
class AuditLog < ApplicationRecord
  LOGIN = 'login'

  default_scope { order(timestamp: :desc) }

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user, optional: true

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  def self.logs(user_name, date_range)
    return AuditLog.where(timestamp: date_range) unless user_name.present?

    joins(:user).where('users.user_name': user_name, timestamp: date_range)
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
    approval_type = if action.present? && action.include?('requested')
                      action.delete_suffix('_requested')
                    elsif action.present? && action.include?('approved')
                      action.delete_suffix('_approved')
                    else
                      action
                    end
    log_message_hash[:prefix] = {
      key: "logger.#{action}",
      approval_label: SystemSettings.current.approvals_labels_i18n[approval_type]
    }
    log_message_hash[:identifier] = display_id.present? ? "#{record_type} '#{display_id}'" : "#{record_type}"
    log_message_hash[:suffix] = {
      key: 'logger.by_user',
      user: user_name
    }
    log_message_hash
  end
end
