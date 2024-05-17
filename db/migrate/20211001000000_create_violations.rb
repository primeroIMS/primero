# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateViolations < ActiveRecord::Migration[6.1]
  def change
    create_table :violations, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'incident_id'
      t.uuid 'source_id'
    end
    add_foreign_key :violations, :incidents, column: 'incident_id'
    add_index :violations, :data, using: :gin
    add_index :violations, :incident_id
    add_index :violations, :source_id
  end
end
