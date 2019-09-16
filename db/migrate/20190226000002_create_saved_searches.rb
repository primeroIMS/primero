class CreateSavedSearches < ActiveRecord::Migration[5.0]
  def change
    create_table :saved_searches do |t|
      t.string :name
      t.string :record_type
      t.belongs_to :user
      t.jsonb 'filters'
    end

    create_table :primero_modules_saved_searches do |t|
      t.belongs_to :primero_module, index: true
      t.belongs_to :saved_search, index: true
    end
  end
end
