# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
class AddPhoneNumberFlag < ActiveRecord::Migration[8.1]
  def change
    add_column :fields, :phone_number, :boolean, default: false
  end
end
