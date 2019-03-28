class CreateFormSectionsRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :form_sections_roles, :id => false do |t|
      t.integer :role_id
      t.integer :form_section_id
    end
  end
end