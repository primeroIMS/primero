class CreateAuditLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :audit_logs do |t|
      t.string 'user_name'
      t.string 'action_name'
      t.integer 'record_id'
      t.integer 'display_id'
      t.string 'record_type'
      t.string 'owned_by'
      t.datetime 'timestamp'
    end
  end
end