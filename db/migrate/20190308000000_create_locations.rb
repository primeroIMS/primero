class CreateLocations < ActiveRecord::Migration[5.0]
  def change
    create_table :locations do |t|
      t.jsonb   'name_i18n'
      t.jsonb   'placename_i18n'
      t.string  'location_code', null: false
      t.integer 'admin_level'
      t.string  'type'
      t.boolean 'disabled', null: false, default: false
       t.string 'hierarchy', array: true, default: []
    end
    add_index :locations, :location_code, unique: true
  end
end