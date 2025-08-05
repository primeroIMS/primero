# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Concern of Access Log
module AccessLoggable
  extend ActiveSupport::Concern

  included do
    has_many :audit_logs, as: :record
  end

  def access_log_filtered(date_range:, exclude_user_id: nil, actions: AuditLog::RECORD_VIEWS_EDIT)
    audit_logs.includes(user: :role)
              .where(action: actions, timestamp: date_range)
              .then { |logs| exclude_user_id ? logs.where.not(user_id: exclude_user_id) : logs }
  end
end
