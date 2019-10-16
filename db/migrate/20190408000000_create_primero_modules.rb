class CreatePrimeroModules < ActiveRecord::Migration[5.0]
  def change
    create_table :primero_modules do |t|
      t.string     :unique_id
      t.belongs_to :primero_program
      t.jsonb      :name, default: {}
      t.jsonb      :description, default: {}
      t.string     :associated_record_types, array: true
      t.boolean    :core_resource, default: true
      t.jsonb      :field_map
      t.jsonb      :module_options
    end

    add_index :primero_modules, :unique_id, unique: true

    create_table :form_sections_primero_modules, :id => false do |t|
      t.integer :primero_module_id
      t.integer :form_section_id
    end
  end
end
