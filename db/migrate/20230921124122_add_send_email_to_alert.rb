# frozen_string_literal: true

class AddSendEmailToAlert < ActiveRecord::Migration[6.1]
  def change
    add_column :alerts, :send_email, :boolean, default: false
  end
end
