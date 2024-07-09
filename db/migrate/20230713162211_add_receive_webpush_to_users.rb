# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddReceiveWebpushToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :receive_webpush, :boolean
  end
end
