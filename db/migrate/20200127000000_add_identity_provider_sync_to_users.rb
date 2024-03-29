# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddIdentityProviderSyncToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :identity_provider_sync, :jsonb
  end
end
