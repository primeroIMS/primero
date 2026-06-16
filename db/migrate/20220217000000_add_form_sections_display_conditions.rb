# frozen_string_literal: true

class AddFormSectionsDisplayConditions < ActiveRecord::Migration[6.1]
  def change
    add_column :form_sections, :display_conditions, :jsonb
  end
end
