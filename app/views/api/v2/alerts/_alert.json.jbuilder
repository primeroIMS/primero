# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.alert_for alert.alert_for
json.type alert.type
json.date(alert.date&.iso8601)
json.form_unique_id alert.form_sidebar_id
json.unique_id alert.unique_id
