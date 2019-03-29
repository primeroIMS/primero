class CreateUserGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :user_groups do |t|
      t.string 'unique_id'
      t.string 'name'
      t.string 'description'
      t.boolean 'core_resource', null: false, default: false
    end
    add_index :user_groups, :unique_id, unique: true
  end
end
