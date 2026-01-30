# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

class AddUpdatedAtIndexToLookups < ActiveRecord::Migration[8.1]
  def change
    add_index :lookups, %i[updated_at]
  end
end
