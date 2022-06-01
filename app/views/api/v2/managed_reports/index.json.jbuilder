# frozen_string_literal: true

json.data do
  json.array! @managed_reports do |managed_report|
    json.partial! 'api/v2/managed_reports/managed_report', managed_report: managed_report
  end
end

json.metadata do
  json.total @total
end
