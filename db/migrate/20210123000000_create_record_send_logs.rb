# frozen_string_literal: true

class CreateRecordSendLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :record_send_logs, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string 'record_type'
      t.string 'record_id'
      t.integer 'user_id'
      t.string 'destination'
      t.string 'status'
      t.datetime 'started_at'
      t.datetime 'completed_at'
      t.jsonb 'metadata'
    end
    add_index :record_send_logs, :user_id
    add_index :record_send_logs, :destination
    add_index :record_send_logs, %i[record_type record_id]
    add_index :record_send_logs, :metadata, using: :gin
  end
end
