# frozen_string_literal: true

class AddDataToTransition < ActiveRecord::Migration[8.1]
  def change
    add_column :transitions, :data, :jsonb, default: {}, null: false
  end
end
