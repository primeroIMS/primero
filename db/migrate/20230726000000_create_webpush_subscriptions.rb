# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateWebpushSubscriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :webpush_subscriptions do |t|
      t.boolean :disabled, null: false, default: false
      t.string :notification_url, null: false
      t.string :auth, null: false
      t.string :p256dh, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :webpush_subscriptions, :notification_url
    add_index :webpush_subscriptions, %i[notification_url user_id], unique: true
  end
end
