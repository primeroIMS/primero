class CreateIdentityProviders < ActiveRecord::Migration[5.0]
  def change
    create_table :identity_providers do |t|
      t.string     :name
      t.string     :unique_id
      t.string     :provider_type
      t.jsonb      :configuration
      # t.string     :authority_url
      # t.string     :client_id
      # t.string     :verification_url
    end
    add_index :identity_providers, :unique_id, unique: true
  end
end