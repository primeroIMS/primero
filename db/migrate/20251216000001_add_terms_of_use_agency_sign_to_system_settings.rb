# frozen_string_literal: true

class AddTermsOfUseAgencySignToSystemSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :system_settings, :terms_of_use_agency_sign, :jsonb
  end
end
