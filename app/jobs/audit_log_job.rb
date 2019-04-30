class AuditLogJob < ApplicationJob
  queue_as :logger

  def perform(**args)
    audit_log = AuditLog.new(user_name: args[:user_name], action_name: args[:action_name], record_id: args[:record_id],
                             display_id: args[:display_id], record_type: args[:record_type], owned_by: args[:owned_by],
                             mobile_data: args[:mobile_data])
    rc = audit_log.save
  end
end
