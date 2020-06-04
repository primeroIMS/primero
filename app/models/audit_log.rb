# frozen_string_literal: true

# An audit log record is created for every invocation of a Primero endpoint.
class AuditLog < ApplicationRecord
  LOGIN = 'login'

  default_scope { order(timestamp: :desc) }

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  def self.logs(user_name, date_range)
    return AuditLog.where(timestamp: date_range) unless user_name.present?

    joins(:user).where('users.user_name': user_name, timestamp: date_range)
  end

  def display_id
    return '' unless record.present?

    if record.respond_to?(:display_id)
      record.display_id
    else
      record.id
    end
  end

  def user_name
    return user.user_name if metadata.blank?

    metadata['user_name'] || user.user_name
  end

  def log_message
    logger_action_prefix = I18n.t("logger.#{action}", locale: :en)
    logger_action_identifier = "#{record_type} '#{display_id}'"
    logger_action_suffix = "#{I18n.t('logger.by_user', locale: :en)} '#{user_name}'"
    "#{logger_action_prefix} #{logger_action_identifier} #{logger_action_suffix}"
  end
end
