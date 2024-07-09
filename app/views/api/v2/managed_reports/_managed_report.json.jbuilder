# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id managed_report.id
json.name managed_report.name
json.description managed_report.description
json.module_id managed_report.module_id
json.subreports managed_report.subreports
json.merge!(report_data: managed_report.data) if managed_report.data.present?
