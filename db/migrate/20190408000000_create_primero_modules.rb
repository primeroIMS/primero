class CreatePrimeroModules < ActiveRecord::Migration[5.0]
  def change
    create_table :primero_modules do |t|
      t.string     :unique_id
      t.references :program
      t.jsonb      :name, default: {}
      t.jsonb      :description, default: {}
      t.string     :associated_record_types, array: true
      t.boolean    :core_resource, default: true
      t.jsonb      :field_map
      t.jsonb      :module_options
    end

    add_index :primero_modules, :unqiue_id, unique: true

    create_table :primero_module_form_sections, :id => false do |t|
      t.integer :primero_module_id
      t.integer :form_section_id
    end
  end
end
