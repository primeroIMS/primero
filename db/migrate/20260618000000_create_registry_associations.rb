# frozen_string_literal: true

class CreateRegistryAssociations < ActiveRecord::Migration[8.1]
  def change
    create_table 'registry_associations' do |t|
      t.references :registry_associable, polymorphic: true, null: false, type: :uuid
      t.references :registry_record, null: false, type: :uuid, index: true
      t.string :field_name, null: false
      t.string :subform_unique_id
      t.timestamps
    end
  end
end
