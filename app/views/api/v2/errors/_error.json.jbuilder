# frozen_string_literal: true

json.status error.code
json.resource error.resource
json.detail error.detail if error.detail.present?
json.message error.message
