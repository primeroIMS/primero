# frozen_string_literal: true

class CreateWebhooks < ActiveRecord::Migration[5.2]
  def change
    create_table :webhooks, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'events', default: []
      t.string 'url'
      t.string 'auth_type'
      t.string 'auth_secret_encrypted'
      t.string 'role_unique_id'
      t.jsonb 'metadata', default: {}
    end
    add_index :webhooks, :url, unique: true
    add_index :webhooks, :events, using: :gin
  end
end
