# frozen_string_literal: true

class AddIdentityProviderSyncToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :identity_provider_sync, :jsonb
  end
end
