# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddIndexToWebpushSubscriptions < ActiveRecord::Migration[6.1]
  def change
    add_index :webpush_subscriptions, %i[notification_url user_id disabled],
              unique: true, name: 'index_webpush_subscriptions_notification_url_user_id_disabled'
  end
end
