class AuditLogJob < ApplicationJob
  queue_as :logger

  def perform(user_name, action_name, record_type, record_id=nil)
    audit_log = AuditLog.new(user_name: user_name, action_name: action_name,
                             record_id: record_id, record_type: record_type)
    rc = audit_log.save
  end
end