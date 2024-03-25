# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateRegistryRecords < ActiveRecord::Migration[6.1]
  def change
    create_table :registry_records, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :registry_records, :data, using: :gin
  end
end
