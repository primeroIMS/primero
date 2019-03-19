class CreateFlags < ActiveRecord::Migration[5.0]
  def change
    create_table :flags do |t|
      t.string 'record_id'
      t.string 'record_type'
      t.date 'date'
      t.text 'message'
      t.string 'flagged_by'
      t.boolean 'removed', null: false, default: false
      t.text 'unflag_message'
      t.datetime 'created_at'
      t.boolean 'system_generated_followup',  null: false, default: false
      t.string 'unflagged_by'
      t.date 'unflagged_date'
    end
    add_index :flags, [:record_type, :record_id]
  end
end
