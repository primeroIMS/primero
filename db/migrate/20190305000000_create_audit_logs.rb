class CreateAuditLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :audit_logs do |t|
      t.string 'user_name'
      t.string 'action_name'
      t.integer 'display_id'
      t.belongs_to :record, polymorphic: true
      t.string 'owned_by'
      t.datetime 'timestamp'
      t.jsonb 'mobile_data'
    end
    add_index :audit_logs, :user_name
  end
end
