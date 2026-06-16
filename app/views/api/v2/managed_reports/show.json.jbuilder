# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/managed_reports/managed_report', managed_report: @managed_report
end
