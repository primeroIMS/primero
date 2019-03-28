class CreateRolesAssociatedRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :roles_roles, :id => false do |t|
      t.integer :role_id
      t.integer :associated_role_id
    end
  end
end