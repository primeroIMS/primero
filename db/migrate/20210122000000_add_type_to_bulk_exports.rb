# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddTypeToBulkExports < ActiveRecord::Migration[5.2]
  def change
    add_column :bulk_exports, :type, :string
  end
end
