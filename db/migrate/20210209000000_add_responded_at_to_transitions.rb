# frozen_string_literal: true

class AddRespondedAtToTransitions < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :responded_at, :datetime
  end
end
