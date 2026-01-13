# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

class AddIndexToAuditLogsTimestampUserId < ActiveRecord::Migration[6.1]
  def change
    add_index :audit_logs, %i[timestamp user_id]
  end
end
