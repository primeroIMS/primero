# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateResponses < ActiveRecord::Migration[6.1]
  def change
    create_table :responses, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
      t.uuid 'violation_id'
    end
    add_foreign_key :responses, :violations, column: 'violation_id'
    add_index :responses, :data, using: :gin
    add_index :responses, :violation_id
  end
end
