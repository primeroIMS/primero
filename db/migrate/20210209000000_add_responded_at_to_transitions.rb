# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddRespondedAtToTransitions < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :responded_at, :datetime
  end
end
