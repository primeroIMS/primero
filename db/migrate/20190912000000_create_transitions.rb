class CreateTransitions < ActiveRecord::Migration[5.0]
  enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

  def change
    create_table :transitions, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string 'type'
      t.string 'status'
      t.string 'record_id'
      t.string 'record_type'
      t.string 'to_user_local' #TODO: this should be a User association, FK
      t.string 'to_user_remote'
      t.string 'to_user_agency' #TODO: this should be an association, FK through to_user_locql
      t.string 'rejected_reason'
      t.text 'notes'
      t.string 'transitioned_by' #TODO: this should be a User association, FK
      t.string 'service'
      t.boolean 'is_remote', null: false, default: false
      t.string 'type_of_export'
      t.boolean 'consent_overridden', null: false, default: false
      t.boolean 'consent_individual_transfer', null: false, default: false
      t.datetime 'created_at'
    end
    add_index :transitions, [:record_type, :record_id]
  end
end