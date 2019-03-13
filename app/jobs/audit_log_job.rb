class AuditLogJob < ApplicationJob
  queue_as :logger

  def perform(user_name, action_name, record_type, record_id=nil, display_id=nil, owned_by=nil, mobile_data)
    audit_log = AuditLog.new(user_name: user_name, action_name: action_name, record_id: record_id, display_id: display_id,
                             record_type: record_type, owned_by: owned_by, mobile_data: mobile_data)
    rc = audit_log.save
  end
end