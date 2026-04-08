# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
class AddAgencyProfileFields < ActiveRecord::Migration[8.1]
  def change
    add_column :agencies, :contact_name, :string
    add_column :agencies, :contact_email, :string
    add_column :agencies, :contact_phone, :string
    add_column :agencies, :notes, :text
  end
end
