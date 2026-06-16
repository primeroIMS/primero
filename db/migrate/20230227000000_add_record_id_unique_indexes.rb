# frozen_string_literal: true

class AddRecordIdUniqueIndexes < ActiveRecord::Migration[6.1]
  def change
    add_index :cases, "(data->>'case_id')", name: 'cases_case_id_unique_idx', using: 'btree', unique: true
    add_index :incidents, "(data->>'incident_id')", name: 'incidents_incident_id_unique_idx', using: 'btree',
                                                    unique: true
    add_index(
      :tracing_requests,
      "(data->>'tracing_request_id')",
      name: 'tracing_requests_tracing_request_id_unique_idx', using: 'btree', unique: true
    )
  end
end
