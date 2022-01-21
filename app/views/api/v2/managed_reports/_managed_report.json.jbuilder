# frozen_string_literal: true

json.merge!(managed_report.properties)
json.subreports managed_report.subreports
json.merge!({ report_data: managed_report.values }) if managed_report.values.present?
