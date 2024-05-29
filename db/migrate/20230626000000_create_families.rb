# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateFamilies < ActiveRecord::Migration[5.0]
  def change
    create_table :families, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :families, :data, using: :gin
  end
end
