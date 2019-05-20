class CreateRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :roles do |t|
      t.string  'unique_id'
      t.string  'name'
      t.string  'description'
      t.jsonb   'permissions_list', array: true, default: []
      t.string  'group_permission', default: Permission::SELF
      t.boolean 'referral', null: false, default: false
      t.boolean 'transfer', null: false, default: false
      t.boolean 'is_manager', null: false,  default: false
    end
    add_index :roles, :unique_id, unique: true

    create_table :form_sections_roles, :id => false do |t|
      t.integer :role_id
      t.integer :form_section_id
    end
    add_index :form_sections_roles, [:role_id, :form_section_id], unique: true

    create_table :roles_roles, :id => false do |t|
      t.integer :role_id
      t.integer :associated_role_id
    end
  end
end
