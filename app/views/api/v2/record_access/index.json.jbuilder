# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

json.data do
  json.array! @audit_logs do |audit_log|
    json.extract! audit_log, :id, :timestamp, :action, :record_type, :record_id
    json.record_type PrimeroModelService.to_name(audit_log.record_type).pluralize
    json.user_name audit_log&.user&.user_name
    json.full_name audit_log&.user&.full_name
    json.role_name audit_log&.user&.role&.name
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
