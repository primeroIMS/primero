# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddPhoneticData < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :phonetic_data, :jsonb
    add_column :incidents, :phonetic_data, :jsonb
    add_column :tracing_requests, :phonetic_data, :jsonb
    add_column :families, :phonetic_data, :jsonb
    add_column :registry_records, :phonetic_data, :jsonb

    add_index :cases, "(phonetic_data->'tokens')", using: :gin, name: 'cases_phonetic_tokens_idx'
    add_index :incidents, "(phonetic_data->'tokens')", using: :gin, name: 'incidents_phonetic_tokens_idx'
    add_index :tracing_requests, "(phonetic_data->'tokens')", using: :gin, name: 'tracing_requests_phonetic_tokens_idx'
    add_index :families, "(phonetic_data->'tokens')", using: :gin, name: 'families_tokens_idx'
    add_index :registry_records, "(phonetic_data->'tokens')", using: :gin, name: 'registry_records_phonetic_tokens_idx'
  end
end
