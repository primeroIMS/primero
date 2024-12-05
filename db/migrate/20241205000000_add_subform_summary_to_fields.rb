# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddSubformSummaryToFields < ActiveRecord::Migration[6.1]
  def change
    add_column :fields, :subform_summary, :jsonb
    add_index :fields, :subform_summary, using: :gin
  end
end
