# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddTermsOfUseEnabledToAgency < ActiveRecord::Migration[5.2]
  def change
    add_column :agencies, :terms_of_use_enabled, :boolean, null: false, default: false
  end
end
