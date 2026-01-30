# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

class AddTermsOfUseAcknowledgeToSystemSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :system_settings, :terms_of_use_acknowledge, :jsonb
  end
end
