# frozen_string_literal: true

class CreateCases < ActiveRecord::Migration[5.0]
  enable_extension 'pgcrypto' unless ENV['PRIMERO_PG_APP_ROLE'] || extension_enabled?('pgcrypto')

  def change
    create_table :cases, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'matched_tracing_request_id'
      t.string 'matched_trace_id'
      t.uuid 'duplicate_case_id' # TODO: Index
    end
    add_index :cases, :data, using: :gin
  end
end
