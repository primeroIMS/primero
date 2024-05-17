# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.status error.code
json.resource error.resource
json.detail error.detail if error.detail.present?
json.message error.message
