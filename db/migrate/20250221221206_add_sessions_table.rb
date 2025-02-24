class AddSessionsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :sessions do |t|
      t.string :session_id, null: false
      t.jsonb :data, default: {}
      t.timestamps
    end

    add_index :sessions, :session_id, unique: true
    add_index :sessions, :updated_at
    add_index :sessions, :data, using: :gin
  end
end
