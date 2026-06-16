# frozen_string_literal: true

class AddSrchSex < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :srch_sex, :string
  end
end
