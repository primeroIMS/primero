# frozen_string_literal: true

# Copyright (c) 2014 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/usage_reports/usage_report', usage_report: @usage_report
end
