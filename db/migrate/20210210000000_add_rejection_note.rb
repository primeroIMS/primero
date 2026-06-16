# frozen_string_literal: true

class AddRejectionNote < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :rejection_note, :text
  end
end
