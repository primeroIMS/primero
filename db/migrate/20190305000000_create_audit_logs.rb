class CreateAuditLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :audit_logs do |t|
      t.string 'user_name'
      t.string 'action_name'
      t.text 'display_id'
      t.string "record_type"
      t.string "record_id"
      t.string 'owned_by'
      t.datetime 'timestamp'
      t.jsonb 'mobile_data'
    end
    add_index :audit_logs, :user_name
    add_index :audit_logs, [:record_type, :record_id]
  end
end
