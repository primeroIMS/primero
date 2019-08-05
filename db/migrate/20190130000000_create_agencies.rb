class CreateAgencies < ActiveRecord::Migration[5.0]
  def change
    create_table :agencies do |t|
      t.string  'unique_id'
      t.string  'agency_code', null: false
      t.integer 'order', default: 0
      t.jsonb   'name_i18n'
      t.jsonb   'description_i18n'
      t.string  'telephone'
      t.string  'services', array: true, default: []
      t.boolean 'logo_enabled', null: false, default: false
      t.boolean 'disabled', null: false, default: false
    end
    add_index :agencies, :agency_code, unique: true
    add_index :agencies, :unique_id, unique: true
    add_index :agencies, :services, using: 'gin'
  end
end