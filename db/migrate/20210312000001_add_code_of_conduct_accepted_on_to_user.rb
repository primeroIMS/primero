class AddCodeOfConductAcceptedOnToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :code_of_conduct_accepted_on, :datetime
    add_reference :users, :code_of_conduct, foreign_key: true
  end
end
