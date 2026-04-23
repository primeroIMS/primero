class AddReceiveWebpushToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :receive_webpush, :boolean
  end
end
