# frozen_string_literal: true

json.data do
  json.array! @audit_logs do |audit_log|
    json.partial! 'api/v2/audit_logs/audit_log', audit_log: audit_log
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
