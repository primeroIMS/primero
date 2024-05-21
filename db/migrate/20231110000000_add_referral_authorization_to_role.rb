# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddReferralAuthorizationToRole < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :referral_authorization, :boolean, null: false, default: false
  end
end
