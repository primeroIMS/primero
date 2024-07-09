# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddFieldOptionStringsCondition < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :option_strings_condition, :jsonb
  end
end
