class AddEmailAlertToSystemSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :system_settings, :email_alert_on_change_field_to_form, :jsonb
  end
end
