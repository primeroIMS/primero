# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddCodeOfConductAcceptedOnToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :code_of_conduct_accepted_on, :datetime
    add_reference :users, :code_of_conduct, foreign_key: { to_table: 'codes_of_conduct' }
  end
end
