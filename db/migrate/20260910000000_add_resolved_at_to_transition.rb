# frozen_string_literal: true

class AddResolvedAtToTransition < ActiveRecord::Migration[8.1]
  def change
    add_column :transitions, :resolved_at, :datetime
  end
end
