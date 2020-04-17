# frozen_string_literal: true

class CreateTransitions < ActiveRecord::Migration[5.0]
  def change
    create_table :transitions, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string 'type'
      t.string 'status'
      t.string 'record_id'
      t.string 'record_type'
      t.string 'transitioned_to'
      t.string 'transitioned_to_remote'
      t.string 'transitioned_to_agency'
      t.string 'rejected_reason'
      t.text 'notes'
      t.string 'transitioned_by'
      t.string 'service'
      t.string 'service_record_id'
      t.boolean 'remote', null: false, default: false
      t.string 'type_of_export'
      t.boolean 'consent_overridden', null: false, default: false
      t.boolean 'consent_individual_transfer', null: false, default: false
      t.datetime 'created_at'
    end
    add_index :transitions, %i[id type]
    add_index :transitions, %i[record_type record_id]
  end
end
