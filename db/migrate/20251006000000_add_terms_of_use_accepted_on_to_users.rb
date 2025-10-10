# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

class AddTermsOfUseAcceptedOnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :terms_of_use_accepted_on, :datetime
  end
end
