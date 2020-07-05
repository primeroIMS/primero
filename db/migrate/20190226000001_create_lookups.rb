class CreateLookups < ActiveRecord::Migration[5.0]
  def change
    create_table "lookups" do |t|
      t.string "unique_id"
      t.jsonb "name_i18n"
      t.jsonb "lookup_values_i18n"
      t.boolean "locked", default: false, null: false
    end
    add_index :lookups, :unique_id, unique: true
  end
end
