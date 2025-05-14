# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id audit_log.id
json.display_id audit_log.display_id
json.record_type audit_log.record_type.underscore
json.user_name audit_log.user_name
json.action audit_log.action
json.resource_url audit_log.resource_url
json.timestamp audit_log.timestamp
json.log_message audit_log.log_message
json.metadata audit_log.metadata
json.record_id audit_log.record_id
json.display_name audit_log&.display_name
