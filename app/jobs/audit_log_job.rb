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
    prefix = if log_message[:prefix][:approval_type].present?
               approval_label = SystemSettings.current.approvals_labels_en[log_message[:prefix][:approval_type]]
               I18n.t(log_message[:prefix][:key], approval_label: approval_label, locale: :en)
             else
               I18n.t(log_message[:prefix][:key], locale: :en)
             end
    suffix = "#{I18n.t(log_message[:suffix][:key], locale: :en)} '#{log_message[:suffix][:user]}'"
    logger.info("#{prefix} #{log_message[:identifier]} #{suffix}")
  end
end
