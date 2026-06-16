# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/usage_reports/usage_report', usage_report: @usage_report
end
