class CreateIdentityProviders < ActiveRecord::Migration[5.0]
  def change
    create_table :identity_providers do |t|
      t.string     :name
      t.string     :unique_id
      t.string     :provider_type
      t.jsonb      :configuration
    end
    add_index :identity_providers, :unique_id, unique: true
    add_index :identity_providers, :configuration, using: 'gin'

    add_column :users, :identity_provider_unique_id, :string
  end
end