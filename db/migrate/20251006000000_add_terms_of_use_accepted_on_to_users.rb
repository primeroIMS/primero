# frozen_string_literal: true

class AddTermsOfUseAcceptedOnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :terms_of_use_accepted_on, :datetime
  end
end
