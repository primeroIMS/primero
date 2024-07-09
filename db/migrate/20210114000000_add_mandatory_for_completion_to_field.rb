# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddMandatoryForCompletionToField < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :mandatory_for_completion, :boolean, default: false, null: false
  end
end
