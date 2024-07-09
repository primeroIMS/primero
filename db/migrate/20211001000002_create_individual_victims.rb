# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateIndividualVictims < ActiveRecord::Migration[6.1]
  def change
    create_table :individual_victims, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :individual_victims, :data, using: :gin

    create_table :individual_victims_violations do |t|
      t.belongs_to :violation, type: :uuid, index: true
      t.belongs_to :individual_victim, type: :uuid, index: true
    end
  end
end
