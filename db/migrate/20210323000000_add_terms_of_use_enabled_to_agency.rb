# frozen_string_literal: true

class AddTermsOfUseEnabledToAgency < ActiveRecord::Migration[5.2]
  def change
    add_column :agencies, :terms_of_use_enabled, :boolean, null: false, default: false
  end
end
