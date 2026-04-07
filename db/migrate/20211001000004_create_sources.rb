# frozen_string_literal: true

class CreateSources < ActiveRecord::Migration[6.1]
  def change
    create_table :sources, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :sources, :data, using: :gin
    add_foreign_key :violations, :sources, column: 'source_id'
  end
end
