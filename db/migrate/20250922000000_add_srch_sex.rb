# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.
class AddSrchSex < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :srch_sex, :string
  end
end
