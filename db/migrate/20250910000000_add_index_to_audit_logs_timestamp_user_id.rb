# frozen_string_literal: true

class AddIndexToAuditLogsTimestampUserId < ActiveRecord::Migration[6.1]
  def change
    add_index :audit_logs, %i[timestamp user_id]
  end
end
