# frozen_string_literal: true

# Queues the creation of an audit log entry. Invoked for every API call.
class AuditLogJob < ApplicationJob
  queue_as :logger

  def perform(**args)
    audit_log = AuditLog.new(args)
    audit_log.save
    logger.info(audit_log.log_message)

    # TODO: Any external audit reporting integrations go here.
  end
end
