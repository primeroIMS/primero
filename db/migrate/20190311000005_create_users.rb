class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string     :full_name
      t.string     :user_name
      t.string     :encrypted_password, null: false, default: ""
      t.string     :code
      t.string     :phone
      t.string     :email
      t.references :agency
      t.string     :position
      t.string     :location
      t.string     :reporting_location_code
      t.references :role
      t.string     :time_zone, default: 'UTC'
      t.string     :locale
      t.boolean    :send_mail, default: true
      t.boolean    :disabled, default: false
      t.string     :services, array: true
      t.string     :agency_office
      t.string     :reset_password_token
      t.datetime   :reset_password_sent_at
      t.timestamps
    end


    add_index :users, :email, unique: true
    add_index :users, :user_name, unique: true
    add_index :users, :reset_password_token, unique: true

    create_table :user_groups_users do |t|
      t.belongs_to :user, index: true
      t.belongs_to :user_group, index: true
    end
  end
end
