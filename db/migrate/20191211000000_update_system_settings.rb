class UpdateSystemSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :system_settings, :use_identity_provider, :boolean, default: false
  end
end