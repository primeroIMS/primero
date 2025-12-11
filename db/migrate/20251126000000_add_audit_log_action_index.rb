# frozen_string_literal: true

class AddAuditLogActionIndex < ActiveRecord::Migration[6.1]
  def change
    add_index :audit_logs, %i[action]
  end
end
