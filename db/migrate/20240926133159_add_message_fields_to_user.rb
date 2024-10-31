class AddMessageFieldsToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :rapidpro_urn, :text
    add_column :users, :receive_messages, :boolean
  end
end
