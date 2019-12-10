class CreateAlerts < ActiveRecord::Migration[5.0]
  def change
    create_table :alerts do |t|
      t.string     :type
      t.text       :alert_for
      t.date       :date
      t.string     :form_sidebar_id
      t.string     :unique_id
      t.references :user, null: true
      t.references :agency, null: true
      t.references :record, polymorphic: true, type: :uuid
    end
    # add_index :alerts, [:record_type, :record_id]
  end
end
