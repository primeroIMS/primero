# frozen_string_literal: true

class CreatePrimeroConfigurations < ActiveRecord::Migration[5.2]
  def change
    create_table :primero_configurations, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string 'name'
      t.string 'description'
      t.string 'version'
      t.string 'created_by'
      t.datetime 'created_on'
      t.string 'applied_by'
      t.datetime 'applied_on'
      t.jsonb 'data', default: {}
    end
  end
end
