# frozen_string_literal: true

class CreateLocations < ActiveRecord::Migration[5.0]
  enable_extension 'ltree' unless extension_enabled?('ltree')
  def change
    create_table :locations do |t|
      t.jsonb   'name_i18n'
      t.jsonb   'placename_i18n'
      t.string  'location_code', null: false
      t.integer 'admin_level'
      t.string  'type'
      t.boolean 'disabled', null: false, default: false
      t.ltree   'hierarchy_path', null: false, default: ''
    end
    add_index :locations, :location_code, unique: true
    add_index :locations, :hierarchy_path, using: 'gist'
  end
end
