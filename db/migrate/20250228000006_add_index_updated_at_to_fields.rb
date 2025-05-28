# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddIndexUpdatedAtToFields < ActiveRecord::Migration[6.1]
  def change
    add_index :fields, :updated_at
  end
end
