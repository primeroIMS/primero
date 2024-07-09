# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddFormSectionsDisplayConditions < ActiveRecord::Migration[6.1]
  def change
    add_column :form_sections, :display_conditions, :jsonb
  end
end
