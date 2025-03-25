# frozen_string_literal: true

# Copyright (c) 2014 UNICEF. All rights reserved.

json.from usage_report.from
json.to usage_report.to
json.quarter usage_report.quarter

json.merge!(usage_report.data) if usage_report.data.present?
