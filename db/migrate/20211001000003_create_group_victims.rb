# frozen_string_literal: true

class CreateGroupVictims < ActiveRecord::Migration[6.1]
  def change
    create_table :group_victims, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :group_victims, :data, using: :gin

    create_table :group_victims_violations do |t|
      t.belongs_to :violation, type: :uuid, index: true
      t.belongs_to :group_victim, type: :uuid, index: true
    end
  end
end
