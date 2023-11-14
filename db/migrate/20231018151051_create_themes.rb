class CreateThemes < ActiveRecord::Migration[6.1]
  def change
    create_table :themes do |t|
      t.jsonb 'data', default: {}
      t.boolean :is_active, default: false, null: false

      t.timestamps
    end

    add_index :themes, :data, using: :gin
  end
end
