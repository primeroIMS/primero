# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddCollapseToFields < ActiveRecord::Migration[6.1]
  def change
    add_column :fields, :collapse, :string
  end
end
