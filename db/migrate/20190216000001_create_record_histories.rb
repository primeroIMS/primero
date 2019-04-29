class CreateRecordHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :record_histories do |t|
      t.integer 'record_id'
      t.string 'record_type'
      t.datetime 'datetime'
      t.string 'user_name'
      t.string 'action'
      t.jsonb 'record_changes', default: {}
    end
    add_index :record_histories, [:record_type, :record_id]
  end
end