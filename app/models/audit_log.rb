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

  def self.for_user(params)
    filter = {}
    range = DestringifyService.destringify(params[:timestamp].to_h)
    filter['timestamp'] = (range['from'] || Time.at(0).to_datetime)..(range['to'] || DateTime.now.end_of_day)
    filter['users.user_name'] = params[:user_name] if params[:user_name].present?
    joins(:user).where(filter)
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
