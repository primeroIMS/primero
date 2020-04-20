# frozen_string_literal: true

class CreateIncidents < ActiveRecord::Migration[5.0]
  def change
    create_table :incidents, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'incident_case_id'
    end
    add_index :incidents, :data, using: :gin
    add_index :incidents, :incident_case_id
  end
end
