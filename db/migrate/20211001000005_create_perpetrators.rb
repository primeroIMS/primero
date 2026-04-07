# frozen_string_literal: true

class CreatePerpetrators < ActiveRecord::Migration[6.1]
  def change
    create_table :perpetrators, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :perpetrators, :data, using: :gin

    create_table :perpetrators_violations do |t|
      t.belongs_to :violation, type: :uuid, index: true
      t.belongs_to :perpetrator, type: :uuid, index: true
    end
  end
end
