# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddShowOnTypeOfReferralToRole < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :show_on_type_of_referral, :boolean, null: false, default: false
  end
end
