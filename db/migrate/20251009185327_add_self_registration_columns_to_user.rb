# frozen_string_literal: true

class AddSelfRegistrationColumnsToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_category, :string
    add_column :users, :unverified, :boolean, default: false
    add_column :users, :registration_stream, :string
    add_column :users, :data_processing_consent_provided_on, :datetime
  end
end
