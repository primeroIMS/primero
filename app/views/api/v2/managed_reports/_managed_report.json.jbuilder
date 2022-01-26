# frozen_string_literal: true

json.id managed_report.id
json.name managed_report.name
json.description managed_report.description
json.subreports managed_report.subreports.map(&:id)
json.merge!({ report_data: managed_report.data }) if managed_report.data.present?
