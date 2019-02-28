class CreateSavedSearches < ActiveRecord::Migration[5.0]
  def change
    create_table :saved_searches do |t|
      t.string 'name'
      t.string 'module_id' # TODO: Foreign key to Module?
      t.string 'record_type'
      t.string 'user_name' # TODO: Foreign key to User?
      t.jsonb 'filters'
    end
  end
end
