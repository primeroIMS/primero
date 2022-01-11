# frozen_string_literal: true

# Queues the creation of an audit log entry. Invoked for every API call.
class AuditLogJob < ApplicationJob
  queue_as :logger

  def perform(**args)
    audit_log = AuditLog.new(args)
    audit_log.save
    write_log(audit_log.log_message)

    # TODO: Any external audit reporting integrations go here.
  end

  def write_log(log_message = {})
    logger.info("#{message_prefix(log_message)} #{log_message[:identifier]} #{message_suffix(log_message)}")
  end

  private

  def message_prefix(log_message)
    return I18n.t(log_message[:prefix][:key], locale: :en) if log_message[:prefix][:approval_type].blank?

    approval_label = SystemSettings.current.approvals_labels_en[log_message[:prefix][:approval_type]]
    I18n.t(log_message[:prefix][:key], approval_label: approval_label, locale: :en)
  end

  def message_suffix(log_message)
    "#{I18n.t(log_message[:suffix][:key], locale: :en)} '#{log_message[:suffix][:user]}'"
  end
end
