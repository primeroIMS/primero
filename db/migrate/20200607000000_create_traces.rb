# frozen_string_literal: true

class CreateTraces < ActiveRecord::Migration[5.2]
  def change
    create_table :traces, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'tracing_request_id'
      t.uuid 'matched_case_id'
    end
    add_index :traces, :data, using: :gin
    add_index :traces, :tracing_request_id
    add_index :traces, :matched_case_id
  end
end
